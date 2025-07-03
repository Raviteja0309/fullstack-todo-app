from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Authentication import auth
from Users import users
from ToDos import todos

app = FastAPI()

origins = [
    "http://localhost:5173",  # And later your frontend domain on Netlify
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
