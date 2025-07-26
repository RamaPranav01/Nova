<h1 align="center">Nova - The Universal Trust Layer for AI</h1>

<p align="center">
  <strong>An intelligent, real-time gateway that provides an essential layer of security, trust, and safety for Large Language Models.</strong>
</p>

<p align="center">
    <a href="URL_TO_LIVE_DEMO_WHEN_READY"><strong>Live Demo</strong></a>
    ·
    <a href="#-key-features"><strong>Features</strong></a>
    ·
    <a href="#-tech-stack"><strong>Tech Stack</strong></a>
    ·
    <a href="#-architecture-deep-dive"><strong>Architecture</strong></a>
</p>

<p align="center">
  <!-- BADGES: Replace placeholders with actual links -->
  <img src="https://img.shields.io/badge/Project%20Status-In%20Development-yellowgreen" alt="Project Status"/>
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License"/>
  <img src="https://img.shields.io/github/last-commit/your-username/aegis-gateway" alt="Last Commit"/>
  <img src="https://img.shields.io/github/stars/your-username/aegis-gateway?style=social" alt="GitHub Stars"/>
</p>

---

## 💡 The Vision: Making AI Safe for Everyone

Generative AI is revolutionary, but its deployment is plagued by critical vulnerabilities. From **prompt-injection attacks** and **sensitive data leaks** to **factual hallucinations** and the spread of **deepfakes**, the risks are immense. Nova solves this.

We are building a comprehensive, developer-first security and quality gateway. By acting as a smart proxy, Nova intercepts and analyzes every interaction with an LLM, ensuring that every prompt is safe and every response is secure, accurate, and aligned with ethical policies. Our mission is to provide the essential trust layer that will unlock the full potential of AI for businesses and the public alike.

## ✨ Key Features

Nova is architected as a modular platform, allowing us to layer on increasingly sophisticated protections.

| Category               | Feature                               | Status      | Description                                                                                             |
| ---------------------- | ------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| 🛡️ **Core Security**     | **Prompt Injection Defense**          | 🚧 V1       | Uses an LLM critic to detect and block malicious prompts designed to hijack the AI.                       |
|                        | **Dynamic Threat Freezing**           | 🚧 V2       | Learns from new attacks; allows human mods to "freeze" a threat vector for instant future blocking.    |
|                        | **PII & Data Bleed Detection**        | 🚧 V3       | Scans prompts for sensitive data (PII, custom keywords) to prevent leaks to third-party models.      |
|                        | **Deepfake & Synthetic Media Scan**   | 🚧 V3       | Integrates specialized APIs to detect AI-generated images and audio with high accuracy.                 |
| 🌐 **Trust & Reliability** | **Hallucination & Citation Check**    | 🚧 V2       | Verifies factual claims and flags responses with fabricated sources.                                    |
|                        | **Source Reputation & Rumor Check**   | 🚧 V3       | Checks URLs against reputation services (e.g., NewsGuard) and cross-references claims with live web search results. |
|                        | **Knowledge Base Grounding (RAG)**      | 🚧 V3       | Ensures AI responses are grounded *only* in user-provided documents for maximum accuracy.                 |
| 📜 **Governance & Audit** | **Custom Policy Engine**              | 🚧 V1       | Enforces user-defined ethical and brand policies (e.g., "no medical advice") in real-time.            |
|                        | **Immutable Audit Logs**              | 🚧 V2       | Creates a cryptographically-chained, tamper-proof log of every transaction for compliance.          |
| ⚙️ **Performance**       | **Semantic Cache**                    | 🚧 V2       | Drastically reduces cost & latency by serving cached responses for semantically similar prompts.        |
|                        | **Analytics Dashboard**               | 🚧 V2       | Provides rich visualizations of threats, costs, savings, and performance metrics.                       |

**Deadline:** V1 - Mid August , V2 - Mid September , V3 - Mid October

## 🏛️ Architecture Deep-Dive

