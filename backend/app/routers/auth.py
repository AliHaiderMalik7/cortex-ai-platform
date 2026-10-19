from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import create_access_token, hash_password, verify_password
from app.database import get_db
from app.db_models import UserDB
from app.dependencies import get_current_user
from app.models import Token, UserLogin, UserOut, UserSignup

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=Token)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Always "user" - see UserSignup's docstring for why agent/admin can't
    # self-assign their own role here.
    new_user = UserDB(email=data.email, hashed_password=hash_password(data.password), role="user")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(new_user.id, new_user.role)
    return Token(access_token=token, user=UserOut.model_validate(new_user))


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.email == data.email).first()
    # Same error for "no such email" and "wrong password" - don't let an
    # attacker use the error message to discover which emails are registered.
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user.id, user.role)
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def read_current_user(user: UserDB = Depends(get_current_user)):
    return user
