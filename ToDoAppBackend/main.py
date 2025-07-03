from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from Authentication import auth
from Users import users
from ToDos import todos

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.auth_router)
app.include_router(todos.todos_router)
app.include_router(users.users_router)

@app.get("/")
def read_root():
    return {"message": "FastAPI app is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5174, reload=True)


