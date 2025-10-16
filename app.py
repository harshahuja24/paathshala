"""
Video Upload and Automatic Transcription Server
Uses Whisper AI for accurate speech-to-text with timestamps
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import json
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import subprocess
from flask import send_from_directory


app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
TRANSCRIPTS_FOLDER = 'transcripts'
ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TRANSCRIPTS_FOLDER, exist_ok=True)

# Load Whisper model (using base model for balance of speed and accuracy)
# Options: tiny, base, small, medium, large
print("Loading Whisper model...")
model = whisper.load_model("base")
print("Model loaded successfully!")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def format_timestamp(seconds):
    """Convert seconds to HH:MM:SS format"""
    return str(timedelta(seconds=int(seconds)))

def transcribe_video(video_path, video_id):
    """
    Transcribe video using Whisper AI with word-level timestamps
    """
    print(f"Starting transcription for: {video_path}")
    
    # Transcribe with word timestamps
    result = model.transcribe(
        video_path,
        word_timestamps=True,
        language='en',  # Auto-detect if None
        verbose=True
    )
    
    # Process segments with timestamps
    transcript_data = {
        'video_id': video_id,
        'transcription_date': datetime.now().isoformat(),
        'language': result['language'],
        'duration': result.get('duration', 0),
        'segments': []
    }
    
    # Extract segments with precise timestamps
    for segment in result['segments']:
        segment_data = {
            'id': segment['id'],
            'start': segment['start'],
            'end': segment['end'],
            'start_time': format_timestamp(segment['start']),
            'end_time': format_timestamp(segment['end']),
            'text': segment['text'].strip(),
            'words': []
        }
        
        # Add word-level timestamps if available
        if 'words' in segment:
            for word in segment['words']:
                segment_data['words'].append({
                    'word': word['word'],
                    'start': word['start'],
                    'end': word['end'],
                    'start_time': format_timestamp(word['start']),
                    'end_time': format_timestamp(word['end'])
                })
        
        transcript_data['segments'].append(segment_data)
    
    # Generate full text transcript
    transcript_data['full_text'] = ' '.join([seg['text'] for seg in transcript_data['segments']])
    
    return transcript_data

def save_transcript(transcript_data, video_id):
    """Save transcript in multiple formats"""
    base_path = os.path.join(TRANSCRIPTS_FOLDER, video_id)
    
    # Save as JSON (with all timestamp data)
    json_path = f"{base_path}.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(transcript_data, f, indent=2, ensure_ascii=False)
    
    # Save as TXT (simple readable format)
    txt_path = f"{base_path}.txt"
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(f"Transcription for Video ID: {video_id}\n")
        f.write(f"Date: {transcript_data['transcription_date']}\n")
        f.write(f"Language: {transcript_data['language']}\n")
        f.write(f"Duration: {format_timestamp(transcript_data['duration'])}\n")
        f.write("=" * 80 + "\n\n")
        
        for segment in transcript_data['segments']:
            f.write(f"[{segment['start_time']} -> {segment['end_time']}]\n")
            f.write(f"{segment['text']}\n\n")
    
    # Save as SRT (subtitle format)
    srt_path = f"{base_path}.srt"
    with open(srt_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(transcript_data['segments'], 1):
            start_srt = format_srt_timestamp(segment['start'])
            end_srt = format_srt_timestamp(segment['end'])
            f.write(f"{i}\n")
            f.write(f"{start_srt} --> {end_srt}\n")
            f.write(f"{segment['text']}\n\n")
    
    # Save as VTT (WebVTT format for HTML5 video)
    vtt_path = f"{base_path}.vtt"
    with open(vtt_path, 'w', encoding='utf-8') as f:
        f.write("WEBVTT\n\n")
        for segment in transcript_data['segments']:
            start_vtt = format_vtt_timestamp(segment['start'])
            end_vtt = format_vtt_timestamp(segment['end'])
            f.write(f"{start_vtt} --> {end_vtt}\n")
            f.write(f"{segment['text']}\n\n")
    
    return {
        'json': json_path,
        'txt': txt_path,
        'srt': srt_path,
        'vtt': vtt_path
    }

def format_srt_timestamp(seconds):
    """Format timestamp for SRT subtitle format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def format_vtt_timestamp(seconds):
    """Format timestamp for WebVTT format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"
@app.route('/get-videos', methods=['GET'])
def get_videos():
    try:
        videos = []
        uploads_dir = 'uploads'
        transcripts_dir = 'transcripts'
        
        if os.path.exists(uploads_dir):
            for filename in os.listdir(uploads_dir):
                if filename.endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
                    video_id = os.path.splitext(filename)[0]
                    video_path = os.path.join(uploads_dir, filename)
                    
                    # Check if transcript exists
                    transcript_exists = os.path.exists(os.path.join(transcripts_dir, f'{video_id}.json'))
                    
                    videos.append({
                        'id': video_id,
                        'videoId': video_id,
                        'title': video_id.replace('_', ' ').title(),
                        'date': datetime.fromtimestamp(os.path.getctime(video_path)).strftime('%d %b, %Y, %I:%M %p (IST)'),
                        'instructor': 'Teacher',
                        'subject': 'General',
                        'hasTranscript': transcript_exists
                    })
        
        return jsonify({
            'success': True,
            'videos': videos
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/upload-video', methods=['POST'])
def upload_video():
    """Handle video upload and initiate transcription"""
    try:
        # Check if video file is present
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        
        if video_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(video_file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: MP4, MOV, AVI, MKV, WEBM'}), 400
        
        # Get metadata
        title = request.form.get('title', 'Untitled')
        description = request.form.get('description', '')
        category = request.form.get('category', 'General')
        subject = request.form.get('subject', 'General')
        scheduled_date = request.form.get('scheduledDate', '')
        
        # Generate unique video ID
        video_id = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{secure_filename(video_file.filename).rsplit('.', 1)[0]}"
        
        # Save video file
        filename = secure_filename(video_file.filename)
        video_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.{filename.rsplit('.', 1)[1]}")
        video_file.save(video_path)
        
        print(f"Video saved: {video_path}")
        print(f"Starting transcription process...")
        
        # Transcribe video
        transcript_data = transcribe_video(video_path, video_id)
        
        # Add metadata to transcript
        transcript_data['metadata'] = {
            'title': title,
            'description': description,
            'category': category,
            'subject': subject,
            'scheduled_date': scheduled_date,
            'original_filename': filename
        }
        
        # Save transcript in multiple formats
        transcript_paths = save_transcript(transcript_data, video_id)
        
        print(f"Transcription completed successfully!")
        print(f"Files saved: {transcript_paths}")
        
        return jsonify({
            'success': True,
            'message': 'Video uploaded and transcribed successfully',
            'transcriptionId': video_id,
            'videoPath': video_path,
            'transcriptPaths': transcript_paths,
            'metadata': transcript_data['metadata'],
            'segments_count': len(transcript_data['segments']),
            'duration': format_timestamp(transcript_data['duration']),
            'language': transcript_data['language']
        }), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/get-transcript/<video_id>', methods=['GET'])
def get_transcript(video_id):
    """Retrieve transcript by video ID"""
    try:
        json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
        
        if not os.path.exists(json_path):
            return jsonify({'error': 'Transcript not found'}), 404
        
        with open(json_path, 'r', encoding='utf-8') as f:
            transcript_data = json.load(f)
        
        return jsonify(transcript_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Check if server is running"""
    return jsonify({
        'status': 'running',
        'model': 'whisper-base',
        'timestamp': datetime.now().isoformat()
    }), 200
@app.route('/uploads/<path:filename>')
def serve_video(filename):
    return send_from_directory('uploads', filename)
@app.route('/transcripts/<path:filename>')
def serve_transcript(filename):
    return send_from_directory('transcripts', filename)

if __name__ == '__main__':
    print("\n" + "="*60)
    print("Video Transcription Server")
    print("="*60)
    print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"Transcripts folder: {os.path.abspath(TRANSCRIPTS_FOLDER)}")
    print("Server starting on http://localhost:5000")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)