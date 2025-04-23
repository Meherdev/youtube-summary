#!/usr/bin/env bash
apt-get update && apt-get install -y ffmpeg
pip install -r ytsummary-api/requirements.txt
python3 -m pip install yt-dlp

if [ -n "$COOKIE_B64" ]; then
  echo "$COOKIE_B64" | base64 -d > /app/cookies.txt
  echo "✅ cookies.txt created from COOKIE_B64 env variable"
else
  echo "⚠️ COOKIE_B64 not set. YouTube downloads may fail."
fi