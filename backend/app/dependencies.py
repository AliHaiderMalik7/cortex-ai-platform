import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.auth import decode_access_token
from app.database import get_db
from app.db_models import UserDB

# auto_error=False lets a request with NO Authorization header through to the
# dependency function instead of FastAPI rejecting it outright - required for
# get_current_user_optional (anonymous access) to work.
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> UserDB:
    """Use on routes that REQUIRE a logged-in user (agent/admin-only routes)."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.get(UserDB, int(payload["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail="User no longer exists")
    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> UserDB | None:
    """Use on routes that ALLOW anonymous access (e.g. creating a ticket as
    a plain 'user') - returns None instead of raising when there's no token,
    so the caller can decide: logged in -> attach user_id, anonymous -> NULL.
    """
    if credentials is None:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        return None
    return db.get(UserDB, int(payload["sub"]))


def require_role(*allowed_roles: str):
    """Factory for role-gated routes, e.g. Depends(require_role("agent", "admin")).
    Reuses get_current_user, so it also enforces "must be logged in" first.
    """

    def checker(user: UserDB = Depends(get_current_user)) -> UserDB:
        if user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {' or '.join(allowed_roles)}")
        return user

    return checker
