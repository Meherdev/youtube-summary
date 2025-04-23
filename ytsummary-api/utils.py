import os
import subprocess
from openai import OpenAI
from dotenv import load_dotenv
import json
from datetime import date
from sqlalchemy.orm import Session
from db import SessionLocal
from passlib.context import CryptContext
from models import SummaryUsage
from fastapi import HTTPException
import shutil


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

load_dotenv()

client = OpenAI(
  api_key=os.getenv("OPENAI_API_KEY"),
)

def download_audio(url: str, output_dir="downloads") -> str:
    source_cookie_path = "/etc/secrets/cookies.txt"
    temp_cookie_path = f"/tmp/cookies.txt"
        # ✅ Copy cookies.txt to a writable location
    if os.path.exists(source_cookie_path):
        shutil.copy(source_cookie_path, temp_cookie_path)
        print("✅ cookies.txt copied to /tmp")
    else:
        print("⚠️ cookies.txt not found at expected path.")
        raise Exception("Authentication cookies missing.")
    os.makedirs(output_dir, exist_ok=True)
    command = [
        "yt-dlp",
        "--cookies", temp_cookie_path, 
        "-f", "bestaudio[abr<=64]",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "9",
        "-o", f"{output_dir}/%(id)s.%(ext)s",
        url
    ]
    try:
        subprocess.run(command, check=True)
    except subprocess.CalledProcessError as e:
        print("yt-dlp failed:", e.stderr)
        raise HTTPException(status_code=500, detail="Failed to download video. Server error.")
    for file in os.listdir(output_dir):
        if file.endswith(".mp3"):
            return os.path.join(output_dir, file)
    raise Exception("Audio not downloaded")

def get_file_size_mb(path):
    return round(os.path.getsize(path) / (1024 * 1024), 2)

def get_audio_duration(path):
    result = subprocess.run([
        "ffprobe", "-v", "error", "-show_entries",
        "format=duration", "-of", "json", path
    ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    output = json.loads(result.stdout)
    return float(output["format"]["duration"])

def transcribe_audio(file_path):
    with open(file_path, "rb") as audio_file:
        translated = client.audio.translations.create(
            model="whisper-1",
            file=audio_file
        )
    return translated.text

def summarize_text(text: str) -> str:
    prompt = f"Summarize the following video transcript:\n\n{text[:4000]}"
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300
    )
    return response.choices[0].message.content.strip()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def check_and_increment_summary_usage(user_id: int, db: Session, daily_limit: int = 5):
    today = date.today()
    usage = db.query(SummaryUsage).filter_by(user_id=user_id, date=today).first()

    if usage and usage.count >= daily_limit:
        return False  # Limit exceeded

    if usage:
        usage.count += 1
    else:
        usage = SummaryUsage(user_id=user_id, date=today, count=1)
        db.add(usage)

    db.commit()
    return True

def check_summary_limit(user_id: int, db: Session, daily_limit: int = 5) -> bool:
    today = date.today()
    usage = db.query(SummaryUsage).filter_by(user_id=user_id, date=today).first()
    if usage and usage.count >= daily_limit:
        return False
    return True

def increment_summary_count(user_id: int, db: Session):
    today = date.today()
    usage = db.query(SummaryUsage).filter_by(user_id=user_id, date=today).first()
    
    if usage:
        usage.count += 1
    else:
        usage = SummaryUsage(user_id=user_id, date=today, count=1)
        db.add(usage)
    
    db.commit()