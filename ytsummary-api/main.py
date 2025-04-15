from fastapi import FastAPI, HTTPException, Form, Depends
from utils import download_audio, get_file_size_mb, transcribe_audio, summarize_text, get_audio_duration, is_device_allowed, get_db
import os, shutil
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import engine
import models
from models import DeviceRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


@app.post("/summarize")
async def summarize_video(youtube_url: str = Form(...),
    device_id: str = Form(...),
    db: Session = Depends(get_db)
):
    try:        
        if not is_device_allowed(db, device_id):
            raise HTTPException(status_code=429, detail="Limit exceeded: Only 5 videos allowed per day")
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
        db.add(DeviceRequest(device_id=device_id))
        db.commit()
        return {
            "audio_size_mb": size,
            "duration_minutes": duration_minutes,
            "transcript": transcript,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
