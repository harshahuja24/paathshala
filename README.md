# Paathshala — Fresh Setup Guide

## 1. Prerequisites (install these first)

| Tool | Download |
|---|---|
| **Python 3.11** | https://www.python.org/downloads/release/python-3110/ |
| **Node.js (LTS)** | https://nodejs.org/ |
| **Git** | https://git-scm.com/downloads |
| **Git LFS** | https://git-lfs.com/ (needed for video files) |
| **FFmpeg** | https://ffmpeg.org/download.html → add to system PATH |

> [!IMPORTANT]
> FFmpeg must be added to your system PATH or Whisper will fail at transcription.

---

## 2. Clone the Repo

```bash
git lfs install
git clone https://github.com/harshahuja24/paathshala.git
cd paathshala
git lfs pull
```

> `git lfs pull` downloads the MP4 video files — may take a few minutes depending on internet speed.

---

## 3. Backend Setup (Python)

```bash
# Create virtual environment
python -m venv venv311

# Activate it
# Windows:
venv311\Scripts\activate
# Mac/Linux:
source venv311/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> [!NOTE]
> `torch` and `openai-whisper` are large downloads (~2GB). This step will take a while.

---

## 4. Environment Variables

Create a `.env` file in the root of the project:

```bash
# Windows
echo GOOGLE_API_KEY=your_api_key_here > .env

# Mac/Linux
echo "GOOGLE_API_KEY=your_api_key_here" > .env
```

Get your Google Gemini API key from: https://aistudio.google.com/app/apikey

---

## 5. Frontend Setup (React)

```bash
cd frontend
npm install
cd ..
```

---

## 6. Run the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
# From project root, with venv activated
venv311\Scripts\activate     # Windows
# source venv311/bin/activate  # Mac/Linux

python app.py
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

Then open your browser at: **http://localhost:3000**

---

## Quick Reference — All Commands in Order

```bash
git lfs install
git clone https://github.com/harshahuja24/paathshala.git
cd paathshala
git lfs pull

python -m venv venv311
venv311\Scripts\activate

pip install -r requirements.txt

echo GOOGLE_API_KEY=your_key_here > .env

cd frontend
npm install
cd ..
```

Then to run:
```bash
# Terminal 1
venv311\Scripts\activate
python app.py

# Terminal 2
cd frontend
npm start
```
