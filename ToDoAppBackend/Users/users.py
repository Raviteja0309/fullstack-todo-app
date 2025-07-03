from fastapi import HTTPException, APIRouter
from Users.models import UsersRequest
from dbConnection import DbConnection

users_router = APIRouter(prefix="/users", tags=["USERS"])

@users_router.post("/all_users")
async def get_all_users(request: UsersRequest):
    with DbConnection() as conn:
        cursor = conn.cursor()
        if request.role != "admin":
            raise HTTPException(status_code=403, detail="Access denied. Only admins can view all users.")
        cursor.execute("SELECT * FROM users WHERE role != 'Admin' ORDER BY userid")
        users = cursor.fetchall()
        if not users:
            raise HTTPException(status_code=404, detail="No users found")
        return [{"id": user[0], "username": user[3], "role": user[6]} for user in users]
        
        