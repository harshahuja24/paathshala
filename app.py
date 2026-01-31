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
import google.generativeai as genai



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

                    # Default values
                    title = video_id.replace('_', ' ').title()
                    subject = 'General'
                    description = ''

                    # Load metadata from transcript if available
                    if transcript_exists:
                        try:
                            transcript_path = os.path.join(transcripts_dir, f'{video_id}.json')
                            with open(transcript_path, 'r', encoding='utf-8') as f:
                                data = json.load(f)
                                metadata = data.get('metadata', {})
                                title = metadata.get('title', title)
                                subject = metadata.get('subject', subject)
                                description = metadata.get('description', description)
                        except Exception as e:
                            print(f"Error loading metadata for {video_id}: {e}")
                            # Use defaults if error

                    videos.append({
                        'id': video_id,
                        'videoId': video_id,
                        'title': title,
                        'date': datetime.fromtimestamp(os.path.getctime(video_path)).strftime('%d %b, %Y, %I:%M %p (IST)'),
                        'instructor': 'Teacher',
                        'subject': subject,
                        'description': description,
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
    
@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json
        video_id = data.get('videoId')
        transcript_text = data.get('transcript')
        
        if not transcript_text:
            return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
        genai.configure(api_key='')
        model = genai.GenerativeModel('gemini-2.5-flash-preview-09-2025')
        
        prompt = f"""
You are an expert educational content summarizer. Analyze this lecture transcript and create a comprehensive, structured summary.

TRANSCRIPT:
{transcript_text}

Create a summary in HTML format with the following structure:

1. **Overview** (2-3 sentences): Main topic and purpose
2. **Key Concepts** (3-5 bullet points): Core ideas explained
3. **Important Topics**: Detailed breakdown with subheadings
4. **Visual Diagram**: Create an SVG diagram that illustrates the main concepts or relationships. Use professional colors and clear labels.
5. **Key Takeaways** (3-4 points): What students should remember
6. Inner html Like markdown with semantic tags there is no space between contents pls make that too

CRITICAL REQUIREMENTS:
- Return ONLY valid HTML that can be used with innerHTML
- Use semantic HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <strong>, <em>
- Include inline CSS styling for colors and spacing
- Create ONE SVG diagram (400-600px wide) that visualizes key concepts
- Use professional educational styling with blues, purples, and greens
- Make the SVG interactive-looking with gradients and shadows
- NO markdown, NO code blocks, NO explanations - ONLY the HTML content
- Start directly with the HTML, no preamble

Example SVG structure (adapt to the content):
<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="150" height="80" fill="#4F46E5" rx="10"/>
  <text x="125" y="95" text-anchor="middle" fill="white" font-size="14">Concept 1</text>
  <!-- Add arrows, more shapes, labels etc -->
</svg>
"""
        
        response = model.generate_content(prompt)
        summary_html = response.text
        
        # Clean up any markdown artifacts
        summary_html = summary_html.replace('```html', '').replace('```', '').strip()
        
        return jsonify({
            'success': True,
            'summary': {
                'html': summary_html,
                'videoId': video_id
            }
        })
        
    except Exception as e:
        print(f"Summary generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/generate-concepts', methods=['POST'])
def generate_concepts():
    try:
        data = request.json
        transcript_text = data.get('transcript')
        
        if not transcript_text:
            return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
Analyze this lecture transcript and extract the most important concepts.

TRANSCRIPT:
{transcript_text}

Return a JSON array of concepts. Each concept should have:
- title: Brief concept name
- description: 2-3 sentence explanation
- timestamp: Approximate timestamp where this concept appears (format: "0:MM:SS")
- importance: "high", "medium", or "low"

Return ONLY valid JSON, no markdown or explanations.

Example format:
[
  {{
    "title": "Newton's First Law",
    "description": "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
    "timestamp": "0:05:30",
    "importance": "high"
  }}
]
"""
        
        response = model.generate_content(prompt)
        concepts_text = response.text.strip()
        
        # Clean markdown artifacts
        concepts_text = concepts_text.replace('```json', '').replace('```', '').strip()
        
        try:
            concepts = json.loads(concepts_text)
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            concepts = []
        
        return jsonify({
            'success': True,
            'concepts': concepts
        })
        
    except Exception as e:
        print(f"Concepts generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/generate-practice', methods=['POST'])
def generate_practice():
    try:
        data = request.json
        transcript_text = data.get('transcript')
        
        if not transcript_text:
            return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
Based on this lecture transcript, create 5 practice questions to test understanding.

TRANSCRIPT:
{transcript_text}

Create a mix of:
- 2 Fill in the blanks
- 2 Multiple choice (4 options each)
- 1 Short answer

Return ONLY valid JSON with this structure:
[
  {{
    "id": 1,
    "type": "fill-blank",
    "question": "The process of _____ involves...",
    "answer": "photosynthesis",
    "hint": "It's how plants make food"
  }},
  {{
    "id": 2,
    "type": "mcq",
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correctAnswer": 1,
    "explanation": "Paris is the capital and largest city of France."
  }},
  {{
    "id": 3,
    "type": "short-answer",
    "question": "Explain the concept in 2-3 sentences.",
    "keywords": ["key", "terms", "expected"],
    "sampleAnswer": "A good answer would include..."
  }}
]

Return ONLY the JSON array, no markdown or explanations.
"""
        
        response = model.generate_content(prompt)
        questions_text = response.text.strip()
        
        # Clean markdown artifacts
        questions_text = questions_text.replace('```json', '').replace('```', '').strip()
        
        try:
            questions = json.loads(questions_text)
        except json.JSONDecodeError:
            questions = []
        
        return jsonify({
            'success': True,
            'questions': questions
        })
        
    except Exception as e:
        print(f"Practice generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    try:
        data = request.json
        transcript_text = data.get('transcript')
        video_id = data.get('videoId')
        
        if not transcript_text:
            return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        prompt = f"""
Create 10 flashcard-style Q&A pairs from this lecture transcript for quick revision.

TRANSCRIPT:
{transcript_text}

Create flashcards that:
1. Focus on key concepts and definitions
2. Include important facts and dates
3. Cover main ideas and theories
4. Are concise and easy to remember

Return ONLY valid JSON:
[
  {{
    "question": "What is photosynthesis?",
    "answer": "The process by which plants convert light energy into chemical energy",
    "explanation": "This occurs in chloroplasts using chlorophyll"
  }}
]

Return ONLY the JSON array, no markdown.
"""
        
        response = model.generate_content(prompt)
        flashcards_text = response.text.strip()
        flashcards_text = flashcards_text.replace('```json', '').replace('```', '').strip()
        
        try:
            flashcards = json.loads(flashcards_text)
        except json.JSONDecodeError:
            flashcards = []
        
        return jsonify({
            'success': True,
            'flashcards': flashcards
        })
        
    except Exception as e:
        print(f"Flashcard generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/generate-revision-test', methods=['POST'])
def generate_revision_test():
    try:
        data = request.json
        transcript_text = data.get('transcript')
        weak_areas = data.get('weakAreas', [])
        
        if not transcript_text:
            return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        weak_areas_text = ', '.join(weak_areas) if weak_areas else 'general topics'
        
        prompt = f"""
Create a 5-question quick revision test from this lecture transcript.
Focus especially on: {weak_areas_text}

TRANSCRIPT:
{transcript_text}

Create:
- 3 Multiple choice questions (4 options each)
- 2 Fill in the blank questions

Return ONLY valid JSON:
[
  {{
    "id": 1,
    "type": "mcq",
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correctAnswer": 1,
    "explanation": "Paris is the capital and largest city of France."
  }},
  {{
    "id": 2,
    "type": "fill-blank",
    "question": "The process of _____ converts light into chemical energy.",
    "answer": "photosynthesis",
    "explanation": "Plants use photosynthesis to make food from sunlight."
  }}
]

Return ONLY the JSON array, no markdown.
"""
        
        response = model.generate_content(prompt)
        questions_text = response.text.strip()
        questions_text = questions_text.replace('```json', '').replace('```', '').strip()
        
        try:
            questions = json.loads(questions_text)
        except json.JSONDecodeError:
            questions = []
        
        return jsonify({
            'success': True,
            'questions': questions
        })
        
    except Exception as e:
        print(f"Revision test generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/chat-with-transcript', methods=['POST'])
def chat_with_transcript():
    try:
        data = request.json
        transcript_text = data.get('transcript')
        user_message = data.get('message')
        chat_history = data.get('history', [])
        
        if not transcript_text or not user_message:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Build context with history
        context = "LECTURE TRANSCRIPT:\n" + transcript_text + "\n\n"
        context += "CHAT HISTORY:\n"
        for msg in chat_history[-5:]:  # Last 5 messages for context
            context += f"{msg['role']}: {msg['content']}\n"
        
        prompt = f"""
You are an AI tutor helping a student understand a lecture. Answer questions based ONLY on the provided transcript.

{context}

STUDENT QUESTION: {user_message}

INSTRUCTIONS:
1. Answer the question using ONLY information from the transcript
2. If the answer is in the transcript, provide the relevant timestamp(s) in format "MM:SS" or "H:MM:SS"
3. If the question cannot be answered from the transcript, politely say so
4. Be concise but thorough
5. Use a friendly, educational tone

Return your response as JSON:
{{
  "answer": "Your detailed answer here",
  "timestamps": ["0:05:30", "0:12:45"],
  "confidence": "high|medium|low"
}}

Return ONLY valid JSON, no markdown.
"""
        
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Clean markdown artifacts
        response_text = response_text.replace('```json', '').replace('```', '').strip()
        
        try:
            response_data = json.loads(response_text)
        except json.JSONDecodeError:
            response_data = {
                "answer": response_text,
                "timestamps": [],
                "confidence": "medium"
            }
        
        return jsonify({
            'success': True,
            'response': response_data
        })
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer():
    try:
        data = request.json
        question = data.get('question')
        user_answer = data.get('userAnswer')
        correct_answer = data.get('correctAnswer')
        question_type = data.get('type')
        
        genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        if question_type in ['fill-blank', 'mcq']:
            # Direct comparison
            is_correct = str(user_answer).strip().lower() == str(correct_answer).strip().lower()
            return jsonify({
                'success': True,
                'isCorrect': is_correct,
                'feedback': 'Correct!' if is_correct else f'Incorrect. The correct answer is: {correct_answer}'
            })
        else:
            # AI evaluation for short answers
            prompt = f"""
Evaluate this student's answer:

QUESTION: {question}
STUDENT ANSWER: {user_answer}
EXPECTED KEYWORDS/CONCEPTS: {correct_answer}

Provide:
1. Is the answer acceptable? (yes/no)
2. Score out of 10
3. Brief feedback (2-3 sentences)

Return as JSON:
{{
  "isCorrect": true/false,
  "score": 8,
  "feedback": "Your feedback here"
}}

Return ONLY valid JSON.
"""
            
            response = model.generate_content(prompt)
            result = response.text.strip().replace('```json', '').replace('```', '').strip()
            
            try:
                evaluation = json.loads(result)
            except:
                evaluation = {
                    "isCorrect": False,
                    "score": 0,
                    "feedback": "Could not evaluate answer"
                }
            
            return jsonify({
                'success': True,
                **evaluation
            })
        
    except Exception as e:
        print(f"Evaluation error: {str(e)}")
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

        # Extract file extension
        file_ext = video_file.filename.rsplit('.', 1)[-1].lower()

        # Generate safe and unique filename using the title
        safe_title = secure_filename(title)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        video_id = f"{safe_title}"
        filename = f"{video_id}.{file_ext}"

        # Save video file
        video_path = os.path.join(UPLOAD_FOLDER, filename)
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
            'original_filename': video_file.filename,
            'saved_filename': filename
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