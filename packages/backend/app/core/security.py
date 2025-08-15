from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

# This creates a CryptContext instance for password hashing.
# We specify that bcrypt is the algorithm to use.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# This is the algorithm we'll use to sign the JWTs. HS256 is standard.
ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta | None = None) -> str:
    """
    Generates a JWT access token.
    :param subject: The data to be encoded in the token (e.g., user ID).
    :param expires_delta: The lifespan of the token.
    :return: The encoded JWT as a string.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against its hashed version.
    :param plain_password: The password to check.
    :param hashed_password: The stored hashed password.
    :return: True if the passwords match, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hashes a plain password.
    :param password: The plain password to hash.
    :return: The hashed password as a string.
    """
    return pwd_context.hash(password)