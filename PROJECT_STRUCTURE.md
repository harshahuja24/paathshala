# Paathshala - Educational Video Platform

## Project Overview
Paathshala is a full-stack educational platform that allows users to upload educational videos, automatically transcribe them using Whisper AI, and generate various learning aids using Google Gemini AI.

## Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **AI/ML**: 
  - OpenAI Whisper (for speech-to-text transcription)
  - Google Gemini AI (for summaries, concepts, practice questions, flashcards)
- **Other**: Flask-CORS, Werkzeug

### Frontend
- **Framework**: React 19.2.0
- **Styling**: Tailwind CSS 3.4.18
- **Icons**: Lucide React
- **Build Tool**: React Scripts 5.0.1

---

## Directory Structure

```
paathshala/
├── app.py                      # Main Flask backend server
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── PROJECT_STRUCTURE.md        # This file
│
├── data/                       # JSON data storage
│   ├── analytics.json         # Analytics data
│   ├── notes.json             # User notes
│   ├── students.json          # Student records
│   ├── summaries.json         # Generated summaries
│   └── videos.json            # Video metadata
│
├── frontend/                   # React frontend application
│   ├── package.json           # Node.js dependencies
│   ├── package-lock.json      # Locked dependency versions
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── README.md               # Frontend documentation
│   │
│   ├── public/                 # Static public assets
│   │   ├── index.html          # HTML template
│   │   ├── favicon.ico         # Favicon
│   │   ├── manifest.json       # PWA manifest
│   │   ├── robots.txt          # Robots.txt
│   │   ├── logo192.png         # App logo (192px)
│   │   └── logo512.png         # App logo (512px)
│   │
│   └── src/                   # React source code
│       ├── index.js           # React entry point
│       ├── index.css          # Global CSS styles
│       ├── App.js             # Main App component
│       ├── App.css            # App-specific styles
│       ├── App.test.js        # App tests
│       ├── logo.svg           # React logo
│       ├── reportWebVitals.js  # Web Vitals reporting
│       └── setupTests.js      # Test setup
│
├── uploads/                    # Uploaded video files
│   ├── *.mp4                   # Video files (SVM, Markovnikovs Rule, etc.)
│   └── ...
│
├── transcripts/                # Generated transcripts
│   ├── *.json                 # Full transcript data with timestamps
│   ├── *.txt                  # Human-readable transcript
│   ├── *.srt                  # SubRip subtitle format
│   └── *.vtt                  # WebVTT subtitle format
│
└── venv311/                    # Python virtual environment
    ├── Scripts/
    ├── Lib/
    └── ...
```

---

## Backend API Endpoints (app.py)

### Video Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload-video` | POST | Upload video and trigger transcription |
| `/get-videos` | GET | Get list of all videos |
| `/get-transcript/<video_id>` | GET | Get transcript for a specific video |
| `/uploads/<filename>` | GET | Serve video file |
| `/transcripts/<filename>` | GET | Serve transcript file |

### AI-Powered Features
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/generate-summary` | POST | Generate HTML summary from transcript |
| `/generate-concepts` | POST | Extract key concepts from transcript |
| `/generate-practice` | POST | Create practice questions |
| `/generate-flashcards` | POST | Create flashcards for revision |
| `/generate-revision-test` | POST | Generate a quick revision test |
| `/chat-with-transcript` | POST | AI chatbot to discuss transcript |
| `/evaluate-answer` | POST | Evaluate student answers |

### Utility
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check endpoint |

---

## Frontend Features

### Core Functionality
- **Video Upload**: Drag and drop video upload with metadata
- **Video Player**: Built-in video player with transcript overlay
- **Auto-Transcript**: Automatic speech-to-text transcription

### AI Learning Aids
- **Summaries**: AI-generated comprehensive summaries with diagrams
- **Key Concepts**: Extracted important concepts with timestamps
- **Practice Questions**: Auto-generated MCQs and fill-in-blanks
- **Flashcards**: Quick revision flashcards
- **Revision Tests**: Quick self-assessment tests
- **AI Tutor**: Chat with the transcript for doubts

### UI Components
- Dashboard with video library
- Video detail page with all learning features
- Interactive quiz interface
- Flashcard viewer
- Chat interface for AI tutor

---

## Data Models

### Transcript JSON Structure
```
json
{
  "video_id": "string",
  "transcription_date": "ISO date",
  "language": "string",
  "duration": "seconds",
  "metadata": {
    "title": "string",
    "description": "string",
    "subject": "string",
    "category": "string"
  },
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 5.0,
      "start_time": "00:00:00",
      "end_time": "00:00:05",
      "text": "segment text",
      "words": [
        {
          "word": "text",
          "start": 0.0,
          "end": 0.5,
          "start_time": "00:00:00",
          "end_time": "00:00:00"
        }
      ]
    }
  ],
  "full_text": "complete transcript text"
}
```

---

## Running the Project

### Backend
```
bash
# Activate virtual environment
cd paathshala
venv311\Scripts\activate  # Windows

# Install dependencies (if not already)
pip install -r requirements.txt

# Run Flask server
python app.py
# Server runs on http://localhost:3000
```

### Frontend
```
bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

---

## Key Dependencies

### Python (Backend)
- `flask==3.0.0` - Web framework
- `flask-cors==4.0.0` - CORS support
- `openai-whisper==20231117` - Speech recognition
- `torch==2.1.0` - PyTorch (for Whisper)
- `torchaudio==2.1.0` - Audio processing
- `ffmpeg-python==0.2.0` - Video processing
- `werkzeug==3.0.1` - WSGI utilities

### JavaScript (Frontend)
- `react==19.2.0` - UI framework
- `react-dom==19.2.0` - React DOM
- `react-scripts==5.0.1` - React scripts
- `tailwindcss==3.4.18` - CSS framework
- `lucide-react==0.545.0` - Icons

---

## Notes
- Videos are stored in `/uploads` directory
- Transcripts are automatically generated in multiple formats (JSON, TXT, SRT, VTT)
- AI features use Google Gemini API (API keys embedded in app.py)
- The platform is designed for educational content with focus on video-based learning
