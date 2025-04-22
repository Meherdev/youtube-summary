from fastapi import FastAPI, HTTPException, Form, Depends, Response, Request, status
from utils import download_audio, get_file_size_mb, transcribe_audio, summarize_text, get_audio_duration, get_db, check_summary_limit, increment_summary_count
import os, shutil
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import engine
import models
from dotenv import load_dotenv
from models import Base, User, SummaryUsage
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from utils import hash_password, verify_password
from auth import create_access_token
from jose import jwt, JWTError
from pydantic import EmailStr, BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://youtube-summary-nu.vercel.app"],
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    print("token", token)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        print("Decoding token...",  token)
        payload = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
        username = payload.get("sub")
        print("Decoded username:", username)
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@app.post("/register")
def register(username: EmailStr, password: str, response: Response, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = hash_password(password)
    new_user = User(username=username, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.username})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,  # only works over HTTPS in production
        samesite="None",
        max_age=60 * 60  # 1 hour
    )

    return {
        "username": new_user.username,
        "message": "Registration successful"
    }

@app.post("/token")
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.username})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=60 * 60
    )

    return {
        "username": user.username,
        "message": "Login successful"
    }



@app.post("/summarize")
async def summarize_video(youtube_url: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:        
        if not check_summary_limit(current_user.id, db):
            raise HTTPException(status_code=429, detail="Daily summary limit exceeded (5 per day).")
        audio_path = download_audio(youtube_url)
        size = get_file_size_mb(audio_path)

        if size > 25:
            shutil.rmtree("downloads", ignore_errors=True)
            raise HTTPException(status_code=413, detail=f"Audio too large ({size}MB). Must be ≤25MB.")
        
        duration = get_audio_duration(audio_path)
        duration_minutes = round(duration / 60)
        transcript = transcribe_audio(audio_path)
        summary = summarize_text(transcript)

        shutil.rmtree("downloads", ignore_errors=True)
        increment_summary_count(current_user.id, db)
        return {
            "audio_size_mb": size,
            "duration_minutes": duration_minutes,
            "transcript": transcript,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


# /me endpoint to return the logged‑in user's info
class MeResponse(BaseModel):
    username: str

@app.get("/me", response_model=MeResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username}


# /logout endpoint to clear the cookie
@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out successfully"}

