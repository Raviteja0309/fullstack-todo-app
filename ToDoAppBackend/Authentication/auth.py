from fastapi import HTTPException, Response, status, APIRouter
from dbConnection import DbConnection
from passlib.context import CryptContext
from Authentication.models import LoginRequest, UserInputRequest
from datetime import datetime, timedelta, timezone
from jose import jwt
from dotenv import dotenv_values

auth_router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

config = dotenv_values(".env")

SECRET_KEY = config.get("SECRET_KEY")
ALGORITHM = config.get("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(config.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

def authenticate_user(username: str, password: str):
    with DbConnection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        if not user or not pwd_context.verify(password, user[5]):
            return False
        return user
        

def create_access_token(username: str, user_id: int, userrole: str, expires_delta: timedelta):
    to_encode = {
        "sub": username,
        "id": user_id,
        "role": userrole,
        "exp": datetime.now(timezone.utc) + expires_delta
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@auth_router.post("/generate_token")
async def user_login(response: Response, input: LoginRequest):
    user = authenticate_user(input.username, input.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    token = create_access_token(username=user[3], user_id=user[0], userrole=user[6],
                                    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=20 * 60,
        path="/"
    )

    return {
        "message": "Login Successfull",
        "userdata": {
            "id": user[0],
            "username": user[3],
            "email": user[4],
            "first_name": user[1],
            "last_name": user[2],
            "role": user[6],
            "status": user[7],
        }
    }

@auth_router.post("/signup")
async def user_signup(input: UserInputRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE username = %s", (input.username,))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )

        hashed_password = pwd_context.hash(input.password)

        cursor.execute(
            """
            INSERT INTO users (firstname, lastname, username, email, password, role, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (input.firstname, input.lastname, input.username, input.email, hashed_password, input.role, input.status)
        )
        conn.commit()

    return {"message": "User registered successfully"}
