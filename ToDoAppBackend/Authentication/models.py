from pydantic import BaseModel

class UserInputRequest(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: str
    password: str
    role: str
    status: str
    
class LoginRequest(BaseModel):
    username: str
    password: str