import openai
import os
from fastapi import APIRouter, HTTPException, status, Body
from pydantic import BaseModel, Field
from app.services.ai_critics import check_prompt_injection, check_custom_policy, SecurityCritic_Response, PolicyCritic_Response
from .logs import create_log_entry 

try:
    client = openai.AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
except TypeError:
    client = None

router = APIRouter(
    prefix="/v1", 
    tags=["Gateway V1"], 
)


class GatewayRequest(BaseModel):
    """The request model for the main gateway endpoint."""
    prompt: str = Field(..., description="The user's prompt for the LLM.", example="What is the capital of France?")
    policy: str = Field(
        default="Default policy: Be helpful and harmless.", 
        description="The policy to enforce on the LLM's response.",
        example="Do not give financial advice."
    )

class GatewayResponse(BaseModel):
    """The response model for the main gateway endpoint."""
    llm_response: str = Field(description="The final, vetted response from the LLM.")
    inbound_check: SecurityCritic_Response
    outbound_check: PolicyCritic_Response



@router.post("/nova-chat", response_model=GatewayResponse)
async def nova_chat(request: GatewayRequest):
    """
    The main V1 endpoint for the Nova gateway.
    It performs a security check, gets an LLM response, and then a policy check.
    """
    if not client:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="OpenAI client not configured.")

    # --- 1. Inbound Check: Prompt Injection ---
    security_check = await check_prompt_injection(request.prompt)
    
    if security_check.verdict == "MALICIOUS":
        # If malicious, stop everything. Log the attempt and raise an error.
        await create_log_entry(
            request_prompt=request.prompt,
            response_text="BLOCKED",
            inbound_check=security_check.model_dump(), # Pydantic's way of converting the model to a dict
            outbound_check=None,
            final_verdict="BLOCKED"
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Prompt rejected as potentially malicious. Reason: {security_check.reasoning}"
        )

    # --- 2. Core AI Call ---
    try:
        main_llm_response = await client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": request.prompt}
            ]
        )
        llm_text_response = main_llm_response.choices[0].message.content or "No response from model."
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error calling primary LLM: {e}")

    # --- 3. Outbound Check: Custom Policy ---
    policy_check = await check_custom_policy(text_to_check=llm_text_response, policy=request.policy)
    
    final_response_text = llm_text_response
    if policy_check.verdict == "FAIL":
        # For V1, we will just warn and pass through. V2 will have 'REWRITE' logic.
        final_response_text = f"[POLICY WARNING: {policy_check.reasoning}] {llm_text_response}"

    # --- 4. Final Logging ---
    await create_log_entry(
        request_prompt=request.prompt,
        response_text=final_response_text,
        inbound_check=security_check.model_dump(),
        outbound_check=policy_check.model_dump(),
        final_verdict="ALLOWED"
    )

    # --- 5. Send Response ---
    return GatewayResponse(
        llm_response=final_response_text,
        inbound_check=security_check,
        outbound_check=policy_check
    )