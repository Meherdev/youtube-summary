#!/usr/bin/env bash
apt-get update && apt-get install -y ffmpeg
pip install -r ytsummary-api/requirements.txt
python3 -m pip install yt-dlp
