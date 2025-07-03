from fastapi import HTTPException, Response, status, APIRouter
from ToDos.models import AddToDoRequest, DeleteToDoRequest, GetToDosRequest, UpdateToDoRequest
from dbConnection import DbConnection

todos_router = APIRouter(prefix="/todos", tags=["TODOS"])

@todos_router.post("/add_todo")
async def add_todo(response: Response, todo_request: AddToDoRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO todos (owner_id, title, description, priority, status)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (todo_request.owner_id, todo_request.title, todo_request.description, todo_request.priority, todo_request.status))
        conn.commit()
    return {"message": "ToDo added successfully"}

@todos_router.post("/all_todos")
async def get_todos(todo_request: GetToDosRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM todos WHERE owner_id = %s ORDER BY todo_id", (todo_request.owner_id,))
        todos = cursor.fetchall()
        if not todos:
            raise HTTPException(status_code=404, detail="No todos found for this user")
        return [{"id": todo[0], "owner_id": todo[1], "title": todo[2], "description": todo[3], "priority": todo[4], "status": todo[5]} for todo in todos]


@todos_router.delete("/delete_todo")
async def delete_todo(todo_request: DeleteToDoRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM todos WHERE todo_id = %s AND owner_id = %s", (todo_request.todo_id, todo_request.owner_id))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="ToDo not found or does not belong to this user")
        conn.commit()
    return {"message": "ToDo deleted successfully"}


@todos_router.put("/update_todo")
async def update_todo(todo_request: UpdateToDoRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE todos
            SET title = %s, description = %s, priority = %s, status = %s
            WHERE todo_id = %s AND owner_id = %s
            """,
            (todo_request.title, todo_request.description, todo_request.priority, todo_request.status, todo_request.todo_id, todo_request.owner_id))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="ToDo not found or does not belong to this user")
        conn.commit()
    return {"message": "ToDo updated successfully"}