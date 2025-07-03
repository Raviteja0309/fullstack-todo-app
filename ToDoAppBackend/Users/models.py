from pydantic import BaseModel


class UsersRequest(BaseModel):
    role: str