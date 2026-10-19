import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

# In a real deployment this MUST come from an environment variable, not a
# hardcoded fallback - anyone with this value can forge valid tokens.
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-insecure-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day


def hash_password(password: str) -> str:
    # bcrypt works on bytes and returns bytes - decode to store as a normal
    # string column. The salt is embedded in the hash itself, so verifying
    # later needs nothing but the password and this stored hash.
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed_password.encode())


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Raises jwt.PyJWTError (expired/invalid/tampered) - callers decide how to respond."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