Nova operates as a high-performance, asynchronous API proxy built on a "multi-critic" architecture. This design allows for parallel processing and defense-in-depth.

<p align="center">
  *(This is the PERFECT place for a high-quality architecture diagram you create with a tool like Excalidraw or Miro)*
  <br/>
  *Image: High-level overview showing User App -> Nova (Inbound/Outbound Checks) -> LLM -> Nova -> User App*
</p>

1.  **Ingestion & Fast Path:** An incoming request is immediately checked against our **Qdrant**-powered Semantic Cache and Threat Vector database. This handles the majority of common requests and known attacks with millisecond latency.
2.  **Inbound Analysis:** If not cached, the prompt is sanitized and passed to our **Inbound Security Critic** (a `gpt-4-turbo` agent) to analyze intent and structure.
3.  **LLM Interaction:** The validated prompt is sent to the primary LLM.
4.  **Outbound Analysis (The Multi-Critic Pipeline):** The LLM's response is sent to a panel of specialized critics *in parallel* using `asyncio.gather` for maximum throughput. This includes critics for policy, factual accuracy, and source reputation.
5.  **Remediation & Logging:** A final verdict is reached. The action (ALLOW, BLOCK, WARN, REWRITE) is executed, and the entire transaction, including all metadata and critic reasoning, is logged to PostgreSQL with a **chained SHA-256 hash** to ensure immutability.

## 🛠️ Tech Stack

This project is built with a focus on type-safety, performance, and developer experience.

**Backend:**
![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-FF9900?logo=qdrant)
![Docker](https://img.shields.io/badge/Docker-24-2496ED?logo=docker)
![Poetry](https://img.shields.io/badge/Poetry-1.6-60A5FA?logo=poetry)

**Frontend:**
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?logo=vercel)

## 🚀 Local Development

Instructions to get the Nova development environment up and running.

<details>
<summary><strong>Click to expand for setup instructions</strong></summary>

### Prerequisites

Make sure you have the following tools installed on your system.

*   **[Node.js](https://nodejs.org/en/)**: Version `20.x` or later.
    *   We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to manage Node.js versions.
*   **[pnpm](https://pnpm.io/installation)**: Version `8.x` or later.
    *   The preferred package manager for this monorepo. Install with `npm install -g pnpm`.
*   **[Python](https://www.python.org/downloads/)**: Version `3.11.x` or later.
*   **[Poetry](https://python-poetry.org/docs/#installation)**: Version `1.7.x` or later.
    *   The dependency manager for our Python backend.
*   **[Docker](https://www.docker.com/products/docker-desktop/)**: The latest version of Docker Desktop.
    *   Required to run our PostgreSQL and Qdrant database containers.


### Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/aegis-gateway.git
    cd aegis-gateway
    ```

2.  **Install Dependencies**
    ```bash
    # This installs both frontend and backend dependencies
    pnpm install
    ```

3.  **Configure Environment Variables**
    ```bash
    # Copy the example environment files
    cp packages/backend/.env.example packages/backend/.env
    cp packages/frontend/.env.local.example packages/frontend/.env.local

    # Now, fill in the required values in both .env files
    ```

4.  **Launch Services with Docker Compose**
    *We use Docker Compose to run the database and other services locally.*
    ```bash
    docker-compose up -d
    ```

5.  **Run Database Migrations**
    *From within the `packages/backend` directory:*
    ```bash
    poetry run alembic upgrade head
    ```

6.  **Start the Development Servers**
    *From the root directory:*
    ```bash
    pnpm dev
    ```
    Your application should now be running, with the frontend on `http://localhost:3000` and the backend on `http://localhost:8000`.

</details>

## 🤝 Contributing

This project was built for the **OpenAI x NxtWave Hackathon**. We welcome contributions and ideas from the community. Please feel free to open an issue or submit a pull request.

## ⚖️ License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---
<p align="center">
  A project by [Rama Pranav , Sanjana , Tejsai , Shlok]. If you like our work, please ⭐ this repository!
</p>