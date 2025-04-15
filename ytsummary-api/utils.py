import os
import subprocess
from openai import OpenAI
from dotenv import load_dotenv
import json
from datetime import datetime, timezone
from models import DeviceRequest
from sqlalchemy.orm import Session
from db import SessionLocal

load_dotenv()

client = OpenAI(
  api_key=os.getenv("OPENAI_API_KEY"),
)

def download_audio(url: str, output_dir="downloads") -> str:
    os.makedirs(output_dir, exist_ok=True)
    command = [
        "yt-dlp",
        "-f", "bestaudio[abr<=64]",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "9",
        "-o", f"{output_dir}/%(id)s.%(ext)s",
        url
    ]
    subprocess.run(command, check=True)
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

def is_device_allowed(db: Session, device_id: str) -> bool:
    today = datetime.now(timezone.utc).date()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())

    count = db.query(DeviceRequest).filter(
        DeviceRequest.device_id == device_id,
        DeviceRequest.created_at >= start_of_day,
        DeviceRequest.created_at <= end_of_day
    ).count()

    return count < 8

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

