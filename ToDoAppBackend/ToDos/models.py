from pydantic import BaseModel


class AddToDoRequest(BaseModel):
    owner_id: int
    title: str
    description: str
    priority: int
    status: str = "pending"
    

class GetToDosRequest(BaseModel):
    owner_id: int
    
class DeleteToDoRequest(BaseModel):
    owner_id: int
    todo_id: int
    
class UpdateToDoRequest(BaseModel):
    owner_id: int
    todo_id: int
    title: str
    description: str
    priority: int
    status: str = "pending"
    