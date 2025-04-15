# 🎬 YouTube Video Summarizer

An AI-powered web application that allows users to input any YouTube video URL and receive a concise, language-translated summary. Built with **FastAPI**, **React**, **Vite**, and **Tailwind CSS**, this tool leverages OpenAI's Whisper and GPT-4o models to transcribe, translate, and summarize video content.

---

## ✨ Features

- 🎥 **YouTube Integration**: Input any YouTube video URL to generate summaries.
- 🧠 **AI-Powered Summarization**: Utilizes OpenAI's Whisper for transcription and GPT-4o for summarization.
- 🌐 **Multilingual Support**: Automatically detects and translates non-English videos into English summaries.
- 📊 **Usage Limits**: Restricts users to 5 video summaries per day based on device ID.
- 🔐 **User Authentication**: Optional login system to manage user access and history.
- 💾 **History Tracking**: Logged-in users can view their summary history.
- 🎨 **Responsive UI**: Clean and intuitive interface built with React and Tailwind CSS.

---

## 🚀 Tech Stack

**Frontend**

- React
- Vite
- TypeScript
- Tailwind CSS

**Backend**:

- FastAPI
- Python
- OpenAI Whisper & GPT-4o
- SQLite

---

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

## FRONTEND SETUP

1. Navigate to the backend directory:

   ```bash
   cd ytsummary-api

2. Create virtual environment

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    
3. Install dependencies

    ```bash
    pip install -r requirements.txt

4. Setup environment files
    ```bash
    OPENAI_API_KEY=your_openai_api_key
    
5. Run the backend server
    ```bash
    uvicorn main:app --reload
    


## FRONTEND SETUP
1. Navigate to the ytsummary-app directory:

   ```bash
   cd ytsummary-app

2. Install dependencies

    ```bash
    npm install

3. Run the frontend dev server

    ```bash
    npm run dev

