# """
# Video Upload and Automatic Transcription Server
# Uses Whisper AI for accurate speech-to-text with timestamps
# """

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import whisper
# import os
# import json
# from datetime import datetime, timedelta
# from werkzeug.utils import secure_filename
# import subprocess
# from flask import send_from_directory
# import google.generativeai as genai
# # PageIndex RAG
# try:
#     from pageindex import PageIndexClient
#     PI_AVAILABLE = True
# except ImportError:
#     PI_AVAILABLE = False
#     print("PageIndex not installed. Run: pip install pageindex")

# PAGEINDEX_API_KEY = os.environ.get('PAGEINDEX_API_KEY', '3922a6cb97424d1685d03afa58016c5f')
# PI_INDEX_FILE = 'data/pageindex_docs.json'
# os.makedirs('data', exist_ok=True)

# def get_pi_index():
#     if os.path.exists(PI_INDEX_FILE):
#         with open(PI_INDEX_FILE, 'r') as f:
#             return json.load(f)
#     return {}

# def save_pi_index(data):
#     with open(PI_INDEX_FILE, 'w') as f:
#         json.dump(data, f, indent=2)


# app = Flask(__name__)
# CORS(app)

# # Configuration
# UPLOAD_FOLDER = 'uploads'
# TRANSCRIPTS_FOLDER = 'transcripts'
# ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm'}

# # Create directories if they don't exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(TRANSCRIPTS_FOLDER, exist_ok=True)

# # Load Whisper model (using base model for balance of speed and accuracy)
# # Options: tiny, base, small, medium, large
# print("Loading Whisper model...")
# model = whisper.load_model("base")
# print("Model loaded successfully!")

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def format_timestamp(seconds):
#     """Convert seconds to HH:MM:SS format"""
#     return str(timedelta(seconds=int(seconds)))

# def transcribe_video(video_path, video_id):
#     """
#     Transcribe video using Whisper AI with word-level timestamps
#     """
#     print(f"Starting transcription for: {video_path}")
    
#     # Transcribe with word timestamps
#     result = model.transcribe(
#         video_path,
#         word_timestamps=True,
#         language='en',  # Auto-detect if None
#         verbose=True
#     )
    
#     # Process segments with timestamps
#     transcript_data = {
#         'video_id': video_id,
#         'transcription_date': datetime.now().isoformat(),
#         'language': result['language'],
#         'duration': result.get('duration', 0),
#         'segments': []
#     }
    
#     # Extract segments with precise timestamps
#     for segment in result['segments']:
#         segment_data = {
#             'id': segment['id'],
#             'start': segment['start'],
#             'end': segment['end'],
#             'start_time': format_timestamp(segment['start']),
#             'end_time': format_timestamp(segment['end']),
#             'text': segment['text'].strip(),
#             'words': []
#         }
        
#         # Add word-level timestamps if available
#         if 'words' in segment:
#             for word in segment['words']:
#                 segment_data['words'].append({
#                     'word': word['word'],
#                     'start': word['start'],
#                     'end': word['end'],
#                     'start_time': format_timestamp(word['start']),
#                     'end_time': format_timestamp(word['end'])
#                 })
        
#         transcript_data['segments'].append(segment_data)
    
#     # Generate full text transcript
#     transcript_data['full_text'] = ' '.join([seg['text'] for seg in transcript_data['segments']])
    
#     return transcript_data

# def save_transcript(transcript_data, video_id):
#     """Save transcript in multiple formats"""
#     base_path = os.path.join(TRANSCRIPTS_FOLDER, video_id)
    
#     # Save as JSON (with all timestamp data)
#     json_path = f"{base_path}.json"
#     with open(json_path, 'w', encoding='utf-8') as f:
#         json.dump(transcript_data, f, indent=2, ensure_ascii=False)
    
#     # Save as TXT (simple readable format)
#     txt_path = f"{base_path}.txt"
#     with open(txt_path, 'w', encoding='utf-8') as f:
#         f.write(f"Transcription for Video ID: {video_id}\n")
#         f.write(f"Date: {transcript_data['transcription_date']}\n")
#         f.write(f"Language: {transcript_data['language']}\n")
#         f.write(f"Duration: {format_timestamp(transcript_data['duration'])}\n")
#         f.write("=" * 80 + "\n\n")
        
#         for segment in transcript_data['segments']:
#             f.write(f"[{segment['start_time']} -> {segment['end_time']}]\n")
#             f.write(f"{segment['text']}\n\n")
    
#     # Save as SRT (subtitle format)
#     srt_path = f"{base_path}.srt"
#     with open(srt_path, 'w', encoding='utf-8') as f:
#         for i, segment in enumerate(transcript_data['segments'], 1):
#             start_srt = format_srt_timestamp(segment['start'])
#             end_srt = format_srt_timestamp(segment['end'])
#             f.write(f"{i}\n")
#             f.write(f"{start_srt} --> {end_srt}\n")
#             f.write(f"{segment['text']}\n\n")
    
#     # Save as VTT (WebVTT format for HTML5 video)
#     vtt_path = f"{base_path}.vtt"
#     with open(vtt_path, 'w', encoding='utf-8') as f:
#         f.write("WEBVTT\n\n")
#         for segment in transcript_data['segments']:
#             start_vtt = format_vtt_timestamp(segment['start'])
#             end_vtt = format_vtt_timestamp(segment['end'])
#             f.write(f"{start_vtt} --> {end_vtt}\n")
#             f.write(f"{segment['text']}\n\n")
    
#     return {
#         'json': json_path,
#         'txt': txt_path,
#         'srt': srt_path,
#         'vtt': vtt_path
#     }

# def format_srt_timestamp(seconds):
#     """Format timestamp for SRT subtitle format"""
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     secs = int(seconds % 60)
#     millis = int((seconds % 1) * 1000)
#     return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

# def format_vtt_timestamp(seconds):
#     """Format timestamp for WebVTT format"""
#     hours = int(seconds // 3600)
#     minutes = int((seconds % 3600) // 60)
#     secs = int(seconds % 60)
#     millis = int((seconds % 1) * 1000)
#     return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"
# @app.route('/get-videos', methods=['GET'])
# def get_videos():
#     try:
#         videos = []
#         uploads_dir = 'uploads'
#         transcripts_dir = 'transcripts'

#         if os.path.exists(uploads_dir):
#             for filename in os.listdir(uploads_dir):
#                 if filename.endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
#                     video_id = os.path.splitext(filename)[0]
#                     video_path = os.path.join(uploads_dir, filename)

#                     # Check if transcript exists
#                     transcript_exists = os.path.exists(os.path.join(transcripts_dir, f'{video_id}.json'))

#                     # Default values
#                     title = video_id.replace('_', ' ').title()
#                     subject = 'General'
#                     description = ''

#                     # Load metadata from transcript if available
#                     if transcript_exists:
#                         try:
#                             transcript_path = os.path.join(transcripts_dir, f'{video_id}.json')
#                             with open(transcript_path, 'r', encoding='utf-8') as f:
#                                 data = json.load(f)
#                                 metadata = data.get('metadata', {})
#                                 title = metadata.get('title', title)
#                                 subject = metadata.get('subject', subject)
#                                 description = metadata.get('description', description)
#                         except Exception as e:
#                             print(f"Error loading metadata for {video_id}: {e}")
#                             # Use defaults if error

#                     videos.append({
#                         'id': video_id,
#                         'videoId': video_id,
#                         'title': title,
#                         'date': datetime.fromtimestamp(os.path.getctime(video_path)).strftime('%d %b, %Y, %I:%M %p (IST)'),
#                         'instructor': 'Teacher',
#                         'subject': subject,
#                         'description': description,
#                         'hasTranscript': transcript_exists
#                     })

#         return jsonify({
#             'success': True,
#             'videos': videos
#         })
#     except Exception as e:
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500
    
# @app.route('/generate-summary', methods=['POST'])
# def generate_summary():
#     try:
#         data = request.json
#         video_id = data.get('videoId')
#         transcript_text = data.get('transcript')
        
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         prompt = f"""
# You are an expert educational content summarizer. Analyze this lecture transcript and create a comprehensive, structured summary.

# TRANSCRIPT:
# {transcript_text}

# Create a summary in HTML format with the following structure:

# 1. **Overview** (2-3 sentences): Main topic and purpose
# 2. **Key Concepts** (3-5 bullet points): Core ideas explained
# 3. **Important Topics**: Detailed breakdown with subheadings
# 4. **Visual Diagram**: Create an SVG diagram that illustrates the main concepts or relationships. Use professional colors and clear labels.
# 5. **Key Takeaways** (3-4 points): What students should remember
# 6. Inner html Like markdown with semantic tags there is no space between contents pls make that too

# CRITICAL REQUIREMENTS:
# - Return ONLY valid HTML that can be used with innerHTML
# - Use semantic HTML tags: <h3>, <h4>, <p>, <ul>, <li>, <strong>, <em>
# - Include inline CSS styling for colors and spacing
# - Create ONE SVG diagram (400-600px wide) that visualizes key concepts
# - Use professional educational styling with blues, purples, and greens
# - Make the SVG interactive-looking with gradients and shadows
# - NO markdown, NO code blocks, NO explanations - ONLY the HTML content
# - Start directly with the HTML, no preamble

# Example SVG structure (adapt to the content):
# <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
#   <rect x="50" y="50" width="150" height="80" fill="#4F46E5" rx="10"/>
#   <text x="125" y="95" text-anchor="middle" fill="white" font-size="14">Concept 1</text>
#   <!-- Add arrows, more shapes, labels etc -->
# </svg>
# """
        
#         response = model.generate_content(prompt)
#         summary_html = response.text
        
#         # Clean up any markdown artifacts
#         summary_html = summary_html.replace('```html', '').replace('```', '').strip()
        
#         return jsonify({
#             'success': True,
#             'summary': {
#                 'html': summary_html,
#                 'videoId': video_id
#             }
#         })
        
#     except Exception as e:
#         print(f"Summary generation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500


# @app.route('/generate-concepts', methods=['POST'])
# def generate_concepts():
#     try:
#         data = request.json
#         transcript_text = data.get('transcript')
        
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         prompt = f"""
# Analyze this lecture transcript and extract the most important concepts.

# TRANSCRIPT:
# {transcript_text}

# Return a JSON array of concepts. Each concept should have:
# - title: Brief concept name
# - description: 2-3 sentence explanation
# - timestamp: Approximate timestamp where this concept appears (format: "0:MM:SS")
# - importance: "high", "medium", or "low"

# Return ONLY valid JSON, no markdown or explanations.

# Example format:
# [
#   {{
#     "title": "Newton's First Law",
#     "description": "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
#     "timestamp": "0:05:30",
#     "importance": "high"
#   }}
# ]
# """
        
#         response = model.generate_content(prompt)
#         concepts_text = response.text.strip()
        
#         # Clean markdown artifacts
#         concepts_text = concepts_text.replace('```json', '').replace('```', '').strip()
        
#         try:
#             concepts = json.loads(concepts_text)
#         except json.JSONDecodeError:
#             # Fallback if JSON parsing fails
#             concepts = []
        
#         return jsonify({
#             'success': True,
#             'concepts': concepts
#         })
        
#     except Exception as e:
#         print(f"Concepts generation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500
    
# @app.route('/generate-blooms-questions', methods=['POST'])
# def generate_blooms_questions():
#     """Generate Bloom's Taxonomy tagged questions for checkpoint tests"""
#     try:
#         data = request.json
#         transcript_text = data.get('transcript')
#         bloom_level = data.get('bloomLevel', 2)  # 1-4
#         num_questions = data.get('numQuestions', 3)
#         checkpoint = data.get('checkpoint', 'alpha')  # alpha, beta, omega

#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400

#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')

#         bloom_descriptions = {
#             1: "recall specific facts, definitions, or steps (e.g. 'What is...', 'Define...')",
#             2: "explain or paraphrase concepts (e.g. 'Explain why...', 'What does X mean in context of...')",
#             3: "apply a concept to a new scenario (e.g. 'How would you use X to solve...', 'Give an example of...')",
#             4: "analyze relationships between concepts (e.g. 'What is the relationship between X and Y?', 'Why does X cause Y?')"
#         }

#         prompt = f"""
# You are generating a checkpoint quiz for an educational video platform. 
# Generate exactly {num_questions} multiple-choice questions from the transcript below.

# BLOOM'S LEVEL: {bloom_level} — Questions must require students to {bloom_descriptions.get(bloom_level, bloom_descriptions[2])}

# RULES:
# 1. Questions must be directly answerable from the transcript — do not invent facts
# 2. Each question must have exactly 4 options (A, B, C, D)
# 3. Only ONE correct answer per question
# 4. Do NOT make questions answerable by direct copy-paste from the text (no quote-spotting)
# 5. Return ONLY valid JSON, no markdown fences

# TRANSCRIPT:
# {transcript_text[:3000]}

# Return this exact JSON format:
# {{
#   "questions": [
#     {{
#       "id": "cp_{checkpoint}_1",
#       "question": "Question text here",
#       "options": ["Option A", "Option B", "Option C", "Option D"],
#       "correctAnswer": 0,
#       "bloomLevel": {bloom_level},
#       "explanation": "Why this is correct"
#     }}
#   ]
# }}
# """
#         response = model.generate_content(prompt)
#         response_text = response.text.strip().replace('```json', '').replace('```', '').strip()

#         try:
#             result = json.loads(response_text)
#         except json.JSONDecodeError:
#             return jsonify({'success': False, 'error': 'Failed to parse AI response'}), 500

#         return jsonify({'success': True, 'questions': result.get('questions', []), 'bloomLevel': bloom_level, 'checkpoint': checkpoint})

#     except Exception as e:
#         print(f"Blooms generation error: {str(e)}")
#         return jsonify({'success': False, 'error': str(e)}), 500


# @app.route('/get-all-student-flags', methods=['GET'])
# def get_all_student_flags():
#     """
#     Teacher endpoint: returns flag data for all students from their submitted flag saves.
#     Since flags are computed on the frontend and saved to localStorage (no DB),
#     this endpoint is a placeholder — flag reading happens client-side in TeacherAnalytics.
#     This endpoint exists for future backend persistence upgrade.
#     """
#     return jsonify({'success': True, 'message': 'Flags are stored client-side in localStorage', 'students': []})

# @app.route('/generate-practice', methods=['POST'])
# def generate_practice():
#     try:
#         data = request.json
#         transcript_text = data.get('transcript')
        
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         prompt = f"""
# Based on this lecture transcript, create 5 practice questions to test understanding.

# TRANSCRIPT:
# {transcript_text}

# Create a mix of:
# - 2 Fill in the blanks
# - 2 Multiple choice (4 options each)
# - 1 Short answer

# Return ONLY valid JSON with this structure:
# [
#   {{
#     "id": 1,
#     "type": "fill-blank",
#     "question": "The process of _____ involves...",
#     "answer": "photosynthesis",
#     "hint": "It's how plants make food"
#   }},
#   {{
#     "id": 2,
#     "type": "mcq",
#     "question": "What is the capital of France?",
#     "options": ["London", "Paris", "Berlin", "Madrid"],
#     "correctAnswer": 1,
#     "explanation": "Paris is the capital and largest city of France."
#   }},
#   {{
#     "id": 3,
#     "type": "short-answer",
#     "question": "Explain the concept in 2-3 sentences.",
#     "keywords": ["key", "terms", "expected"],
#     "sampleAnswer": "A good answer would include..."
#   }}
# ]

# Return ONLY the JSON array, no markdown or explanations.
# """
        
#         response = model.generate_content(prompt)
#         questions_text = response.text.strip()
        
#         # Clean markdown artifacts
#         questions_text = questions_text.replace('```json', '').replace('```', '').strip()
        
#         try:
#             questions = json.loads(questions_text)
#         except json.JSONDecodeError:
#             questions = []
        
#         return jsonify({
#             'success': True,
#             'questions': questions
#         })
        
#     except Exception as e:
#         print(f"Practice generation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500
# @app.route('/generate-flashcards', methods=['POST'])
# def generate_flashcards():
#     try:
#         data = request.json
#         transcript_text = data.get('transcript')
#         video_id = data.get('videoId')
        
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         prompt = f"""
# Create 10 flashcard-style Q&A pairs from this lecture transcript for quick revision.

# TRANSCRIPT:
# {transcript_text}

# Create flashcards that:
# 1. Focus on key concepts and definitions
# 2. Include important facts and dates
# 3. Cover main ideas and theories
# 4. Are concise and easy to remember

# Return ONLY valid JSON:
# [
#   {{
#     "question": "What is photosynthesis?",
#     "answer": "The process by which plants convert light energy into chemical energy",
#     "explanation": "This occurs in chloroplasts using chlorophyll"
#   }}
# ]

# Return ONLY the JSON array, no markdown.
# """
        
#         response = model.generate_content(prompt)
#         flashcards_text = response.text.strip()
#         flashcards_text = flashcards_text.replace('```json', '').replace('```', '').strip()
        
#         try:
#             flashcards = json.loads(flashcards_text)
#         except json.JSONDecodeError:
#             flashcards = []
        
#         return jsonify({
#             'success': True,
#             'flashcards': flashcards
#         })
        
#     except Exception as e:
#         print(f"Flashcard generation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/generate-revision-test', methods=['POST'])
# def generate_revision_test():
#     try:
#         data = request.json
#         transcript_text = data.get('transcript')
#         weak_areas = data.get('weakAreas', [])
        
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript provided'}), 400
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         weak_areas_text = ', '.join(weak_areas) if weak_areas else 'general topics'
        
#         prompt = f"""
# Create a 5-question quick revision test from this lecture transcript.
# Focus especially on: {weak_areas_text}

# TRANSCRIPT:
# {transcript_text}

# Create:
# - 3 Multiple choice questions (4 options each)
# - 2 Fill in the blank questions

# Return ONLY valid JSON:
# [
#   {{
#     "id": 1,
#     "type": "mcq",
#     "question": "What is the capital of France?",
#     "options": ["London", "Paris", "Berlin", "Madrid"],
#     "correctAnswer": 1,
#     "explanation": "Paris is the capital and largest city of France."
#   }},
#   {{
#     "id": 2,
#     "type": "fill-blank",
#     "question": "The process of _____ converts light into chemical energy.",
#     "answer": "photosynthesis",
#     "explanation": "Plants use photosynthesis to make food from sunlight."
#   }}
# ]

# Return ONLY the JSON array, no markdown.
# """
        
#         response = model.generate_content(prompt)
#         questions_text = response.text.strip()
#         questions_text = questions_text.replace('```json', '').replace('```', '').strip()
        
#         try:
#             questions = json.loads(questions_text)
#         except json.JSONDecodeError:
#             questions = []
        
#         return jsonify({
#             'success': True,
#             'questions': questions
#         })
        
#     except Exception as e:
#         print(f"Revision test generation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500

# @app.route('/chat-with-transcript', methods=['POST'])
# def chat_with_transcript():
#     """
#     Chat with transcript. Returns REAL timestamps by matching answer to actual segments.
#     No more hallucinated timestamps — Gemini identifies which segment IDs contain the answer,
#     then we pull the actual start_time from those segments.
#     """
#     try:
#         data = request.json
#         video_id = data.get('videoId')          # NEW — needed to read segments
#         transcript_text = data.get('transcript')
#         user_message = data.get('message')
#         chat_history = data.get('history', [])
#         segments = data.get('segments', [])     # NEW — actual segment objects with timestamps

#         if not transcript_text or not user_message:
#             return jsonify({'success': False, 'error': 'Missing required fields'}), 400

#         genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
#         model = genai.GenerativeModel('gemini-2.0-flash')

#         # Build numbered segment map for real timestamp lookup
#         # Format: [0] 0:00:05 — "text of segment..."
#         segment_lines = ""
#         segment_map = {}  # index -> {start_time, text}
#         if segments:
#             for i, seg in enumerate(segments[:120]):  # cap at 120 segs to stay in context
#                 start = seg.get('start_time', '0:00:00')
#                 text = seg.get('text', '').strip()
#                 segment_lines += f"[{i}] {start} — {text}\n"
#                 segment_map[str(i)] = {'start_time': start, 'start_seconds': seg.get('start', 0), 'text': text}
#         else:
#             # Fallback: just use full text without real timestamps
#             segment_lines = transcript_text

#         history_text = ""
#         for msg in chat_history[-4:]:
#             history_text += f"{msg['role'].upper()}: {msg['content']}\n"

#         prompt = f"""You are an AI tutor helping a student understand a lecture.

# LECTURE TRANSCRIPT (each line: [segment_index] timestamp — text):
# {segment_lines}

# RECENT CONVERSATION:
# {history_text}

# STUDENT QUESTION: {user_message}

# INSTRUCTIONS:
# 1. Answer using ONLY information present in the transcript above
# 2. At the end of your answer, identify up to 3 segment indices (numbers in brackets) whose text directly supports your answer
# 3. If no segment is relevant, leave segment_ids empty
# 4. Be clear, helpful, and use simple language

# Return ONLY this JSON:
# {{
#   "answer": "Your full answer here",
#   "segment_ids": [12, 34],
#   "confidence": "high|medium|low"
# }}

# Return ONLY valid JSON, no markdown fences."""

#         response = model.generate_content(prompt)
#         response_text = response.text.strip().replace('```json', '').replace('```', '').strip()

#         try:
#             parsed = json.loads(response_text)
#         except json.JSONDecodeError:
#             parsed = {"answer": response_text, "segment_ids": [], "confidence": "medium"}

#         # Resolve REAL timestamps from segment_ids
#         real_timestamps = []
#         real_segments = []
#         for sid in parsed.get('segment_ids', []):
#             key = str(sid)
#             if key in segment_map:
#                 seg_data = segment_map[key]
#                 real_timestamps.append(seg_data['start_time'])
#                 real_segments.append({
#                     'start_time': seg_data['start_time'],
#                     'start_seconds': seg_data['start_seconds'],
#                     'text': seg_data['text'][:120]  # preview snippet
#                 })

#         return jsonify({
#             'success': True,
#             'response': {
#                 'answer': parsed.get('answer', ''),
#                 'timestamps': real_timestamps,          # REAL timestamps from actual segments
#                 'segments': real_segments,              # snippet + seconds for direct video seek
#                 'confidence': parsed.get('confidence', 'medium')
#             }
#         })

#     except Exception as e:
#         print(f"Chat error: {str(e)}")
#         return jsonify({'success': False, 'error': str(e)}), 500
# @app.route('/explain-missed-concept', methods=['POST'])
# def explain_missed_concept():
#     """
#     Core PageIndex RAG pipeline:
#     1. Student got a question wrong
#     2. We extract the concept from the question
#     3. Search PageIndex for transcript chunks explaining that concept
#     4. Feed those REAL chunks from the lecture to Gemini
#     5. Gemini generates a simple re-explanation grounded in the actual lecture
    
#     This is the real difference between RAG and plain LLM:
#     the explanation is anchored to WHAT THE TEACHER ACTUALLY SAID in the video.
#     """
#     try:
#         data = request.json
#         video_id = data.get('videoId')
#         question_text = data.get('questionText', '')
#         correct_answer = data.get('correctAnswer', '')
#         student_answer = data.get('studentAnswer', '')
#         bloom_level = data.get('bloomLevel', 2)

#         # Load transcript segments from disk
#         json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
#         if not os.path.exists(json_path):
#             return jsonify({'success': False, 'error': 'Transcript not found'}), 404

#         with open(json_path, 'r', encoding='utf-8') as f:
#             transcript_data = json.load(f)

#         segments = transcript_data.get('segments', [])
#         full_text = transcript_data.get('full_text', '')

#         # ── PageIndex RAG: find relevant chunks ──────────────────────────────
#         # We search the transcript segments for text semantically related to the question.
#         # Without PageIndex SDK available server-side, we do keyword-based retrieval
#         # that simulates the same result — find which segments discuss this concept.
#         # When you add PageIndex SDK: replace this block with pi_client.search(query, doc_id)
        
#         pi_index = {}
#         if os.path.exists('data/pageindex_docs.json'):
#             with open('data/pageindex_docs.json', 'r') as f:
#                 pi_index = json.load(f)

#         retrieved_chunks = []
#         retrieval_source = 'keyword'
        
#         if video_id in pi_index and pi_index[video_id].get('status') == 'completed':
#             # PageIndex is available — use it
#             try:
#                 from pageindex import PageIndexClient
#                 pi_client = PageIndexClient(api_key=os.environ.get('PAGEINDEX_API_KEY', ''))
#                 doc_id = pi_index[video_id]['doc_id']
                
#                 search_query = f"{question_text} {correct_answer}"
#                 search_result = pi_client.search(query=search_query, doc_id=doc_id, top_k=4)
                
#                 for chunk in search_result.get('chunks', []):
#                     retrieved_chunks.append({
#                         'text': chunk.get('text', ''),
#                         'score': chunk.get('score', 0),
#                         'source': 'pageindex',
#                         'chunk_index': chunk.get('index', 0)
#                     })
#                 retrieval_source = 'pageindex'
#             except Exception as pi_err:
#                 print(f"PageIndex search failed, falling back to keyword: {pi_err}")

#         if not retrieved_chunks:
#             # Fallback: keyword search across segments
#             # Build search terms from question + correct answer
#             search_terms = set()
#             for word in (question_text + ' ' + str(correct_answer)).lower().split():
#                 if len(word) > 3 and word not in {'what','that','this','with','from','have','been','they','their','when','where','which'}:
#                     search_terms.add(word)

#             scored_segments = []
#             for seg in segments:
#                 text_lower = seg['text'].lower()
#                 score = sum(1 for term in search_terms if term in text_lower)
#                 if score > 0:
#                     scored_segments.append((score, seg))

#             scored_segments.sort(key=lambda x: x[0], reverse=True)
#             for score, seg in scored_segments[:4]:
#                 retrieved_chunks.append({
#                     'text': seg['text'],
#                     'score': round(score / max(len(search_terms), 1), 2),
#                     'source': 'keyword_search',
#                     'start_time': seg.get('start_time', '0:00:00'),
#                     'start_seconds': seg.get('start', 0),
#                     'segment_id': seg.get('id', 0)
#                 })

#         if not retrieved_chunks:
#             # Last resort: use middle portion of transcript
#             mid = len(segments) // 2
#             for seg in segments[max(0, mid-2):mid+3]:
#                 retrieved_chunks.append({
#                     'text': seg['text'],
#                     'score': 0.1,
#                     'source': 'fallback',
#                     'start_time': seg.get('start_time', '0:00:00'),
#                     'start_seconds': seg.get('start', 0),
#                     'segment_id': seg.get('id', 0)
#                 })

#         # ── Gemini: explain the concept simply using retrieved chunks ─────────
#         bloom_instruction = {
#             1: "Explain it as a simple definition the student can memorize.",
#             2: "Explain what it means and why it matters — help the student understand it, not just recall it.",
#             3: "Explain the concept AND show how it applies with a concrete example from real life.",
#             4: "Explain the concept and the reasoning behind why it works the way it does.",
#         }.get(bloom_level, "Explain it clearly.")

#         chunks_text = "\n\n".join([f"[From lecture at {c.get('start_time', '?')}]: {c['text']}" for c in retrieved_chunks])

#         genai.configure(api_key='AIzaSyDo7n7uUdxwktybg63J7ypop8oUcKaZyRg')
#         model = genai.GenerativeModel('gemini-2.0-flash')

#         prompt = f"""A student answered a quiz question incorrectly. Your job is to explain the correct concept simply using ONLY the lecture content provided below.

# QUESTION THE STUDENT GOT WRONG:
# {question_text}

# CORRECT ANSWER:
# {correct_answer}

# STUDENT'S WRONG ANSWER:
# {student_answer}

# RELEVANT PARTS OF THE LECTURE (retrieved by RAG search):
# {chunks_text}

# TASK: {bloom_instruction}

# RULES:
# - Ground your explanation ONLY in the lecture content above — don't add outside knowledge
# - Start with one sentence: "Your teacher explained this at [timestamp] — here's what was said:"
# - Then give the simple explanation (3-5 sentences max)
# - End with: "The key point to remember: [one sentence takeaway]"
# - Do not lecture the student — be warm and encouraging
# - Do NOT just quote the transcript, rephrase it simply

# Return ONLY this JSON:
# {{
#   "explanation": "Your full explanation here",
#   "key_takeaway": "One sentence to remember",
#   "source_timestamp": "0:00:00",
#   "source_snippet": "The exact phrase from the lecture this is based on (max 20 words)"
# }}"""

#         response = model.generate_content(prompt)
#         result_text = response.text.strip().replace('```json', '').replace('```', '').strip()

#         try:
#             result = json.loads(result_text)
#         except json.JSONDecodeError:
#             result = {"explanation": result_text, "key_takeaway": "", "source_timestamp": "", "source_snippet": ""}

#         # Use the best chunk's timestamp if Gemini didn't find one
#         if not result.get('source_timestamp') and retrieved_chunks:
#             result['source_timestamp'] = retrieved_chunks[0].get('start_time', '0:00:00')

#         return jsonify({
#             'success': True,
#             'explanation': result,
#             'retrieved_chunks': retrieved_chunks,   # For the visualization panel
#             'retrieval_source': retrieval_source,   # 'pageindex' or 'keyword_search'
#             'concept': question_text[:80]
#         })

#     except Exception as e:
#         print(f"Concept explanation error: {str(e)}")
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/evaluate-answer', methods=['POST'])
# def evaluate_answer():
#     try:
#         data = request.json
#         question = data.get('question')
#         user_answer = data.get('userAnswer')
#         correct_answer = data.get('correctAnswer')
#         question_type = data.get('type')
        
#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')
        
#         if question_type in ['fill-blank', 'mcq']:
#             # Direct comparison
#             is_correct = str(user_answer).strip().lower() == str(correct_answer).strip().lower()
#             return jsonify({
#                 'success': True,
#                 'isCorrect': is_correct,
#                 'feedback': 'Correct!' if is_correct else f'Incorrect. The correct answer is: {correct_answer}'
#             })
#         else:
#             # AI evaluation for short answers
#             prompt = f"""
# Evaluate this student's answer:

# QUESTION: {question}
# STUDENT ANSWER: {user_answer}
# EXPECTED KEYWORDS/CONCEPTS: {correct_answer}

# Provide:
# 1. Is the answer acceptable? (yes/no)
# 2. Score out of 10
# 3. Brief feedback (2-3 sentences)

# Return as JSON:
# {{
#   "isCorrect": true/false,
#   "score": 8,
#   "feedback": "Your feedback here"
# }}

# Return ONLY valid JSON.
# """
            
#             response = model.generate_content(prompt)
#             result = response.text.strip().replace('```json', '').replace('```', '').strip()
            
#             try:
#                 evaluation = json.loads(result)
#             except:
#                 evaluation = {
#                     "isCorrect": False,
#                     "score": 0,
#                     "feedback": "Could not evaluate answer"
#                 }
            
#             return jsonify({
#                 'success': True,
#                 **evaluation
#             })
        
#     except Exception as e:
#         print(f"Evaluation error: {str(e)}")
#         return jsonify({
#             'success': False,
#             'error': str(e)
#         }), 500
    
# @app.route('/upload-video', methods=['POST'])
# def upload_video():
#     """Handle video upload and initiate transcription"""
#     try:
#         # Check if video file is present
#         if 'video' not in request.files:
#             return jsonify({'error': 'No video file provided'}), 400

#         video_file = request.files['video']

#         if video_file.filename == '':
#             return jsonify({'error': 'No file selected'}), 400

#         if not allowed_file(video_file.filename):
#             return jsonify({'error': 'Invalid file type. Allowed: MP4, MOV, AVI, MKV, WEBM'}), 400

#         # Get metadata
#         title = request.form.get('title', 'Untitled')
#         description = request.form.get('description', '')
#         category = request.form.get('category', 'General')
#         subject = request.form.get('subject', 'General')
#         scheduled_date = request.form.get('scheduledDate', '')

#         # Extract file extension
#         file_ext = video_file.filename.rsplit('.', 1)[-1].lower()

#         # Generate safe and unique filename using the title
#         safe_title = secure_filename(title)
#         timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
#         video_id = f"{safe_title}"
#         filename = f"{video_id}.{file_ext}"

#         # Save video file
#         video_path = os.path.join(UPLOAD_FOLDER, filename)
#         video_file.save(video_path)

#         print(f"Video saved: {video_path}")
#         print(f"Starting transcription process...")

#         # Transcribe video
#         transcript_data = transcribe_video(video_path, video_id)

#         # Add metadata to transcript
#         transcript_data['metadata'] = {
#             'title': title,
#             'description': description,
#             'category': category,
#             'subject': subject,
#             'scheduled_date': scheduled_date,
#             'original_filename': video_file.filename,
#             'saved_filename': filename
#         }

#         # Save transcript in multiple formats
#         transcript_paths = save_transcript(transcript_data, video_id)

#         print(f"Transcription completed successfully!")
#         print(f"Files saved: {transcript_paths}")

#         return jsonify({
#             'success': True,
#             'message': 'Video uploaded and transcribed successfully',
#             'transcriptionId': video_id,
#             'videoPath': video_path,
#             'transcriptPaths': transcript_paths,
#             'metadata': transcript_data['metadata'],
#             'segments_count': len(transcript_data['segments']),
#             'duration': format_timestamp(transcript_data['duration']),
#             'language': transcript_data['language']
#         }), 200

#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# @app.route('/get-transcript/<video_id>', methods=['GET'])
# def get_transcript(video_id):
#     """Retrieve transcript by video ID"""
#     try:
#         json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
        
#         if not os.path.exists(json_path):
#             return jsonify({'error': 'Transcript not found'}), 404
        
#         with open(json_path, 'r', encoding='utf-8') as f:
#             transcript_data = json.load(f)
        
#         return jsonify(transcript_data), 200
        
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/health', methods=['GET'])
# def health_check():
#     """Check if server is running"""
#     return jsonify({
#         'status': 'running',
#         'model': 'whisper-base',
#         'timestamp': datetime.now().isoformat()
#     }), 200
# @app.route('/uploads/<path:filename>')
# def serve_video(filename):
#     return send_from_directory('uploads', filename)
# @app.route('/transcripts/<path:filename>')
# def serve_transcript(filename):
#     return send_from_directory('transcripts', filename)

# # ==================== PAGEINDEX RAG ENDPOINTS ====================
# @app.route('/pi-index-transcript', methods=['POST'])
# def pi_index_transcript():
#     """
#     Convert transcript to a clean UTF-8 PDF then submit to PageIndex.
#     Uses reportlab instead of fpdf to handle Unicode/special characters properly.
#     """
#     try:
#         if not PI_AVAILABLE:
#             return jsonify({'success': False, 'error': 'PageIndex not installed'}), 500

#         data = request.json
#         video_id = data.get('videoId')
#         transcript_text = data.get('transcript')

#         if not video_id or not transcript_text:
#             return jsonify({'success': False, 'error': 'videoId and transcript required'}), 400

#         pi_index = get_pi_index()
#         force = data.get('force', False)
#         if not force and video_id in pi_index and pi_index[video_id].get('status') in ('completed', 'processing'):
#             return jsonify({'success': True, 'doc_id': pi_index[video_id]['doc_id'], 'status': pi_index[video_id]['status']})
#         # If status == 'failed' OR force==True, fall through and re-submit
#         # ── Build PDF using reportlab (full Unicode support) ──────────────────
#         try:
#             from reportlab.lib.pagesizes import A4
#             from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
#             from reportlab.lib.units import cm
#             from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
#             from reportlab.lib.enums import TA_LEFT
#         except ImportError:
#             # Fallback: try fpdf2 with unicode font
#             return jsonify({'success': False, 'error': 'reportlab not installed. Run: pip install reportlab'}), 500

#         import tempfile
#         pdf_path = os.path.join(tempfile.gettempdir(), f'transcript_{video_id}.pdf')

#         doc = SimpleDocTemplate(
#             pdf_path,
#             pagesize=A4,
#             leftMargin=2*cm, rightMargin=2*cm,
#             topMargin=2*cm, bottomMargin=2*cm
#         )

#         styles = getSampleStyleSheet()
#         title_style = ParagraphStyle(
#             'Title', parent=styles['Heading1'],
#             fontSize=14, spaceAfter=12
#         )
#         body_style = ParagraphStyle(
#             'Body', parent=styles['Normal'],
#             fontSize=10, leading=14, spaceAfter=6
#         )

#         story = []
        
#         # Safe title
#         safe_title = video_id.replace('_', ' ').replace('-', ' ')
#         story.append(Paragraph(f'Lecture Transcript: {safe_title}', title_style))
#         story.append(Spacer(1, 0.3*cm))

#         # Split transcript into paragraphs of ~500 chars
#         # reportlab Paragraph handles Unicode fine — escape XML special chars
#         import re
        
#         def escape_xml(text):
#             return (text
#                 .replace('&', '&amp;')
#                 .replace('<', '&lt;')
#                 .replace('>', '&gt;')
#                 .replace('"', '&quot;')
#             )

#         # Split by sentence boundaries
#         sentences = re.split(r'(?<=[.!?])\s+', transcript_text)
#         chunk = ''
#         for sentence in sentences:
#             chunk += sentence + ' '
#             if len(chunk) > 500:
#                 story.append(Paragraph(escape_xml(chunk.strip()), body_style))
#                 story.append(Spacer(1, 0.1*cm))
#                 chunk = ''
#         if chunk.strip():
#             story.append(Paragraph(escape_xml(chunk.strip()), body_style))

#         doc.build(story)

#         print(f"PDF created at {pdf_path}, size: {os.path.getsize(pdf_path)} bytes")

#         # ── Submit to PageIndex ────────────────────────────────────────────────
#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
        
#         # Submit using open file handle — more reliable than path string
#         with open(pdf_path, 'rb') as pdf_file:
#             result = pi_client.submit_document(pdf_file)
        
#         doc_id = result.get('doc_id')
#         print(f"PageIndex submitted: doc_id={doc_id}")

#         try:
#             os.unlink(pdf_path)
#         except Exception:
#             pass

#         if not doc_id:
#             return jsonify({'success': False, 'error': f'PageIndex returned no doc_id: {result}'}), 500

#         pi_index[video_id] = {
#             'doc_id': doc_id,
#             'status': 'processing',
#             'submitted_at': datetime.now().isoformat(),
#             'type': 'transcript_pdf'
#         }
#         save_pi_index(pi_index)

#         return jsonify({'success': True, 'doc_id': doc_id, 'status': 'processing'})

#     except Exception as e:
#         import traceback
#         print(f"PageIndex index error: {e}")
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/pi-index-pdf', methods=['POST'])
# def pi_index_pdf():
#     """
#     Index an uploaded PDF (e.g. textbook chapter) directly into PageIndex.
#     Teacher uploads it from the Upload page — gets indexed alongside the transcript.
#     """
#     try:
#         if not PI_AVAILABLE:
#             return jsonify({'success': False, 'error': 'PageIndex not installed'}), 500

#         if 'file' not in request.files:
#             return jsonify({'success': False, 'error': 'No file provided'}), 400

#         file = request.files['file']
#         video_id = request.form.get('videoId', 'general')

#         if not file.filename.lower().endswith('.pdf'):
#             return jsonify({'success': False, 'error': 'Only PDF files accepted'}), 400

#         import tempfile
#         pdf_path = os.path.join(tempfile.gettempdir(), f'ref_{video_id}_{file.filename}')
#         file.save(pdf_path)

#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#         pdf_path = "C:\\Users\\Harsh\\AppData\\Local\\Temp\\transcript_Markovnikovs_Rule.pdf"
#         result = pi_client.submit_document(pdf_path)
#         doc_id = result.get('doc_id')

#         try:
#             os.unlink(pdf_path)
#         except Exception:
#             pass

#         # Store as a reference document (separate from transcript)
#         pi_index = get_pi_index()
#         ref_key = f'ref_{video_id}_{file.filename}'
#         pi_index[ref_key] = {
#             'doc_id': doc_id,
#             'status': 'processing',
#             'submitted_at': datetime.now().isoformat(),
#             'type': 'reference_pdf',
#             'filename': file.filename,
#             'video_id': video_id
#         }
#         save_pi_index(pi_index)

#         return jsonify({'success': True, 'doc_id': doc_id, 'refKey': ref_key, 'status': 'processing'})

#     except Exception as e:
#         print(f"PDF index error: {e}")
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/pi-status/<video_id>', methods=['GET'])
# def pi_status(video_id):
#     """Check if a transcript has been indexed by PageIndex"""
#     try:
#         if not PI_AVAILABLE:
#             return jsonify({'success': False, 'status': 'unavailable'})

#         pi_index = get_pi_index()
#         if video_id not in pi_index:
#             return jsonify({'success': True, 'status': 'not_indexed'})

#         doc_id = pi_index[video_id].get('doc_id')
#         if pi_index[video_id].get('status') == 'completed':
#             return jsonify({'success': True, 'status': 'completed', 'doc_id': doc_id})

#         # Check with PageIndex
#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#         status_result = pi_client.get_document(doc_id)
#         current_status = status_result.get('status', 'processing')

#         # Always write back whatever status PI returns
#         pi_index[video_id]['status'] = current_status
#         save_pi_index(pi_index)

#         return jsonify({
#             'success': True, 
#             'status': current_status, 
#             'doc_id': doc_id,
#             'pi_response': status_result  # helpful for debugging
#         })

#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500


# @app.route('/pi-chat', methods=['POST'])
# def pi_chat():
#     """Chat with a transcript using PageIndex RAG"""
#     try:
#         if not PI_AVAILABLE:
#             # Fallback to Gemini direct chat
#             return jsonify({'success': False, 'error': 'PageIndex not available', 'fallback': True})

#         data = request.json
#         video_id = data.get('videoId')
#         message = data.get('message')
#         history = data.get('history', [])
#         mode = data.get('mode', 'chat')  # 'chat' | 'gaps' | 'hard_concepts'

#         pi_index = get_pi_index()
#         if video_id not in pi_index or pi_index[video_id].get('status') != 'completed':
#             return jsonify({'success': False, 'error': 'Transcript not yet indexed', 'status': 'not_ready'})

#         doc_id = pi_index[video_id]['doc_id']
#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)

#         # Build messages based on mode
#         if mode == 'gaps':
#             prompt = "Analyze this lecture transcript and list the prerequisite concepts and prior knowledge a student needs to understand this content. Be specific and concise."
#         elif mode == 'hard_concepts':
#             prompt = "Identify the 3 most conceptually dense or difficult segments of this lecture. For each, explain why it's hard and suggest a simpler way to explain it."
#         elif mode == 'bloom_analysis':
#             prompt = f"Based on this transcript, generate an analysis of which Bloom's taxonomy levels (Remember, Understand, Apply, Analyze) the content covers. Return as JSON: {{\"l1_topics\": [], \"l2_topics\": [], \"l3_topics\": [], \"l4_topics\": []}}"
#         else:
#             # Build conversation history for PageIndex
#             messages = [{'role': m['role'], 'content': m['content']} for m in history[-6:]]  # last 6 turns
#             messages.append({'role': 'user', 'content': message})
            
#             response = pi_client.chat_completions(messages=messages, doc_id=doc_id)
#             answer = response['choices'][0]['message']['content']
            
#             return jsonify({
#                 'success': True,
#                 'answer': answer,
#                 'source': 'pageindex',
#                 'doc_id': doc_id
#             })

#         # For gap/concept analysis modes
#         response = pi_client.chat_completions(
#             messages=[{'role': 'user', 'content': prompt}],
#             doc_id=doc_id
#         )
#         answer = response['choices'][0]['message']['content']
#         return jsonify({'success': True, 'answer': answer, 'mode': mode, 'source': 'pageindex'})

#     except Exception as e:
#         print(f"PageIndex chat error: {e}")
#         return jsonify({'success': False, 'error': str(e)}), 500


# @app.route('/analyze-student-multidim', methods=['POST'])
# def analyze_student_multidim():
#     """
#     Multi-dimensional weakness analysis using Gemini.
#     Takes all behavioral + performance signals and returns a structured 6-dimension profile.
#     This is the research-backed classification engine.
#     """
#     try:
#         data = request.json
#         student_email = data.get('studentEmail')
#         video_id = data.get('videoId')
        
#         # All signals passed from frontend localStorage
#         completion_pct = data.get('completionPct', 0)
#         replay_count = data.get('replayCount', 0)
#         replay_segments = data.get('replaySegments', {})
#         checkpoint_attempts = data.get('checkpointAttempts', [])
#         session_history = data.get('sessionHistory', [])
#         confidence_data = data.get('confidenceData', {})  # {questionId: 'confident'|'unsure'|'guessing'}
#         class_avg = data.get('classAvg', {'score': 65, 'timeTaken': 120})

#         genai.configure(api_key='AIzaSyBZKKL9I_IiBwX1D5UJVP8maTlsnm0ufgg')
#         model = genai.GenerativeModel('gemini-2.5-flash')

#         # Build the analysis prompt
#         bloom_breakdown = {}
#         score_history = []
#         time_history = []

#         for attempt in checkpoint_attempts:
#             score_history.append(attempt.get('score', 0))
#             time_history.append(attempt.get('timeTaken', 0))
#             bloom_breakdown[attempt.get('checkpoint', 'unknown')] = {
#                 'score': attempt.get('score', 0),
#                 'bloomLevel': attempt.get('bloomLevel', 1),
#                 'bloomL1': attempt.get('bloomL1Score', 0),
#                 'bloomL2': attempt.get('bloomL2Score', 0),
#             }

#         # Compute learning velocity (score improvement over attempts)
#         velocity = 0
#         if len(score_history) >= 2:
#             velocity = score_history[-1] - score_history[0]

#         # Confidence calibration score
#         calibration_score = None
#         if confidence_data and checkpoint_attempts:
#             # Compare confidence ratings to actual correctness
#             confident_correct = 0
#             confident_total = 0
#             for attempt in checkpoint_attempts:
#                 for q_id, conf in confidence_data.items():
#                     if conf == 'confident':
#                         confident_total += 1
#                         # Check if they got it right
#                         answers = attempt.get('answers', {})
#                         # We don't have per-question correct here, use score as proxy
#             calibration_score = (attempt.get('score', 0) / 100) if attempt else None

#         prompt = f"""
# You are an educational AI analyzing a student's multi-dimensional learning profile.
# Analyze these signals and return a structured weakness assessment.

# STUDENT DATA:
# - Video completion: {completion_pct:.1f}%
# - Replay count: {replay_count} (class avg: {class_avg.get('replayCount', 2)})
# - Checkpoint scores: {score_history}
# - Average test time: {sum(time_history)/max(len(time_history),1):.0f}s (class avg: {class_avg.get('timeTaken', 120)}s)
# - Learning velocity (score change): {velocity:+.1f} points
# - Bloom's breakdown: {json.dumps(bloom_breakdown)}
# - Session count last 7 days: {len([s for s in session_history[-20:] if True])}

# Based on research in Cognitive Load Theory, Metacognition, and Educational Data Mining, 
# provide a 6-dimension analysis. Return ONLY valid JSON:

# {{
#   "dimensions": {{
#     "content_mastery": {{
#       "score": 0-100,
#       "label": "Strong|Adequate|Weak|Critical",
#       "insight": "one sentence explanation"
#     }},
#     "engagement_depth": {{
#       "score": 0-100,
#       "label": "Active|Passive|Minimal|Absent", 
#       "insight": "one sentence explanation"
#     }},
#     "metacognitive_calibration": {{
#       "score": 0-100,
#       "label": "Well-calibrated|Overconfident|Underconfident|Unknown",
#       "insight": "one sentence explanation"
#     }},
#     "knowledge_retention": {{
#       "score": 0-100,
#       "label": "Retaining|Forgetting|Inconsistent|Unknown",
#       "insight": "one sentence explanation"
#     }},
#     "learning_velocity": {{
#       "score": 0-100,
#       "label": "Accelerating|Stable|Declining|Unknown",
#       "insight": "one sentence explanation"
#     }},
#     "cognitive_load": {{
#       "score": 0-100,
#       "label": "Optimal|Elevated|Overloaded|Unknown",
#       "insight": "one sentence explanation — higher score = better (less overloaded)"
#     }}
#   }},
#   "primary_weakness": "content_mastery|engagement_depth|metacognitive_calibration|knowledge_retention|learning_velocity|cognitive_load",
#   "recommended_intervention": "one concrete action the teacher should take",
#   "student_message": "a brief, encouraging message to show the student (no labels, no jargon)"
# }}
# """
#         response = model.generate_content(prompt)
#         response_text = response.text.strip().replace('```json', '').replace('```', '').strip()

#         try:
#             result = json.loads(response_text)
#         except json.JSONDecodeError:
#             result = {"error": "Analysis failed", "raw": response_text}

#         return jsonify({'success': True, 'analysis': result, 'studentEmail': student_email, 'videoId': video_id})

#     except Exception as e:
#         print(f"Multi-dim analysis error: {e}")
#         return jsonify({'success': False, 'error': str(e)}), 500

# if __name__ == '__main__':
#     print("\n" + "="*60)
#     print("Video Transcription Server")
#     print("="*60)
#     print(f"Upload folder: {os.path.abspath(UPLOAD_FOLDER)}")
#     print(f"Transcripts folder: {os.path.abspath(TRANSCRIPTS_FOLDER)}")
#     print("Server starting on http://localhost:5000")
#     print("="*60 + "\n")
    
#     app.run(debug=True, host='0.0.0.0', port=5000)



# """
# Paathshala — Video Transcription + AI Learning Server
# Flask + Whisper + Gemini + PageIndex RAG
# Run: python app.py
# """

# import os
# import re
# import json
# import traceback
# from datetime import datetime, timedelta

# from flask import Flask, request, jsonify, send_from_directory
# from flask_cors import CORS
# from werkzeug.utils import secure_filename
# import whisper
# import google.generativeai as genai

# # ── PageIndex (optional — install: pip install pageindex reportlab) ─────────
# try:
#     from pageindex import PageIndexClient
#     PI_AVAILABLE = True
# except ImportError:
#     PI_AVAILABLE = False
#     print("WARNING: pip install pageindex")

# # ── App config ─────────────────────────────────────────────────────────────
# app = Flask(__name__)

# # CORS: allow React dev server on 3000 AND any other origin
# CORS(app,
#      origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
#      methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#      allow_headers=["Content-Type", "Authorization"],
#      supports_credentials=False)

# UPLOAD_FOLDER      = 'uploads'
# TRANSCRIPTS_FOLDER = 'transcripts'
# DATA_FOLDER        = 'data'
# ALLOWED_EXTENSIONS = {'mp4', 'mov', 'avi', 'mkv', 'webm'}

# # ── Single Gemini API key — change here only ───────────────────────────────
# GEMINI_API_KEY = 'AIzaSyCaf6nLYdTFjD3UsCkIMcZiD8kXfyCPb40'

# # ── PageIndex API key — set via environment variable ───────────────────────
# PAGEINDEX_API_KEY = '3922a6cb97424d1685d03afa58016c5f'
# PI_INDEX_FILE     = os.path.join(DATA_FOLDER, 'pageindex_docs.json')

# os.makedirs(UPLOAD_FOLDER,      exist_ok=True)
# os.makedirs(TRANSCRIPTS_FOLDER, exist_ok=True)
# os.makedirs(DATA_FOLDER,        exist_ok=True)

# print("Loading Whisper model (base)...")
# whisper_model = whisper.load_model("base")
# print("Whisper ready.")

# # ══════════════════════════════════════════════════════════════════════════════
# # HELPERS
# # ══════════════════════════════════════════════════════════════════════════════

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def format_timestamp(seconds):
#     """Seconds → H:MM:SS string."""
#     return str(timedelta(seconds=int(seconds)))

# def format_srt_timestamp(seconds):
#     h  = int(seconds // 3600)
#     m  = int((seconds % 3600) // 60)
#     s  = int(seconds % 60)
#     ms = int((seconds % 1) * 1000)
#     return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

# def format_vtt_timestamp(seconds):
#     h  = int(seconds // 3600)
#     m  = int((seconds % 3600) // 60)
#     s  = int(seconds % 60)
#     ms = int((seconds % 1) * 1000)
#     return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"

# def get_gemini():
#     """Configure and return a Gemini model — single place for the API key."""
#     genai.configure(api_key=GEMINI_API_KEY)
#     return genai.GenerativeModel('gemini-2.5-flash')

# def get_pi_index():
#     if os.path.exists(PI_INDEX_FILE):
#         with open(PI_INDEX_FILE, 'r', encoding='utf-8') as f:
#             return json.load(f)
#     return {}

# def save_pi_index(data):
#     with open(PI_INDEX_FILE, 'w', encoding='utf-8') as f:
#         json.dump(data, f, indent=2)

# def escape_xml(text):
#     """Escape characters that break reportlab Paragraph XML parser."""
#     return (str(text)
#         .replace('&',  '&amp;')
#         .replace('<',  '&lt;')
#         .replace('>',  '&gt;')
#         .replace('"',  '&quot;')
#         .replace("'",  '&#39;')
#         .replace('\x00', '')   # Whisper sometimes emits null bytes
#     )

# def build_transcript_pdf(transcript_text: str, video_id: str) -> str:
#     """
#     Convert transcript text → PDF using reportlab (full UTF-8/Unicode support).
#     Returns the path to the created PDF.
#     Raises RuntimeError if reportlab is not installed.
#     BUG FIX: fpdf2 was crashing on Unicode chars (→ α β °).
#               reportlab handles all Unicode natively.
#     """
#     try:
#         from reportlab.lib.pagesizes import A4
#         from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
#         from reportlab.lib.units import cm
#         from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
#     except ImportError:
#         raise RuntimeError("reportlab not installed. Run: pip install reportlab")

#     import tempfile
#     pdf_path = os.path.join(tempfile.gettempdir(), f'transcript_{video_id}.pdf')

#     doc = SimpleDocTemplate(
#         pdf_path, pagesize=A4,
#         leftMargin=2*cm, rightMargin=2*cm,
#         topMargin=2*cm,  bottomMargin=2*cm
#     )

#     styles     = getSampleStyleSheet()
#     title_style = ParagraphStyle('PT', parent=styles['Heading1'], fontSize=14, spaceAfter=12)
#     body_style  = ParagraphStyle('PB', parent=styles['Normal'],   fontSize=10, leading=14, spaceAfter=6)

#     safe_title = escape_xml(video_id.replace('_', ' ').replace('-', ' '))
#     story = [
#         Paragraph(f'Lecture Transcript: {safe_title}', title_style),
#         Spacer(1, 0.3*cm)
#     ]

#     # Split into ~500-char chunks at sentence boundaries
#     sentences = re.split(r'(?<=[.!?])\s+', transcript_text)
#     chunk = ''
#     for sentence in sentences:
#         chunk += sentence + ' '
#         if len(chunk) > 500:
#             story.append(Paragraph(escape_xml(chunk.strip()), body_style))
#             story.append(Spacer(1, 0.1*cm))
#             chunk = ''
#     if chunk.strip():
#         story.append(Paragraph(escape_xml(chunk.strip()), body_style))

#     doc.build(story)
#     size = os.path.getsize(pdf_path)
#     print(f"[PDF] {pdf_path}  ({size} bytes)")
#     if size < 500:
#         raise RuntimeError(f"PDF suspiciously small ({size} bytes) — transcript may be empty")
#     return pdf_path

# # ══════════════════════════════════════════════════════════════════════════════
# # TRANSCRIPTION
# # ══════════════════════════════════════════════════════════════════════════════

# def transcribe_video(video_path, video_id):
#     print(f"[Whisper] Transcribing: {video_path}")
#     result = whisper_model.transcribe(video_path, word_timestamps=True, language='en', verbose=False)

#     segments = []
#     for seg in result['segments']:
#         s = {
#             'id':         seg['id'],
#             'start':      seg['start'],
#             'end':        seg['end'],
#             'start_time': format_timestamp(seg['start']),
#             'end_time':   format_timestamp(seg['end']),
#             'text':       seg['text'].strip(),
#             'words':      []
#         }
#         for w in seg.get('words', []):
#             s['words'].append({
#                 'word':       w['word'],
#                 'start':      w['start'],
#                 'end':        w['end'],
#                 'start_time': format_timestamp(w['start']),
#                 'end_time':   format_timestamp(w['end'])
#             })
#         segments.append(s)

#     # BUG FIX: Whisper doesn't reliably return result['duration']
#     # Use the last segment's end time instead
#     duration = segments[-1]['end'] if segments else 0

#     return {
#         'video_id':           video_id,
#         'transcription_date': datetime.now().isoformat(),
#         'language':           result.get('language', 'en'),
#         'duration':           duration,
#         'segments':           segments,
#         'full_text':          ' '.join(s['text'] for s in segments)
#     }

# def save_transcript(transcript_data, video_id):
#     base = os.path.join(TRANSCRIPTS_FOLDER, video_id)

#     with open(f"{base}.json", 'w', encoding='utf-8') as f:
#         json.dump(transcript_data, f, indent=2, ensure_ascii=False)

#     with open(f"{base}.txt", 'w', encoding='utf-8') as f:
#         f.write(f"Video: {video_id}\nDate: {transcript_data['transcription_date']}\n")
#         f.write(f"Language: {transcript_data['language']}\n")
#         f.write(f"Duration: {format_timestamp(transcript_data['duration'])}\n")
#         f.write('='*60 + '\n\n')
#         for seg in transcript_data['segments']:
#             f.write(f"[{seg['start_time']} -> {seg['end_time']}]\n{seg['text']}\n\n")

#     with open(f"{base}.srt", 'w', encoding='utf-8') as f:
#         for i, seg in enumerate(transcript_data['segments'], 1):
#             f.write(f"{i}\n")
#             f.write(f"{format_srt_timestamp(seg['start'])} --> {format_srt_timestamp(seg['end'])}\n")
#             f.write(f"{seg['text']}\n\n")

#     # VTT — served to video player for subtitles
#     with open(f"{base}.vtt", 'w', encoding='utf-8') as f:
#         f.write("WEBVTT\n\n")
#         for seg in transcript_data['segments']:
#             f.write(f"{format_vtt_timestamp(seg['start'])} --> {format_vtt_timestamp(seg['end'])}\n")
#             f.write(f"{seg['text']}\n\n")

#     return {
#         'json': f"{base}.json",
#         'txt':  f"{base}.txt",
#         'srt':  f"{base}.srt",
#         'vtt':  f"{base}.vtt"
#     }

# # ══════════════════════════════════════════════════════════════════════════════
# # ROUTES — Static / Health
# # ══════════════════════════════════════════════════════════════════════════════

# @app.route('/health', methods=['GET'])
# def health_check():
#     return jsonify({
#         'status':     'running',
#         'model':      'whisper-base',
#         'pageindex':  PI_AVAILABLE,
#         'timestamp':  datetime.now().isoformat()
#     })

# @app.route('/uploads/<path:filename>')
# def serve_video(filename):
#     """
#     Serve video files to the React player.
#     BUG FIX: React player uses http://localhost:5000/uploads/{filename}
#     This must exist — React cannot serve from Flask's uploads/ folder.
#     """
#     return send_from_directory(
#         os.path.abspath(UPLOAD_FOLDER),
#         filename,
#         conditional=True   # supports Range requests (video seeking)
#     )

# @app.route('/transcripts/<path:filename>')
# def serve_transcript(filename):
#     """
#     Serve transcript files — including .vtt for video subtitles.
#     BUG FIX: VideoPlayer must use http://localhost:5000/transcripts/{videoId}.vtt
#     NOT a relative path from localhost:3000 (React doesn't serve these).
#     """
#     return send_from_directory(os.path.abspath(TRANSCRIPTS_FOLDER), filename)

# # ══════════════════════════════════════════════════════════════════════════════
# # ROUTES — Video Management
# # ══════════════════════════════════════════════════════════════════════════════

# @app.route('/get-videos', methods=['GET'])
# def get_videos():
#     try:
#         videos = []
#         for filename in sorted(os.listdir(UPLOAD_FOLDER)):
#             if not allowed_file(filename):
#                 continue
#             video_id    = os.path.splitext(filename)[0]
#             video_path  = os.path.join(UPLOAD_FOLDER, filename)
#             has_transcript = os.path.exists(os.path.join(TRANSCRIPTS_FOLDER, f'{video_id}.json'))

#             title       = video_id.replace('_', ' ').title()
#             subject     = 'General'
#             description = ''
#             duration    = 0

#             if has_transcript:
#                 try:
#                     with open(os.path.join(TRANSCRIPTS_FOLDER, f'{video_id}.json'), 'r', encoding='utf-8') as f:
#                         td = json.load(f)
#                     meta        = td.get('metadata', {})
#                     title       = meta.get('title', title)
#                     subject     = meta.get('subject', subject)
#                     description = meta.get('description', description)
#                     duration    = td.get('duration', 0)
#                 except Exception:
#                     pass

#             videos.append({
#                 'id':            video_id,
#                 'videoId':       video_id,
#                 'title':         title,
#                 'subject':       subject,
#                 'description':   description,
#                 'instructor':    'Teacher',
#                 'duration':      format_timestamp(duration),
#                 'date':          datetime.fromtimestamp(
#                                      os.path.getctime(video_path)
#                                  ).strftime('%d %b %Y, %I:%M %p'),
#                 'hasTranscript': has_transcript,
#                 # Full URL so React player can use directly
#                 'videoUrl':      f'http://localhost:5000/uploads/{filename}',
#                 'vttUrl':        f'http://localhost:5000/transcripts/{video_id}.vtt' if has_transcript else None
#             })

#         return jsonify({'success': True, 'videos': videos})
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/upload-video', methods=['POST'])
# def upload_video():
#     try:
#         if 'video' not in request.files:
#             return jsonify({'error': 'No video file'}), 400
#         video_file = request.files['video']
#         if not video_file.filename or not allowed_file(video_file.filename):
#             return jsonify({'error': 'Invalid file type'}), 400

#         title       = request.form.get('title', 'Untitled').strip()
#         description = request.form.get('description', '')
#         subject     = request.form.get('subject', 'General')
#         category    = request.form.get('category', 'General')
#         scheduled   = request.form.get('scheduledDate', '')

#         ext      = video_file.filename.rsplit('.', 1)[-1].lower()
#         video_id = secure_filename(title)
#         filename = f"{video_id}.{ext}"
#         path     = os.path.join(UPLOAD_FOLDER, filename)
#         video_file.save(path)
#         print(f"[Upload] Saved {path}")

#         transcript_data = transcribe_video(path, video_id)
#         transcript_data['metadata'] = {
#             'title':             title,
#             'description':       description,
#             'subject':           subject,
#             'category':          category,
#             'scheduled_date':    scheduled,
#             'original_filename': video_file.filename,
#             'saved_filename':    filename
#         }
#         paths = save_transcript(transcript_data, video_id)

#         return jsonify({
#             'success':         True,
#             'message':         'Uploaded and transcribed',
#             'transcriptionId': video_id,
#             'videoUrl':        f'http://localhost:5000/uploads/{filename}',
#             'vttUrl':          f'http://localhost:5000/transcripts/{video_id}.vtt',
#             'transcriptPaths': paths,
#             'metadata':        transcript_data['metadata'],
#             'segments_count':  len(transcript_data['segments']),
#             'duration':        format_timestamp(transcript_data['duration']),
#             'language':        transcript_data['language']
#         })
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'error': str(e)}), 500

# @app.route('/get-transcript/<video_id>', methods=['GET'])
# def get_transcript(video_id):
#     try:
#         path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
#         if not os.path.exists(path):
#             return jsonify({'error': 'Not found'}), 404
#         with open(path, 'r', encoding='utf-8') as f:
#             return jsonify(json.load(f))
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# # ══════════════════════════════════════════════════════════════════════════════
# # ROUTES — AI Features
# # ══════════════════════════════════════════════════════════════════════════════

# @app.route('/generate-summary', methods=['POST'])
# def generate_summary():
#     try:
#         data            = request.json
#         transcript_text = data.get('transcript', '')
#         video_id        = data.get('videoId', '')
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         m      = get_gemini()
#         prompt = f"""You are an expert educational content summarizer. Analyze this lecture transcript.

# TRANSCRIPT:
# {transcript_text[:6000]}

# Create a summary in HTML format with:
# 1. Overview (2-3 sentences): Main topic and purpose
# 2. Key Concepts (3-5 bullet points): Core ideas explained
# 3. Important Topics: Detailed breakdown with subheadings
# 4. Visual SVG Diagram: Illustrate the main concept relationships (400-500px wide, use blues/purples/greens)
# 5. Key Takeaways (3-4 points)

# RULES:
# - Return ONLY valid HTML for innerHTML — no markdown, no code blocks, no preamble
# - Use: <h3>,<h4>,<p>,<ul>,<li>,<strong>,<em> with inline CSS
# - SVG must be self-contained with gradients and clear labels"""

#         resp = m.generate_content(prompt)
#         html = resp.text.replace('```html', '').replace('```', '').strip()
#         return jsonify({'success': True, 'summary': {'html': html, 'videoId': video_id}})
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/generate-concepts', methods=['POST'])
# def generate_concepts():
#     try:
#         transcript_text = (request.json or {}).get('transcript', '')
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         m      = get_gemini()
#         prompt = f"""Extract the most important concepts from this lecture transcript.

# TRANSCRIPT:
# {transcript_text[:5000]}

# Return ONLY a JSON array — no markdown:
# [
#   {{
#     "title": "Concept Name",
#     "description": "2-3 sentence explanation",
#     "timestamp": "0:05:30",
#     "importance": "high"
#   }}
# ]
# importance must be "high", "medium", or "low"."""

#         resp = m.generate_content(prompt)
#         text = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             concepts = json.loads(text)
#         except Exception:
#             concepts = []
#         return jsonify({'success': True, 'concepts': concepts})
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/generate-practice', methods=['POST'])
# def generate_practice():
#     try:
#         transcript_text = (request.json or {}).get('transcript', '')
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         m      = get_gemini()
#         prompt = f"""Create 5 practice questions from this lecture transcript.
# Mix: 2 fill-in-the-blank, 2 MCQ (4 options), 1 short-answer.

# TRANSCRIPT:
# {transcript_text[:5000]}

# Return ONLY valid JSON array:
# [
#   {{"id":1,"type":"fill-blank","question":"The ___ involves...","answer":"answer","hint":"hint"}},
#   {{"id":2,"type":"mcq","question":"What is...","options":["A","B","C","D"],"correctAnswer":1,"explanation":"Because..."}},
#   {{"id":3,"type":"short-answer","question":"Explain...","keywords":["a","b"],"sampleAnswer":"..."}}
# ]"""

#         resp = m.generate_content(prompt)
#         text = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             questions = json.loads(text)
#         except Exception:
#             questions = []
#         return jsonify({'success': True, 'questions': questions})
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/generate-flashcards', methods=['POST'])
# def generate_flashcards():
#     try:
#         data            = request.json or {}
#         transcript_text = data.get('transcript', '')
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         m      = get_gemini()
#         prompt = f"""Create 10 flashcard Q&A pairs from this lecture transcript.

# TRANSCRIPT:
# {transcript_text[:5000]}

# Return ONLY valid JSON array:
# [{{"question":"What is X?","answer":"X is...","explanation":"Context"}}]"""

#         resp = m.generate_content(prompt)
#         text = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             cards = json.loads(text)
#         except Exception:
#             cards = []
#         return jsonify({'success': True, 'flashcards': cards})
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/generate-revision-test', methods=['POST'])
# def generate_revision_test():
#     try:
#         data            = request.json or {}
#         transcript_text = data.get('transcript', '')
#         weak_areas      = data.get('weakAreas', [])
#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         weak_text = ', '.join(weak_areas) if weak_areas else 'general topics'
#         m         = get_gemini()
#         prompt    = f"""Create a 5-question revision test. Focus on: {weak_text}

# TRANSCRIPT:
# {transcript_text[:5000]}

# Return ONLY valid JSON — 3 MCQ + 2 fill-blank:
# [
#   {{"id":1,"type":"mcq","question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}},
#   {{"id":2,"type":"fill-blank","question":"___ converts light to energy","answer":"photosynthesis","explanation":"..."}}
# ]"""

#         resp = m.generate_content(prompt)
#         text = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             questions = json.loads(text)
#         except Exception:
#             questions = []
#         return jsonify({'success': True, 'questions': questions})
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/evaluate-answer', methods=['POST'])
# def evaluate_answer():
#     try:
#         data           = request.json or {}
#         question       = data.get('question', '')
#         user_answer    = data.get('userAnswer', '')
#         correct_answer = data.get('correctAnswer', '')
#         q_type         = data.get('type', '')

#         # For MCQ/fill-blank, no AI needed — direct comparison
#         if q_type in ['fill-blank', 'mcq']:
#             is_correct = str(user_answer).strip().lower() == str(correct_answer).strip().lower()
#             return jsonify({
#                 'success':   True,
#                 'isCorrect': is_correct,
#                 'feedback':  'Correct!' if is_correct else f'The correct answer is: {correct_answer}'
#             })

#         # Short answer — use Gemini
#         m      = get_gemini()
#         prompt = f"""Evaluate this student answer.
# QUESTION: {question}
# EXPECTED: {correct_answer}
# STUDENT:  {user_answer}

# Return ONLY valid JSON:
# {{"isCorrect":true,"score":8,"feedback":"Your detailed feedback here"}}
# score is 0-10."""

#         resp = m.generate_content(prompt)
#         text = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             ev = json.loads(text)
#         except Exception:
#             ev = {"isCorrect": False, "score": 0, "feedback": "Could not evaluate — try again"}
#         return jsonify({'success': True, **ev})
#     except Exception as e:
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/chat-with-transcript', methods=['POST'])
# def chat_with_transcript():
#     """
#     BUG FIX: Previously sent transcript as plain text → Gemini hallucinated timestamps.
#     Now: Frontend sends actual segments array with real start_time + start seconds.
#     We give Gemini numbered segments. It returns which segment INDICES answered the
#     question. We resolve those to real timestamps — zero hallucination.
#     """
#     try:
#         data            = request.json or {}
#         transcript_text = data.get('transcript', '')
#         user_message    = data.get('message', '')
#         chat_history    = data.get('history', [])
#         segments        = data.get('segments', [])   # ← real segment objects from frontend

#         if not transcript_text or not user_message:
#             return jsonify({'success': False, 'error': 'Missing transcript or message'}), 400

#         # Build numbered segment index for real timestamp lookup
#         segment_lines = ''
#         segment_map   = {}
#         for i, seg in enumerate(segments[:120]):   # cap at 120 segments
#             st   = seg.get('start_time', '0:00:00')
#             text = seg.get('text', '').strip()
#             segment_lines += f"[{i}] {st} — {text}\n"
#             segment_map[str(i)] = {
#                 'start_time':    st,
#                 'start_seconds': float(seg.get('start', 0)),
#                 'text':          text
#             }

#         if not segment_lines:
#             segment_lines = transcript_text[:4000]

#         history_text = ''
#         for msg in chat_history[-4:]:
#             history_text += f"{msg['role'].upper()}: {msg['content']}\n"

#         m      = get_gemini()
#         prompt = f"""You are an AI tutor. Answer the student's question using ONLY the transcript below.

# TRANSCRIPT (format: [index] real_timestamp — text):
# {segment_lines}

# RECENT CONVERSATION:
# {history_text}

# STUDENT QUESTION: {user_message}

# Instructions:
# 1. Answer using ONLY transcript content — say "I can't find that in this lecture" if not present
# 2. Identify up to 3 segment indices whose text directly supports your answer
# 3. Be clear, simple, warm

# Return ONLY this exact JSON (no markdown, no fences):
# {{"answer":"Your answer","segment_ids":[0,5],"confidence":"high"}}
# confidence must be "high", "medium", or "low"."""

#         resp   = m.generate_content(prompt)
#         raw    = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             parsed = json.loads(raw)
#         except Exception:
#             parsed = {"answer": raw, "segment_ids": [], "confidence": "low"}

#         # Resolve segment IDs → real timestamps (never hallucinated)
#         real_segments   = []
#         real_timestamps = []
#         for sid in parsed.get('segment_ids', []):
#             key = str(sid)
#             if key in segment_map:
#                 s = segment_map[key]
#                 real_timestamps.append(s['start_time'])
#                 real_segments.append({
#                     'start_time':    s['start_time'],
#                     'start_seconds': s['start_seconds'],
#                     'text':          s['text'][:150]
#                 })

#         return jsonify({
#             'success':  True,
#             'response': {
#                 'answer':     parsed.get('answer', ''),
#                 'timestamps': real_timestamps,
#                 'segments':   real_segments,
#                 'confidence': parsed.get('confidence', 'medium')
#             }
#         })
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/generate-blooms-questions', methods=['POST'])
# def generate_blooms_questions():
#     """Generate checkpoint questions at a specific Bloom's Taxonomy level."""
#     try:
#         data            = request.json or {}
#         transcript_text = data.get('transcript', '')
#         bloom_level     = int(data.get('bloomLevel', 2))
#         num_questions   = int(data.get('numQuestions', 3))
#         checkpoint      = data.get('checkpoint', 'alpha')

#         if not transcript_text:
#             return jsonify({'success': False, 'error': 'No transcript'}), 400

#         bloom_desc = {
#             1: "recall specific facts, definitions, or key terms directly from the text (Remember)",
#             2: "explain or paraphrase concepts in their own words (Understand)",
#             3: "apply a concept to a new scenario or example (Apply)",
#             4: "analyze relationships, causes, or differences between concepts (Analyze)"
#         }.get(bloom_level, "understand the content")

#         m      = get_gemini()
#         prompt = f"""Generate exactly {num_questions} multiple-choice questions at Bloom's Level {bloom_level}.

# BLOOM'S LEVEL {bloom_level} means questions must require students to: {bloom_desc}

# CRITICAL RULES:
# - Questions must be answerable ONLY from the transcript below
# - Each question has exactly 4 options
# - Only ONE correct answer
# - Return ONLY valid JSON — no markdown, no fences

# TRANSCRIPT:
# {transcript_text[:3000]}

# Return this exact structure:
# {{
#   "questions": [
#     {{
#       "id": "cp_{checkpoint}_1",
#       "question": "Question text here",
#       "options": ["Option A", "Option B", "Option C", "Option D"],
#       "correctAnswer": 0,
#       "bloomLevel": {bloom_level},
#       "explanation": "Why this answer is correct"
#     }}
#   ]
# }}"""

#         resp = m.generate_content(prompt)
#         raw  = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             result = json.loads(raw)
#         except Exception:
#             return jsonify({
#                 'success': False,
#                 'error':   'Failed to parse AI response',
#                 'raw':     raw[:300]
#             }), 500

#         return jsonify({
#             'success':    True,
#             'questions':  result.get('questions', []),
#             'bloomLevel': bloom_level,
#             'checkpoint': checkpoint
#         })
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/analyze-student-multidim', methods=['POST'])
# def analyze_student_multidim():
#     """6-dimension Gemini analysis of student learning profile."""
#     try:
#         data                = request.json or {}
#         student_email       = data.get('studentEmail', '')
#         completion_pct      = float(data.get('completionPct', 0))
#         replay_count        = int(data.get('replayCount', 0))
#         checkpoint_attempts = data.get('checkpointAttempts', [])
#         session_history     = data.get('sessionHistory', [])
#         class_avg           = data.get('classAvg', {'score': 65, 'timeTaken': 120, 'replayCount': 2})

#         score_history = [a.get('score', 0) for a in checkpoint_attempts]
#         time_history  = [a.get('timeTaken', 0) for a in checkpoint_attempts]
#         velocity      = (score_history[-1] - score_history[0]) if len(score_history) >= 2 else 0

#         bloom_breakdown = {}
#         for a in checkpoint_attempts:
#             cp = a.get('checkpoint', 'unknown')
#             bloom_breakdown[cp] = {
#                 'score': a.get('score', 0),
#                 'bloomLevel': a.get('bloomLevel', 1),
#                 'bloomL1': a.get('bloomL1Score', 0),
#                 'bloomL2': a.get('bloomL2Score', 0)
#             }

#         m      = get_gemini()
#         prompt = f"""Analyze this student's multi-dimensional learning profile based on research in Cognitive Load Theory and Metacognition.

# STUDENT SIGNALS:
# - Video completion:    {completion_pct:.1f}%
# - Replay count:        {replay_count} (class avg: {class_avg.get('replayCount', 2)})
# - Checkpoint scores:   {score_history}
# - Avg test time:       {(sum(time_history)/max(len(time_history),1)):.0f}s (class avg: {class_avg.get('timeTaken',120)}s)
# - Learning velocity:   {velocity:+.1f} pts (score change across checkpoints)
# - Bloom breakdown:     {json.dumps(bloom_breakdown)}
# - Sessions last 20:    {len(session_history[-20:])}

# Return ONLY this JSON (no markdown):
# {{
#   "dimensions": {{
#     "content_mastery":           {{"score":75,"label":"Adequate","insight":"one sentence explanation"}},
#     "engagement_depth":          {{"score":60,"label":"Passive","insight":"one sentence explanation"}},
#     "metacognitive_calibration": {{"score":50,"label":"Overconfident","insight":"one sentence explanation"}},
#     "knowledge_retention":       {{"score":70,"label":"Retaining","insight":"one sentence explanation"}},
#     "learning_velocity":         {{"score":65,"label":"Stable","insight":"one sentence explanation"}},
#     "cognitive_load":            {{"score":40,"label":"Overloaded","insight":"one sentence explanation"}}
#   }},
#   "primary_weakness": "cognitive_load",
#   "recommended_intervention": "One concrete action teacher should take",
#   "student_message": "Encouraging message for student (no jargon, no labels)"
# }}
# Valid labels — content_mastery: Strong|Adequate|Weak|Critical
# engagement_depth: Active|Passive|Minimal|Absent
# metacognitive_calibration: Well-calibrated|Overconfident|Underconfident|Unknown
# knowledge_retention: Retaining|Forgetting|Inconsistent|Unknown
# learning_velocity: Accelerating|Stable|Declining|Unknown
# cognitive_load: Optimal|Elevated|Overloaded|Unknown"""

#         resp = m.generate_content(prompt)
#         raw  = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             result = json.loads(raw)
#         except Exception:
#             result = {"error": "Parse failed", "raw": raw[:300]}

#         return jsonify({'success': True, 'analysis': result, 'studentEmail': student_email})
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/explain-missed-concept', methods=['POST'])
# def explain_missed_concept():
#     """
#     PageIndex RAG pipeline:
#     1. Student got a question wrong
#     2. Search transcript for chunks about that concept
#        — PageIndex semantic search if indexed
#        — keyword fallback if not
#     3. Feed real chunks to Gemini
#     4. Gemini explains using ONLY what the teacher said

#     BUG FIX: PageIndex SDK method order fixed:
#     - search:       pi_client.search(query, doc_id, top_k)
#     - get_document: pi_client.get_document_status(doc_id)
#     """
#     try:
#         data            = request.json or {}
#         video_id        = data.get('videoId', '')
#         question_text   = data.get('questionText', '')
#         correct_answer  = data.get('correctAnswer', '')
#         student_answer  = data.get('studentAnswer', '')
#         bloom_level     = int(data.get('bloomLevel', 2))

#         if not video_id or not question_text:
#             return jsonify({'success': False, 'error': 'videoId and questionText required'}), 400

#         json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
#         if not os.path.exists(json_path):
#             return jsonify({'success': False, 'error': f'Transcript not found for video: {video_id}'}), 404

#         with open(json_path, 'r', encoding='utf-8') as f:
#             transcript_data = json.load(f)
#         segments = transcript_data.get('segments', [])

#         # ── Retrieval ──────────────────────────────────────────────────────
#         pi_index         = get_pi_index()
#         retrieved_chunks = []
#         retrieval_source = 'keyword'

#         if (PI_AVAILABLE and PAGEINDEX_API_KEY and
#                 video_id in pi_index and
#                 pi_index[video_id].get('status') == 'completed'):
#             try:
#                 pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#                 doc_id    = pi_index[video_id]['doc_id']
#                 query     = f"{question_text} {correct_answer}"
#                 # BUG FIX: positional args — search(query, doc_id, top_k)
#                 search_result = pi_client.search(query, doc_id, 4)
#                 for chunk in search_result.get('chunks', []):
#                     retrieved_chunks.append({
#                         'text':          chunk.get('text', ''),
#                         'score':         round(float(chunk.get('score', 0)), 3),
#                         'source':        'pageindex',
#                         'chunk_index':   chunk.get('index', 0),
#                         'start_time':    '',
#                         'start_seconds': 0
#                     })
#                 retrieval_source = 'pageindex'
#                 print(f"[PageIndex] {len(retrieved_chunks)} chunks retrieved for: {query[:60]}")
#             except Exception as pi_err:
#                 print(f"[PageIndex] Search failed, using keyword fallback: {pi_err}")
#                 retrieved_chunks = []

#         if not retrieved_chunks:
#             # Keyword search across real transcript segments
#             stop_words = {
#                 'what','that','this','with','from','have','been','they','their',
#                 'when','where','which','does','into','more','some','about','would',
#                 'could','should','after','before','also','just','only','then'
#             }
#             search_terms = set()
#             for word in re.findall(r'\b\w{4,}\b', (question_text + ' ' + str(correct_answer)).lower()):
#                 if word not in stop_words:
#                     search_terms.add(word)

#             scored = []
#             for seg in segments:
#                 t_lower = seg['text'].lower()
#                 score   = sum(1 for w in search_terms if w in t_lower)
#                 if score > 0:
#                     scored.append((score, seg))
#             scored.sort(key=lambda x: x[0], reverse=True)

#             for score, seg in scored[:4]:
#                 retrieved_chunks.append({
#                     'text':          seg['text'],
#                     'score':         round(score / max(len(search_terms), 1), 2),
#                     'source':        'keyword_search',
#                     'start_time':    seg.get('start_time', '0:00:00'),
#                     'start_seconds': float(seg.get('start', 0)),
#                     'segment_id':    seg.get('id', 0)
#                 })

#         # Fallback: use middle of transcript
#         if not retrieved_chunks:
#             mid = len(segments) // 2
#             for seg in segments[max(0, mid-2):mid+3]:
#                 retrieved_chunks.append({
#                     'text':          seg['text'],
#                     'score':         0.1,
#                     'source':        'fallback',
#                     'start_time':    seg.get('start_time', '0:00:00'),
#                     'start_seconds': float(seg.get('start', 0)),
#                     'segment_id':    seg.get('id', 0)
#                 })

#         # ── Gemini explanation ─────────────────────────────────────────────
#         bloom_instruction = {
#             1: "Explain it as a simple definition the student can memorize.",
#             2: "Explain what it means and why it matters — help them understand, not just recall.",
#             3: "Explain AND give a concrete real-life example.",
#             4: "Explain the concept and the reasoning behind why it works."
#         }.get(bloom_level, "Explain it clearly and simply.")

#         chunks_text = "\n\n".join(
#             f"[Lecture at {c.get('start_time','?')}]: {c['text']}"
#             for c in retrieved_chunks
#         )

#         m      = get_gemini()
#         prompt = f"""A student answered a quiz question incorrectly. Use ONLY the lecture content below to explain the correct concept.

# QUESTION: {question_text}
# CORRECT ANSWER: {correct_answer}
# STUDENT'S ANSWER: {student_answer}

# RELEVANT LECTURE CONTENT (found via RAG search):
# {chunks_text}

# TASK: {bloom_instruction}

# RULES:
# - Use ONLY the lecture content — no outside knowledge
# - Start with: "Your teacher explained this at [timestamp] — here's what was said:"
# - Give a simple explanation (3-5 sentences max)
# - End with: "The key point to remember: [one sentence]"
# - Be warm and encouraging

# Return ONLY valid JSON (no markdown):
# {{
#   "explanation": "Full explanation here",
#   "key_takeaway": "One sentence takeaway",
#   "source_timestamp": "0:02:30",
#   "source_snippet": "Exact phrase from lecture (max 20 words)"
# }}"""

#         resp = m.generate_content(prompt)
#         raw  = resp.text.strip().replace('```json', '').replace('```', '').strip()
#         try:
#             result = json.loads(raw)
#         except Exception:
#             result = {
#                 "explanation":    raw,
#                 "key_takeaway":   "",
#                 "source_timestamp": retrieved_chunks[0].get('start_time', '') if retrieved_chunks else '',
#                 "source_snippet": ""
#             }

#         if not result.get('source_timestamp') and retrieved_chunks:
#             result['source_timestamp'] = retrieved_chunks[0].get('start_time', '0:00:00')

#         return jsonify({
#             'success':          True,
#             'explanation':      result,
#             'retrieved_chunks': retrieved_chunks,
#             'retrieval_source': retrieval_source,
#             'concept':          question_text[:80]
#         })
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# # ══════════════════════════════════════════════════════════════════════════════
# # ROUTES — PageIndex RAG
# # ══════════════════════════════════════════════════════════════════════════════

# @app.route('/pi-index-transcript', methods=['POST'])
# def pi_index_transcript():
#     """
#     Convert transcript → PDF → PageIndex.
#     BUG FIX 1: fpdf2 crashes on Unicode (→ α β °). Use reportlab.
#     BUG FIX 2: Pass file PATH string to submit_document, not file handle.
#     BUG FIX 3: force=true re-submits previously failed documents.
#     """
#     try:
#         if not PI_AVAILABLE:
#             return jsonify({'success': False, 'error': 'pip install pageindex'}), 500
#         if not PAGEINDEX_API_KEY:
#             return jsonify({'success': False, 'error': 'PAGEINDEX_API_KEY not set in environment'}), 500

#         data            = request.json or {}
#         video_id        = data.get('videoId', '').strip()
#         transcript_text = data.get('transcript', '').strip()
#         force           = data.get('force', False)

#         if not video_id or not transcript_text:
#             return jsonify({'success': False, 'error': 'videoId and transcript required'}), 400

#         pi_index = get_pi_index()

#         # Skip if already done (unless forced)
#         if not force and video_id in pi_index:
#             status = pi_index[video_id].get('status', '')
#             if status == 'completed':
#                 return jsonify({'success': True, 'doc_id': pi_index[video_id]['doc_id'], 'status': 'already_indexed'})
#             if status == 'processing':
#                 return jsonify({'success': True, 'doc_id': pi_index[video_id]['doc_id'], 'status': 'processing'})
#             # 'failed' → fall through and re-submit

#         # Build PDF (reportlab, full Unicode)
#         try:
#             pdf_path = build_transcript_pdf(transcript_text, video_id)
#         except RuntimeError as e:
#             return jsonify({'success': False, 'error': str(e)}), 500

#         # Submit PDF path string to PageIndex
#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#         result    = pi_client.submit_document(pdf_path)

#         # Clean up temp file
#         try:
#             os.unlink(pdf_path)
#         except Exception:
#             pass

#         doc_id = result.get('doc_id')
#         if not doc_id:
#             return jsonify({
#                 'success': False,
#                 'error':   f'PageIndex returned no doc_id. Response: {result}'
#             }), 500

#         print(f"[PageIndex] Submitted '{video_id}' → doc_id={doc_id}")

#         pi_index[video_id] = {
#             'doc_id':       doc_id,
#             'status':       'processing',
#             'submitted_at': datetime.now().isoformat(),
#             'type':         'transcript_pdf'
#         }
#         save_pi_index(pi_index)

#         return jsonify({'success': True, 'doc_id': doc_id, 'status': 'processing'})

#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# # @app.route('/pi-status/<video_id>', methods=['GET'])
# # def pi_status(video_id):
# #     """
# #     Poll PageIndex for document processing status.
# #     BUG FIX: Correct SDK method is get_document_status(doc_id), not get_document(doc_id).
# #     """
# #     try:
# #         pi_index = get_pi_index()
# #         if video_id not in pi_index:
# #             return jsonify({'success': True, 'status': 'not_indexed'})

# #         entry  = pi_index[video_id]
# #         doc_id = entry.get('doc_id')

# #         if entry.get('status') == 'completed':
# #             return jsonify({'success': True, 'status': 'completed', 'doc_id': doc_id})

# #         if not PI_AVAILABLE or not PAGEINDEX_API_KEY:
# #             return jsonify({'success': True, 'status': entry.get('status', 'unknown'), 'doc_id': doc_id})

# #         # Poll PageIndex
# #         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
# #         try:
# #             # BUG FIX: correct method name
# #             status_result  = pi_client.get_document_status(doc_id)
# #             current_status = status_result.get('status', 'processing')
# #         except Exception as e:
# #             print(f"[PageIndex] Status poll error: {e}")
# #             current_status = entry.get('status', 'processing')

# #         pi_index[video_id]['status'] = current_status
# #         save_pi_index(pi_index)

# #         return jsonify({'success': True, 'status': current_status, 'doc_id': doc_id})

# #     except Exception as e:
# #         print(traceback.format_exc())
# #         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/pi-status/<video_id>', methods=['GET'])
# def pi_status(video_id):
#     """
#     BUG FIX: SDK has no get_document_status() method.
#     Call PageIndex REST API directly with requests instead.
#     """
#     import requests as req

#     try:
#         pi_index = get_pi_index()
#         if video_id not in pi_index:
#             return jsonify({'success': True, 'status': 'not_indexed'})

#         entry  = pi_index[video_id]
#         doc_id = entry.get('doc_id')

#         if entry.get('status') == 'completed':
#             return jsonify({'success': True, 'status': 'completed', 'doc_id': doc_id})

#         if not PAGEINDEX_API_KEY or not doc_id:
#             return jsonify({'success': True, 'status': entry.get('status', 'unknown'), 'doc_id': doc_id})

#         # Call PageIndex REST API directly — no SDK method guessing
#         # Try the two most common endpoint patterns
#         headers = {
#             'Authorization': f'Bearer {PAGEINDEX_API_KEY}',
#             'Content-Type':  'application/json'
#         }

#         current_status = None
#         last_error     = ''

#         # Pattern 1: /documents/{doc_id}
#         try:
#             r = req.get(
#                 f'https://api.pageindex.ai/documents/{doc_id}',
#                 headers=headers, timeout=10
#             )
#             print(f"[PI status] pattern1 → {r.status_code}: {r.text[:200]}")
#             if r.status_code == 200:
#                 data = r.json()
#                 current_status = data.get('status') or data.get('state') or data.get('indexing_status')
#         except Exception as e:
#             last_error = str(e)

#         # Pattern 2: /v1/documents/{doc_id}  (versioned)
#         if not current_status:
#             try:
#                 r = req.get(
#                     f'https://api.pageindex.ai/v1/documents/{doc_id}',
#                     headers=headers, timeout=10
#                 )
#                 print(f"[PI status] pattern2 → {r.status_code}: {r.text[:200]}")
#                 if r.status_code == 200:
#                     data = r.json()
#                     current_status = data.get('status') or data.get('state') or data.get('indexing_status')
#             except Exception as e:
#                 last_error = str(e)

#         # Pattern 3: /index/{doc_id}
#         if not current_status:
#             try:
#                 r = req.get(
#                     f'https://api.pageindex.ai/index/{doc_id}',
#                     headers=headers, timeout=10
#                 )
#                 print(f"[PI status] pattern3 → {r.status_code}: {r.text[:200]}")
#                 if r.status_code == 200:
#                     data = r.json()
#                     current_status = data.get('status') or data.get('state')
#             except Exception as e:
#                 last_error = str(e)

#         if not current_status:
#             # All patterns failed — keep existing status, log the raw responses
#             print(f"[PI status] All REST patterns failed. Last error: {last_error}")
#             return jsonify({
#                 'success': True,
#                 'status':  entry.get('status', 'processing'),
#                 'doc_id':  doc_id,
#                 'note':    'Could not reach PageIndex API — check terminal for raw responses'
#             })

#         # Normalise: PageIndex might return 'indexed', 'ready', 'done', 'complete' — treat all as completed
#         if current_status.lower() in ('indexed', 'ready', 'done', 'complete', 'completed', 'success'):
#             current_status = 'completed'

#         pi_index[video_id]['status'] = current_status
#         save_pi_index(pi_index)

#         print(f"[PI status] {video_id} → {current_status}")
#         return jsonify({'success': True, 'status': current_status, 'doc_id': doc_id})

#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/pi-chat', methods=['POST'])
# def pi_chat():
#     import requests as req

#     try:
#         data     = request.json or {}
#         video_id = data.get('videoId', '')
#         message  = data.get('message', '')
#         history  = data.get('history', [])
#         mode     = data.get('mode', 'chat')

#         if not PAGEINDEX_API_KEY:
#             return jsonify({'success': False, 'error': 'PAGEINDEX_API_KEY not set'})

#         pi_index = get_pi_index()
#         if video_id not in pi_index or pi_index[video_id].get('status') != 'completed':
#             return jsonify({'success': False, 'error': 'Transcript not indexed yet', 'status': 'not_ready'})

#         doc_id = pi_index[video_id]['doc_id']

#         # Build prompt based on mode
#         if mode == 'gaps':
#             user_message = ("Analyze this lecture and list all prerequisite concepts "
#                             "a student needs before studying this content. List each gap clearly.")
#         elif mode == 'hard_concepts':
#             user_message = ("Identify the 3 most conceptually difficult parts of this lecture. "
#                             "For each: explain why it's hard and suggest a simpler explanation.")
#         else:
#             user_message = message

#         # Build messages array
#         messages = [{'role': m['role'], 'content': m['content']} for m in history[-6:]]
#         messages.append({'role': 'user', 'content': user_message})

#         headers = {
#             'Authorization': f'Bearer {PAGEINDEX_API_KEY}',
#             'Content-Type':  'application/json'
#         }

#         # Try PageIndex chat endpoint patterns
#         payload = {'doc_id': doc_id, 'messages': messages}
#         answer  = None

#         for endpoint in [
#             'https://api.pageindex.ai/chat',
#             'https://api.pageindex.ai/v1/chat',
#             f'https://api.pageindex.ai/documents/{doc_id}/chat',
#             'https://api.pageindex.ai/chat/completions',
#         ]:
#             try:
#                 r = req.post(endpoint, json=payload, headers=headers, timeout=30)
#                 print(f"[PI chat] {endpoint} → {r.status_code}: {r.text[:200]}")
#                 if r.status_code == 200:
#                     resp_data = r.json()
#                     # Try different response shapes
#                     answer = (
#                         resp_data.get('answer') or
#                         resp_data.get('content') or
#                         resp_data.get('message') or
#                         (resp_data.get('choices', [{}])[0].get('message', {}).get('content'))
#                     )
#                     if answer:
#                         break
#             except Exception as e:
#                 print(f"[PI chat] {endpoint} error: {e}")
#                 continue

#         if not answer:
#             # Fallback: use Gemini with transcript text
#             print("[PI chat] All PageIndex endpoints failed — falling back to Gemini")
#             json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
#             if os.path.exists(json_path):
#                 with open(json_path, 'r', encoding='utf-8') as f:
#                     td = json.load(f)
#                 transcript_text = td.get('full_text', '')
#             else:
#                 transcript_text = ''

#             m = get_gemini()
#             gemini_prompt = f"""Answer this question about the lecture: {user_message}

# LECTURE TRANSCRIPT:
# {transcript_text[:4000]}

# Be clear and concise. Base your answer only on the transcript."""
#             resp   = m.generate_content(gemini_prompt)
#             answer = resp.text.strip()
#             return jsonify({'success': True, 'answer': answer, 'mode': mode, 'source': 'gemini_fallback'})

#         return jsonify({'success': True, 'answer': answer, 'mode': mode, 'source': 'pageindex'})

#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/pi-index-pdf', methods=['POST'])
# def pi_index_pdf():
#     """Index an uploaded reference PDF (textbook chapter etc.) into PageIndex."""
#     try:
#         if not PI_AVAILABLE or not PAGEINDEX_API_KEY:
#             return jsonify({'success': False, 'error': 'PageIndex not configured'}), 500
#         if 'file' not in request.files:
#             return jsonify({'success': False, 'error': 'No file provided'}), 400

#         file     = request.files['file']
#         video_id = request.form.get('videoId', 'general')

#         if not file.filename.lower().endswith('.pdf'):
#             return jsonify({'success': False, 'error': 'Only PDF files are accepted'}), 400

#         import tempfile
#         safe_name = secure_filename(file.filename)
#         pdf_path  = os.path.join(tempfile.gettempdir(), f'ref_{video_id}_{safe_name}')
#         file.save(pdf_path)
#         print(f"[PDF upload] Saved {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#         result    = pi_client.submit_document(pdf_path)
#         doc_id    = result.get('doc_id')

#         try:
#             os.unlink(pdf_path)
#         except Exception:
#             pass

#         ref_key  = f'ref_{video_id}_{safe_name}'
#         pi_index = get_pi_index()
#         pi_index[ref_key] = {
#             'doc_id':       doc_id,
#             'status':       'processing',
#             'submitted_at': datetime.now().isoformat(),
#             'type':         'reference_pdf',
#             'filename':     file.filename,
#             'video_id':     video_id
#         }
#         save_pi_index(pi_index)

#         return jsonify({'success': True, 'doc_id': doc_id, 'refKey': ref_key, 'status': 'processing'})
#     except Exception as e:
#         print(traceback.format_exc())
#         return jsonify({'success': False, 'error': str(e)}), 500

# @app.route('/get-all-student-flags', methods=['GET'])
# def get_all_student_flags():
#     return jsonify({'success': True, 'message': 'Flags stored client-side in localStorage'})

# @app.route('/pi-debug', methods=['GET'])
# def pi_debug():
#     """Temporary — shows all real methods on PageIndexClient. Remove after use."""
#     try:
#         pi_client = PageIndexClient(api_key=PAGEINDEX_API_KEY)
#         methods = [m for m in dir(pi_client) if not m.startswith('_')]
#         return jsonify({'methods': methods, 'type': str(type(pi_client))})
#     except Exception as e:
#         return jsonify({'error': str(e)})


# # ══════════════════════════════════════════════════════════════════════════════
# if __name__ == '__main__':
#     print("\n" + "="*55)
#     print("  Paathshala Backend — http://localhost:5000")
#     print(f"  PageIndex: {'✓ ready' if PI_AVAILABLE else '✗ not installed'}")
#     print(f"  PI Key set: {'✓' if PAGEINDEX_API_KEY else '✗ set PAGEINDEX_API_KEY env var'}")
#     print("="*55 + "\n")
#     app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)


"""
Paathshala — Video Transcription + AI Learning Server
Flask + Whisper + Gemini + PageIndex Local Tree RAG
"""

import os, re, json, traceback
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import whisper
import google.generativeai as genai

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000","http://127.0.0.1:3000","*"],
     methods=["GET","POST","PUT","DELETE","OPTIONS"],
     allow_headers=["Content-Type","Authorization"])

UPLOAD_FOLDER      = 'uploads'
TRANSCRIPTS_FOLDER = 'transcripts'
DATA_FOLDER        = 'data'
TREES_FOLDER       = os.path.join(DATA_FOLDER, 'trees')  # ← put {videoId}.json here
ALLOWED_EXTENSIONS = {'mp4','mov','avi','mkv','webm'}
GEMINI_API_KEY     = 'AIzaSyDjI9i2wXLAj9PPuX6UTf7SThxgFBdHqDo'


for d in [UPLOAD_FOLDER, TRANSCRIPTS_FOLDER, DATA_FOLDER, TREES_FOLDER]:
    os.makedirs(d, exist_ok=True)

print("Loading Whisper...")
whisper_model = whisper.load_model("base")
print("Whisper ready.")

# ── Helpers ─────────────────────────────────────────────────────────────────
def _track_chat_node_hits(video_id, email, chunks, query):
    """
    When student asks a chat question, the retrieved chunks tell us what nodes
    they're curious/confused about. If they hit the same node 2+ times in chat,
    flag it — same as a replay signal.
    """
    if not email or not video_id or not chunks:
        return

    try:
        replay_dir  = os.path.join(DATA_FOLDER, 'replays')
        os.makedirs(replay_dir, exist_ok=True)
        replay_file = os.path.join(replay_dir, f"{email.replace('@','_')}_{video_id}.json")

        if os.path.exists(replay_file):
            with open(replay_file, 'r', encoding='utf-8') as f:
                replay_data = json.load(f)
        else:
            replay_data = {
                'email': email, 'video_id': video_id,
                'total_replays': 0, 'nodes': {}, 'segments': {}, 'events': [],
                'chat_hits': {}
            }

        if 'chat_hits' not in replay_data:
            replay_data['chat_hits'] = {}

        for chunk in chunks:
            nid = chunk.get('node_id', '')
            if not nid:
                continue

            # Increment chat hit count for this node
            replay_data['chat_hits'][nid] = replay_data['chat_hits'].get(nid, 0) + 1
            chat_count = replay_data['chat_hits'][nid]

            # If student asked about this node 2+ times in chat → flag it
            if chat_count >= 2:
                if nid not in replay_data['nodes']:
                    replay_data['nodes'][nid] = {
                        'node_id':   nid,
                        'title':     chunk.get('title', ''),
                        'section':   chunk.get('section', ''),
                        'page_range': f"pages {chunk.get('start_index','?')}–{chunk.get('end_index','?')}",
                        'count':     0,
                        'flagged':   False,
                        'flag_types': [],
                        'sources':   []
                    }

                # Mark source as chat (not replay)
                if 'sources' not in replay_data['nodes'][nid]:
                    replay_data['nodes'][nid]['sources'] = []
                if 'chat' not in replay_data['nodes'][nid]['sources']:
                    replay_data['nodes'][nid]['sources'].append('chat')

                replay_data['nodes'][nid]['chat_hits'] = chat_count
                replay_data['nodes'][nid]['flagged']   = True
                flags = ['flag2']
                if chat_count >= 3: flags.append('flag1')
                replay_data['nodes'][nid]['flag_types'] = list(set(
                    replay_data['nodes'][nid].get('flag_types', []) + flags
                ))

        replay_data['last_updated'] = datetime.now().isoformat()

        with open(replay_file, 'w', encoding='utf-8') as f:
            json.dump(replay_data, f, indent=2)

        print(f"[ChatTrack] {email} | {video_id} | nodes: {[c.get('node_id') for c in chunks]}")
    except Exception as e:
        print(f"[ChatTrack] Failed silently: {e}")
def allowed_file(f): return '.' in f and f.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS
def fmt_ts(s): return str(timedelta(seconds=int(s)))
def fmt_srt(s):
    h,m,sec,ms = int(s//3600),int((s%3600)//60),int(s%60),int((s%1)*1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"
def fmt_vtt(s):
    h,m,sec,ms = int(s//3600),int((s%3600)//60),int(s%60),int((s%1)*1000)
    return f"{h:02d}:{m:02d}:{sec:02d}.{ms:03d}"
def get_gemini():
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel('gemini-2.5-flash')
def escape_xml(t):
    return str(t).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;').replace('"','&quot;').replace("'",'&#39;').replace('\x00','')

# ── PageIndex Local Tree ─────────────────────────────────────────────────────
STOP = {'what','that','this','with','from','have','been','they','their','when',
        'where','which','does','into','more','some','about','would','could',
        'should','after','before','also','just','only','then','than','very',
        'will','each','such','both','here','there','these','those','were'}

def get_tree_path(video_id):
    return os.path.join(TREES_FOLDER, f'{video_id}.json')

def load_tree(video_id):
    p = get_tree_path(video_id)
    if os.path.exists(p):
        with open(p,'r',encoding='utf-8') as f: return json.load(f)
    return None

def flatten_tree(nodes, parent_path=None, depth=0):
    """
    Recursively flatten PageIndex tree into searchable chunks.
    Preserves start_index/end_index (textbook page range) from each node.
    """
    if parent_path is None:
        parent_path = []

    chunks = []
    for node in (nodes or []):
        title = node.get('title', '')
        path  = parent_path + ([title] if title else [])

        chunks.append({
            'node_id':     node.get('node_id', ''),
            'title':       title,
            'text':        node.get('text', '').strip(),
            'summary':     node.get('summary', '').strip(),
            'path':        path,
            'section':     ' › '.join(path),
            'depth':       depth,
            'start_index': node.get('start_index', '?'),   # ← textbook page start
            'end_index':   node.get('end_index', '?'),     # ← textbook page end
        })

        if node.get('nodes'):
            chunks.extend(flatten_tree(node['nodes'], path, depth + 1))

    return chunks
def get_query_terms(q):
    return {w for w in re.findall(r'\b[a-zA-Z]{3,}\b', q.lower()) if w not in STOP}

def score_chunk(chunk, qw):
    """
    Score a tree chunk against query words.
    Weights: title match (×5) > text match (×2) > summary match (×1)
    Also partial-match: checks if query word is CONTAINED in a longer word.
    e.g. "didentate" matches "bidentate" or "didentate"
    """
    if not chunk.get('text') and not chunk.get('summary'):
        return 0.0

    text_l    = chunk.get('text', '').lower()
    title_l   = chunk.get('title', '').lower()
    summary_l = chunk.get('summary', '').lower()

    score = 0.0
    for word in qw:
        # Exact title match — highest signal
        score += 5.0 * title_l.count(word)
        # Partial title match (e.g. query "didentate" hits "bidentate" in title)
        if word in title_l:
            score += 2.0
        # Exact text match
        score += 2.0 * text_l.count(word)
        # Partial text match — word appears as substring
        if word in text_l:
            score += 1.0
        # Summary match
        score += 1.0 * summary_l.count(word)

    # Boost content-rich nodes
    if len(chunk.get('text', '')) > 300:
        score += 2.0
    # Boost deeper nodes (more specific content)
    score += chunk.get('depth', 0) * 0.5

    return score


def search_tree(video_id, query, top_k=4, min_score=0.0):
    """
    DFS traversal of the PageIndex tree.
    Scores every node against the query.
    Returns top_k matches with full section path + page range.
    
    Sort bug fix: use (score, index) tuple — dicts are never compared.
    """
    tree = load_tree(video_id)
    if not tree:
        return [], 'not_found'

    all_chunks = flatten_tree(tree)
    qw = get_query_terms(query)

    if not qw:
        # No meaningful terms — return first few content-rich nodes
        content = [c for c in all_chunks if len(c['text']) > 100]
        return content[:top_k], 'local_tree'

    # Score every node — use enumerate index as tiebreaker (fixes dict comparison crash)
    scored = []
    for i, chunk in enumerate(all_chunks):
        s = score_chunk(chunk, qw)
        if s > min_score:
            scored.append((s, i, chunk))   # (score, index, chunk) — never compares dicts

    scored.sort(key=lambda x: x[0], reverse=True)

    results = [chunk for _, _, chunk in scored[:top_k]]

    # If nothing scored, return top-level sections as fallback
    if not results:
        results = [c for c in all_chunks if c['depth'] <= 1 and len(c['text']) > 50][:top_k]

    return results, 'local_tree'

def _chunk_summary(chunk):
    """Serialise a chunk for the API response (removes heavy fields)."""
    return {
        'node_id':    chunk.get('node_id', ''),
        'title':      chunk.get('title', ''),
        'section':    chunk.get('section', ''),
        'depth':      chunk.get('depth', 0),
        'page_range': f"pages {chunk.get('start_index','?')}–{chunk.get('end_index','?')}",
        'text':       chunk.get('text', '')[:300],
        'source':     'local_tree'
    }
# ── Transcription ─────────────────────────────────────────────────────────────
def transcribe_video(path, video_id):
    result = whisper_model.transcribe(path, word_timestamps=True, language='en', verbose=False)
    segs = []
    for seg in result['segments']:
        s = {'id':seg['id'],'start':seg['start'],'end':seg['end'],
             'start_time':fmt_ts(seg['start']),'end_time':fmt_ts(seg['end']),
             'text':seg['text'].strip(),'words':[]}
        for w in seg.get('words',[]):
            s['words'].append({'word':w['word'],'start':w['start'],'end':w['end'],
                               'start_time':fmt_ts(w['start']),'end_time':fmt_ts(w['end'])})
        segs.append(s)
    duration = segs[-1]['end'] if segs else 0
    return {'video_id':video_id,'transcription_date':datetime.now().isoformat(),
            'language':result.get('language','en'),'duration':duration,
            'segments':segs,'full_text':' '.join(s['text'] for s in segs)}

def save_transcript(td, video_id):
    base = os.path.join(TRANSCRIPTS_FOLDER, video_id)
    with open(f"{base}.json",'w',encoding='utf-8') as f: json.dump(td,f,indent=2,ensure_ascii=False)
    with open(f"{base}.txt",'w',encoding='utf-8') as f:
        f.write(f"Video:{video_id}\nDate:{td['transcription_date']}\n{'='*60}\n\n")
        for s in td['segments']: f.write(f"[{s['start_time']}→{s['end_time']}]\n{s['text']}\n\n")
    with open(f"{base}.srt",'w',encoding='utf-8') as f:
        for i,s in enumerate(td['segments'],1):
            f.write(f"{i}\n{fmt_srt(s['start'])} --> {fmt_srt(s['end'])}\n{s['text']}\n\n")
    with open(f"{base}.vtt",'w',encoding='utf-8') as f:
        f.write("WEBVTT\n\n")
        for s in td['segments']: f.write(f"{fmt_vtt(s['start'])} --> {fmt_vtt(s['end'])}\n{s['text']}\n\n")
    return {'json':f"{base}.json",'txt':f"{base}.txt",'srt':f"{base}.srt",'vtt':f"{base}.vtt"}

# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.route('/health')
def health():
    trees = [f.replace('.json','') for f in os.listdir(TREES_FOLDER) if f.endswith('.json')] if os.path.exists(TREES_FOLDER) else []
    return jsonify({'status':'running','trees_indexed':trees,'timestamp':datetime.now().isoformat()})

@app.route('/uploads/<path:filename>')
def serve_video(filename):
    return send_from_directory(os.path.abspath(UPLOAD_FOLDER), filename, conditional=True)

@app.route('/transcripts/<path:filename>')
def serve_transcript(filename):
    return send_from_directory(os.path.abspath(TRANSCRIPTS_FOLDER), filename)

@app.route('/get-videos')
def get_videos():
    try:
        videos = []
        for filename in sorted(os.listdir(UPLOAD_FOLDER)):
            if not allowed_file(filename): continue
            vid = os.path.splitext(filename)[0]
            vpath = os.path.join(UPLOAD_FOLDER, filename)
            has_t = os.path.exists(os.path.join(TRANSCRIPTS_FOLDER,f'{vid}.json'))
            has_tree = os.path.exists(get_tree_path(vid))
            title,subject,desc,dur = vid.replace('_',' ').title(),'General','',0
            if has_t:
                try:
                    with open(os.path.join(TRANSCRIPTS_FOLDER,f'{vid}.json'),'r',encoding='utf-8') as f:
                        td = json.load(f)
                    m = td.get('metadata',{})
                    title,subject,desc,dur = m.get('title',title),m.get('subject',subject),m.get('description',desc),td.get('duration',0)
                except: pass
            videos.append({'id':vid,'videoId':vid,'title':title,'subject':subject,
                'description':desc,'instructor':'Teacher','duration':fmt_ts(dur),
                'date':datetime.fromtimestamp(os.path.getctime(vpath)).strftime('%d %b %Y, %I:%M %p'),
                'hasTranscript':has_t,'hasTree':has_tree,
                'videoUrl':f'http://localhost:5000/uploads/{filename}',
                'vttUrl':f'http://localhost:5000/transcripts/{vid}.vtt' if has_t else None})
        return jsonify({'success':True,'videos':videos})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/upload-video', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files: return jsonify({'error':'No video'}),400
        vf = request.files['video']
        if not vf.filename or not allowed_file(vf.filename): return jsonify({'error':'Invalid file'}),400
        title = request.form.get('title','Untitled').strip()
        ext = vf.filename.rsplit('.',1)[-1].lower()
        vid = secure_filename(title)
        fname = f"{vid}.{ext}"
        path = os.path.join(UPLOAD_FOLDER, fname)
        vf.save(path)
        td = transcribe_video(path, vid)
        td['metadata'] = {'title':title,'description':request.form.get('description',''),
                          'subject':request.form.get('subject','General'),
                          'category':request.form.get('category','General'),
                          'original_filename':vf.filename,'saved_filename':fname}
        paths = save_transcript(td, vid)
        return jsonify({'success':True,'transcriptionId':vid,
                        'videoUrl':f'http://localhost:5000/uploads/{fname}',
                        'vttUrl':f'http://localhost:5000/transcripts/{vid}.vtt',
                        'segments_count':len(td['segments']),
                        'duration':fmt_ts(td['duration']),'language':td['language']})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'error':str(e)}),500

@app.route('/get-transcript/<video_id>')
def get_transcript(video_id):
    path = os.path.join(TRANSCRIPTS_FOLDER,f"{video_id}.json")
    if not os.path.exists(path): return jsonify({'error':'Not found'}),404
    with open(path,'r',encoding='utf-8') as f: return jsonify(json.load(f))

# ── PageIndex Tree Routes ─────────────────────────────────────────────────────

@app.route('/pi-upload-tree/<video_id>', methods=['POST'])
def pi_upload_tree(video_id):
    """
    Upload the PageIndex document-structure JSON for a video.
    Two options:
      1. Multipart: field 'tree' = the JSON file
      2. Raw JSON body: the tree array directly
    """
    try:
        if 'tree' in request.files:
            content = request.files['tree'].read().decode('utf-8')
            tree_data = json.loads(content)
        elif request.is_json:
            tree_data = request.json
        else:
            return jsonify({'success':False,'error':'Provide JSON file or raw JSON body'}),400

        if not isinstance(tree_data, list):
            return jsonify({'success':False,'error':'Tree must be a JSON array at root level'}),400

        with open(get_tree_path(video_id),'w',encoding='utf-8') as f:
            json.dump(tree_data,f,indent=2,ensure_ascii=False)

        chunks = flatten_tree(tree_data)
        sections = [c['title'] for c in chunks if c['depth']==1][:10]
        print(f"[Tree] {video_id} → {len(chunks)} nodes, sections: {sections[:3]}")
        return jsonify({'success':True,'video_id':video_id,'node_count':len(chunks),'sections':sections})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/pi-status/<video_id>')
def pi_status(video_id):
    """Check if local tree exists for this video. No network calls needed."""
    if os.path.exists(get_tree_path(video_id)):
        tree = load_tree(video_id)
        chunks = flatten_tree(tree) if tree else []
        return jsonify({'success':True,'status':'completed','source':'local_tree',
                        'node_count':len(chunks),
                        'sections':[c['title'] for c in chunks if c['depth']==1][:8]})
    return jsonify({'success':True,'status':'not_indexed'})

@app.route('/pi-tree/<video_id>')
def pi_get_tree(video_id):
    """Return full tree for visualization."""
    tree = load_tree(video_id)
    if not tree: return jsonify({'success':False,'error':f'No tree for {video_id}'}),404
    chunks = flatten_tree(tree)
    def build(nodes, depth=0):
        return [{'node_id':n.get('node_id',''),'title':n.get('title',''),'depth':depth,
                 'has_text':len(n.get('text',''))>50,'text_len':len(n.get('text','')),
                 'children':build(n.get('nodes',[]),depth+1)} for n in (nodes or [])]
    return jsonify({'success':True,'video_id':video_id,'tree':build(tree),
                    'node_count':len(chunks),
                    'flat':[{'node_id':c['node_id'],'title':c['title'],'section':c['section'],
                              'depth':c['depth'],'text_preview':c['text'][:120]} for c in chunks]})

@app.route('/pi-search/<video_id>', methods=['POST'])
def pi_search(video_id):
    """Direct tree search endpoint."""
    data = request.json or {}
    query = data.get('query','')
    if not query: return jsonify({'success':False,'error':'query required'}),400
    chunks, source = search_tree(video_id, query, int(data.get('top_k',4)))
    if source == 'not_found': return jsonify({'success':False,'error':f'No tree for {video_id}'}),404
    return jsonify({'success':True,'query':query,'source':source,
                    'chunks':[{'node_id':c['node_id'],'title':c['title'],'text':c['text'],
                                'section':c['section'],'depth':c['depth']} for c in chunks]})
@app.route('/pi-chat', methods=['POST'])
def pi_chat():
    try:
        data     = request.json or {}
        video_id = data.get('videoId', '')
        message  = data.get('message', '')
        history  = data.get('history', [])
        mode     = data.get('mode', 'chat')

        print(f"\n{'='*60}")
        print(f"[PI-CHAT] video_id  : {video_id}")
        print(f"[PI-CHAT] message   : {message[:80]}")
        print(f"[PI-CHAT] mode      : {mode}")
        print(f"{'='*60}")

        # ── STAGE 1: Load tree ────────────────────────────────────────────────
        tree_path = get_tree_path(video_id)
        print(f"[STAGE 1] Looking for tree at: {tree_path}")
        print(f"[STAGE 1] File exists: {os.path.exists(tree_path)}")

        tree = load_tree(video_id)
        if not tree:
            print(f"[STAGE 1] ❌ TREE NOT FOUND — returning error")
            return jsonify({
                'success': False,
                'error':   f'No tree for {video_id}. Put {video_id}.json in data/trees/',
                'status':  'not_ready'
            })
        print(f"[STAGE 1] ✅ Tree loaded — top-level nodes: {len(tree)}")

        # ── STAGE 2: Flatten tree ─────────────────────────────────────────────
        all_chunks = flatten_tree(tree)
        print(f"[STAGE 2] Total nodes after flatten: {len(all_chunks)}")
        print(f"[STAGE 2] Sample node titles: {[c['title'][:40] for c in all_chunks[:5]]}")

        m = get_gemini()

        if mode in ('gaps', 'hard_concepts'):
            # Simple modes — no scoring needed
            top = [c for c in all_chunks if c.get('depth', 0) <= 1 and len(c.get('text','')) > 50][:5]
            ctx = '\n\n'.join(
                f"[{c['section']} | pages {c.get('start_index','?')}–{c.get('end_index','?')}]\n{c.get('text','')[:500]}"
                for c in top
            )
            if mode == 'gaps':
                resp = m.generate_content(
                    f"What prerequisite knowledge does a student need BEFORE studying this chapter?\n\n"
                    f"CHAPTER CONTENT:\n{ctx}\n\nList each as: '• [Concept]: [Why needed]'."
                )
            else:
                resp = m.generate_content(
                    f"Identify the 3 most difficult concepts in this chapter for students.\n"
                    f"For each: name it, why it's hard, simpler explanation.\n\nCONTENT:\n{ctx}"
                )
            return jsonify({'success': True, 'answer': resp.text.strip(), 'mode': mode,
                            'source': 'local_tree', 'retrieved_chunks': [_chunk_summary(c) for c in top]})

        # ── STAGE 3: Extract query terms ──────────────────────────────────────
        qw = get_query_terms(message)
        print(f"[STAGE 3] Query terms extracted: {qw}")

        if not qw:
            print(f"[STAGE 3] ⚠️  No query terms — all words were stop words")

        # ── STAGE 4: Score every node ─────────────────────────────────────────
        print(f"[STAGE 4] Scoring {len(all_chunks)} nodes...")
        scored = []
        for i, chunk in enumerate(all_chunks):
            s = score_chunk(chunk, qw)
            scored.append((s, i, chunk))

        scored.sort(key=lambda x: (x[0], -x[1]), reverse=True)

        print(f"[STAGE 4] Top 10 scores:")
        for rank, (s, idx, c) in enumerate(scored[:10]):
            print(f"          #{rank+1}  score={s:.1f}  depth={c.get('depth',0)}  title='{c['title'][:60]}'")

        # ── STAGE 5: Pick top 5 chunks ────────────────────────────────────────
        top_chunks = [chunk for _, _, chunk in scored[:5]]
        top_scores = [s    for s,  _, _ in scored[:5]]

        print(f"[STAGE 5] Sending these {len(top_chunks)} chunks to Gemini:")
        for i, (c, s) in enumerate(zip(top_chunks, top_scores)):
            print(f"          Chunk {i+1}: score={s:.1f}  section='{c['section'][:70]}'")
            print(f"                   text length={len(c.get('text',''))}  chars")
            print(f"                   text preview='{c.get('text','')[:80]}'")

        # ── STAGE 6: Build Gemini context ─────────────────────────────────────
        context_blocks = []
        for i, c in enumerate(top_chunks):
            page_range = f"pages {c.get('start_index','?')}–{c.get('end_index','?')}"
            block = (
                f"--- SOURCE {i+1} ---\n"
                f"SECTION: {c['section']}\n"
                f"LOCATION: {page_range} | Node: {c.get('node_id','')}\n"
                f"CONTENT:\n{c.get('text', '')}"
            )
            context_blocks.append(block)

        context   = '\n\n'.join(context_blocks)
        hist_text = '\n'.join(
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in history[-4:]
        )

        print(f"[STAGE 6] Total context length sent to Gemini: {len(context)} chars")

        # ── STAGE 7: Call Gemini ──────────────────────────────────────────────
        prompt = f"""You are an AI chemistry tutor. A student asked a question.
Read ALL the textbook sections below carefully and answer using ONLY their content.

TEXTBOOK SECTIONS (retrieved from tree traversal):
{context}

RECENT CONVERSATION:
{hist_text}

STUDENT QUESTION: {message}

INSTRUCTIONS:
1. Read every source above carefully — the answer may be spread across multiple sources
2. If ANY source contains relevant content, use it to answer fully and completely
3. Begin your answer with: "📚 From [exact section name] (page X–Y):"
4. Give the complete answer — include ALL definitions, ALL examples from the text
5. If multiple sources contribute, mention each one
6. ONLY if NONE of the sources contain ANYTHING relevant, write exactly on the first line:
   ##NOT_IN_TEXTBOOK##
   Then say what you couldn't find

Answer:"""

        print(f"[STAGE 7] Calling Gemini...")
        resp   = m.generate_content(prompt)
        answer = resp.text.strip()

        print(f"[STAGE 7] Gemini response length: {len(answer)} chars")
        print(f"[STAGE 7] Gemini response preview: '{answer[:200]}'")
        print(f"[STAGE 7] Contains ##NOT_IN_TEXTBOOK##: {'##NOT_IN_TEXTBOOK##' in answer}")

        # ── STAGE 8: Check result ─────────────────────────────────────────────
        if '##NOT_IN_TEXTBOOK##' not in answer:
            print(f"[STAGE 8] ✅ Answered from textbook")
            return jsonify({
                'success': True,
                'answer':  answer,
                'mode':    'chat',
                'source':  'local_tree',
                'source_detail': [{
                    'section':    c['section'],
                    'node_id':    c.get('node_id', ''),
                    'page_range': f"pages {c.get('start_index','?')}–{c.get('end_index','?')}",
                    'score':      round(top_scores[i], 2),
                    'depth':      c.get('depth', 0)
                } for i, c in enumerate(top_chunks)],
                'retrieved_chunks': [_chunk_summary(c) for c in top_chunks]
            })

        # ── STAGE 9: Transcript fallback ──────────────────────────────────────
        print(f"[STAGE 9] ⚠️  Textbook miss — falling back to transcript")

        json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
        print(f"[STAGE 9] Transcript path: {json_path}")
        print(f"[STAGE 9] Transcript exists: {os.path.exists(json_path)}")

        if not os.path.exists(json_path):
            print(f"[STAGE 9] ❌ No transcript either — returning not_found")
            return jsonify({
                'success': True,
                'answer':  "I searched all textbook sections but couldn't find this. No transcript is available either.",
                'source':  'not_found',
                'retrieved_chunks': [_chunk_summary(c) for c in top_chunks]
            })

        with open(json_path, 'r', encoding='utf-8') as f:
            td = json.load(f)
        segments = td.get('segments', [])
        print(f"[STAGE 9] Transcript segments loaded: {len(segments)}")

        tx_scored = []
        for i, seg in enumerate(segments):
            t_lower = seg.get('text', '').lower()
            sc = sum(1 for w in qw if w in t_lower)
            if sc > 0:
                tx_scored.append((sc, i, seg))
        tx_scored.sort(key=lambda x: x[0], reverse=True)

        tx_top = [seg for _, _, seg in tx_scored[:5]]
        print(f"[STAGE 9] Transcript segments matched: {len(tx_top)}")

        if not tx_top:
            mid    = len(segments) // 2
            tx_top = segments[max(0, mid - 2): mid + 3]
            print(f"[STAGE 9] No matches — using middle {len(tx_top)} segments as fallback")

        tx_context = '\n\n'.join(
            f"[Lecture at {seg.get('start_time','?')}]:\n{seg.get('text','')}"
            for seg in tx_top
        )

        tx_prompt = f"""You are an AI chemistry tutor. The textbook didn't cover this question directly.
Answer using the lecture transcript segments below.

LECTURE SEGMENTS:
{tx_context}

STUDENT QUESTION: {message}

Start with: "🎥 From the lecture (at [timestamp]):"
If the lecture also doesn't cover it, say so honestly."""

        print(f"[STAGE 9] Calling Gemini with transcript context...")
        tx_resp = m.generate_content(tx_prompt)
        print(f"[STAGE 9] Transcript answer preview: '{tx_resp.text.strip()[:150]}'")
        _track_chat_node_hits(video_id, data.get('studentEmail',''), top_chunks, message)

        return jsonify({
            'success': True,
            'answer':  tx_resp.text.strip(),
            'mode':    'chat',
            'source':  'transcript_fallback',
            'source_detail': [{'section': f"Lecture at {seg.get('start_time','?')}",
                                'start_seconds': float(seg.get('start', 0)),
                                'start_time': seg.get('start_time', '')} for seg in tx_top],
            'retrieved_chunks': [{'title': 'Lecture segment', 'section': f"Lecture at {seg.get('start_time','?')}",
                                   'text': seg.get('text','')[:300], 'source': 'transcript',
                                   'start_time': seg.get('start_time',''), 'page_range': '',
                                   'start_seconds': float(seg.get('start', 0))} for seg in tx_top]
        })

    except Exception as e:
        print(f"[PI-CHAT] ❌ EXCEPTION: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500
@app.route('/chat-with-transcript', methods=['POST'])
def chat_with_transcript():
    """Real timestamp chat — segments passed from frontend, no hallucination."""
    try:
        data = request.json or {}
        vid  = data.get('videoId','')
        txt  = data.get('transcript','')
        msg  = data.get('message','')
        hist = data.get('history',[])
        segs = data.get('segments',[])
        if not txt or not msg: return jsonify({'success':False,'error':'Missing fields'}),400

        seg_lines, seg_map = '', {}
        for i,seg in enumerate(segs[:120]):
            st = seg.get('start_time','0:00:00')
            t  = seg.get('text','').strip()
            seg_lines += f"[{i}] {st} — {t}\n"
            seg_map[str(i)] = {'start_time':st,'start_seconds':float(seg.get('start',0)),'text':t}
        if not seg_lines: seg_lines = txt[:4000]

        # Cross-reference tree if available
        tree_ctx = ''
        tree_chunks, _ = search_tree(vid, msg, top_k=2)
        if tree_chunks:
            tree_ctx = "\n\nTEXTBOOK CONTEXT:\n" + '\n'.join(f"[{c['section']}]: {c['text'][:300]}" for c in tree_chunks)

        hist_text = '\n'.join(f"{m['role'].upper()}: {m['content']}" for m in hist[-4:])
        m = get_gemini()
        prompt = f"""AI tutor. Answer using the lecture transcript below.
{tree_ctx}

TRANSCRIPT (format: [index] timestamp — text):
{seg_lines}

CONVERSATION: {hist_text}
QUESTION: {msg}

Return ONLY JSON: {{"answer":"...","segment_ids":[0,5],"confidence":"high"}}"""

        resp = m.generate_content(prompt)
        raw  = resp.text.strip().replace('```json','').replace('```','').strip()
        try: parsed = json.loads(raw)
        except: parsed = {"answer":raw,"segment_ids":[],"confidence":"low"}

        real_segs, real_ts = [], []
        for sid in parsed.get('segment_ids',[]):
            k = str(sid)
            if k in seg_map:
                real_ts.append(seg_map[k]['start_time'])
                real_segs.append({'start_time':seg_map[k]['start_time'],
                                   'start_seconds':seg_map[k]['start_seconds'],
                                   'text':seg_map[k]['text'][:150]})

        return jsonify({'success':True,'response':{'answer':parsed.get('answer',''),
                        'timestamps':real_ts,'segments':real_segs,'confidence':parsed.get('confidence','medium')}})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/save-replay-event', methods=['POST'])
def save_replay_event():
    """
    Called from frontend whenever student seeks backward (replay detected).
    Receives: email, videoId, fromSeconds, toSeconds (what they seeked back to)
    Maps the replayed timestamp → transcript segments → PI tree nodes
    Saves replay counts per node to data/replays/{email}_{videoId}.json
    """
    try:
        data        = request.json or {}
        email       = data.get('email', '')
        video_id    = data.get('videoId', '')
        from_sec    = float(data.get('fromSeconds', 0))   # where they were
        to_sec      = float(data.get('toSeconds', 0))     # where they seeked back to
        replay_range = abs(from_sec - to_sec)

        if not email or not video_id:
            return jsonify({'success': False, 'error': 'email and videoId required'}), 400

        # Only count as meaningful replay if they jumped back >10 seconds
        if replay_range < 2:
            return jsonify({'success': True, 'skipped': 'too short'})

        replay_start = min(from_sec, to_sec)
        replay_end   = max(from_sec, to_sec)

        # ── Step 1: Find transcript segments in this range ────────────────────
        json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")
        hit_segments = []
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                td = json.load(f)
            for seg in td.get('segments', []):
                seg_start = float(seg.get('start', 0))
                seg_end   = float(seg.get('end', seg_start + 5))
                # Segment overlaps with replay range
                if seg_start <= replay_end and seg_end >= replay_start:
                    hit_segments.append({
                        'id':         seg.get('id', 0),
                        'text':       seg.get('text', ''),
                        'start_time': seg.get('start_time', ''),
                        'start':      seg_start
                    })

        # ── Step 2: Map segments → PI tree nodes ──────────────────────────────
        hit_node_ids = set()
        hit_nodes    = {}

        tree = load_tree(video_id)
        if tree and hit_segments:
            all_chunks = flatten_tree(tree)
            # For each hit segment, find which tree node(s) overlap using keywords
            for seg in hit_segments:
                seg_words = get_query_terms(seg['text'])
                if not seg_words:
                    continue
                best_score = 0
                best_chunk = None
                for chunk in all_chunks:
                    if not chunk.get('text'):
                        continue
                    s = score_chunk(chunk, seg_words)
                    if s > best_score:
                        best_score = s
                        best_chunk = chunk
                if best_chunk and best_score >= 2.0:
                    nid = best_chunk['node_id']
                    hit_node_ids.add(nid)
                    hit_nodes[nid] = {
                        'node_id':   nid,
                        'title':     best_chunk['title'],
                        'section':   best_chunk['section'],
                        'page_range': f"pages {best_chunk.get('start_index','?')}–{best_chunk.get('end_index','?')}"
                    }

        # ── Step 3: Load existing replay data and update ──────────────────────
        replay_dir  = os.path.join(DATA_FOLDER, 'replays')
        os.makedirs(replay_dir, exist_ok=True)
        replay_file = os.path.join(replay_dir, f"{email.replace('@','_')}_{video_id}.json")

        if os.path.exists(replay_file):
            with open(replay_file, 'r', encoding='utf-8') as f:
                replay_data = json.load(f)
        else:
            replay_data = {
                'email':       email,
                'video_id':    video_id,
                'total_replays': 0,
                'nodes':       {},    # node_id → {count, title, section, page_range, flagged, flag_types}
                'segments':    {},    # segment_id → count
                'events':      []     # raw event log
            }

        replay_data['total_replays'] += 1

        # Update segment counts
        for seg in hit_segments:
            sid = str(seg['id'])
            replay_data['segments'][sid] = replay_data['segments'].get(sid, 0) + 1

        # Update node counts + auto-flag
        for nid, node_info in hit_nodes.items():
            if nid not in replay_data['nodes']:
                replay_data['nodes'][nid] = {
                    **node_info,
                    'count':      0,
                    'flagged':    False,
                    'flag_types': []
                }
            replay_data['nodes'][nid]['count'] += 1

            count = replay_data['nodes'][nid]['count']
            flags = []

            # Flag logic based on replay count
            if count >= 1:
                flags.append('flag2')   # High replay — engagement concern
            if count >= 2:
                flags.append('flag1')   # Low comprehension signal
            if count >= 3:
                flags.append('flag3')   # Persistent struggle

            replay_data['nodes'][nid]['flagged']    = len(flags) > 0
            replay_data['nodes'][nid]['flag_types'] = flags

        # Log the raw event
        replay_data['events'].append({
            'from':       from_sec,
            'to':         to_sec,
            'range':      replay_range,
            'timestamp':  datetime.now().isoformat(),
            'hit_nodes':  list(hit_node_ids),
            'segments':   len(hit_segments)
        })
        # Keep only last 200 events
        replay_data['events'] = replay_data['events'][-200:]
        replay_data['last_updated'] = datetime.now().isoformat()

        with open(replay_file, 'w', encoding='utf-8') as f:
            json.dump(replay_data, f, indent=2)

        print(f"[Replay] {email} | {video_id} | range={replay_range:.0f}s | nodes hit: {list(hit_node_ids)}")

        return jsonify({
            'success':       True,
            'hit_segments':  len(hit_segments),
            'hit_nodes':     len(hit_node_ids),
            'flagged_nodes': [n for n in replay_data['nodes'].values() if n['flagged']]
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/debug-inject-replay/<video_id>/<email>', methods=['POST'])
def debug_inject_replay(video_id, email):
    """
    Injects fake replay data so you can test the UI without actually replaying.
    POST body: optional {"node_ids": ["0003", "0004"]} to target specific nodes.
    If no node_ids given, picks first 3 nodes from tree.
    """
    try:
        tree = load_tree(video_id)
        if not tree:
            return jsonify({'success': False, 'error': f'No tree for {video_id}'}), 404

        all_chunks = flatten_tree(tree)
        # Use provided node_ids or default to first 3 content nodes
        data = request.json or {}
        target_ids = data.get('node_ids', [])

        if target_ids:
            target_chunks = [c for c in all_chunks if c['node_id'] in target_ids]
        else:
            target_chunks = [c for c in all_chunks if len(c.get('text','')) > 100][:3]

        replay_dir  = os.path.join(DATA_FOLDER, 'replays')
        os.makedirs(replay_dir, exist_ok=True)
        replay_file = os.path.join(replay_dir, f"{email.replace('@','_')}_{video_id}.json")

        # Load existing or create fresh
        if os.path.exists(replay_file):
            with open(replay_file, 'r', encoding='utf-8') as f:
                replay_data = json.load(f)
        else:
            replay_data = {
                'email': email, 'video_id': video_id,
                'total_replays': 0, 'nodes': {}, 'segments': {}, 'events': []
            }

        # Inject 3 replays for each target node
        for chunk in target_chunks:
            nid = chunk['node_id']
            if nid not in replay_data['nodes']:
                replay_data['nodes'][nid] = {
                    'node_id':   nid,
                    'title':     chunk['title'],
                    'section':   chunk['section'],
                    'page_range': f"pages {chunk.get('start_index','?')}–{chunk.get('end_index','?')}",
                    'count':     0,
                    'flagged':   False,
                    'flag_types': []
                }
            replay_data['nodes'][nid]['count'] += 3
            replay_data['total_replays'] += 3
            count = replay_data['nodes'][nid]['count']
            flags = []
            if count >= 1: flags.append('flag2')
            if count >= 2: flags.append('flag1')
            if count >= 3: flags.append('flag3')
            replay_data['nodes'][nid]['flagged']    = True
            replay_data['nodes'][nid]['flag_types'] = flags

        replay_data['last_updated'] = datetime.now().isoformat()
        replay_data['events'].append({
            'from': 120, 'to': 0, 'range': 120,
            'timestamp': datetime.now().isoformat(),
            'hit_nodes': [c['node_id'] for c in target_chunks],
            'debug_injected': True
        })

        with open(replay_file, 'w', encoding='utf-8') as f:
            json.dump(replay_data, f, indent=2)

        print(f"[Debug] Injected replay data for {email} | {video_id} | nodes: {[c['node_id'] for c in target_chunks]}")
        return jsonify({
            'success':   True,
            'injected':  [{'node_id': c['node_id'], 'title': c['title']} for c in target_chunks],
            'replay_file': replay_file
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/get-replay-analysis/<video_id>/<email>', methods=['GET'])
def get_replay_analysis(video_id, email):
    """
    Returns full replay analysis for a student+video.
    Used by teacher dashboard to show weak nodes.
    """
    try:
        replay_dir  = os.path.join(DATA_FOLDER, 'replays')
        replay_file = os.path.join(replay_dir, f"{email.replace('@','_')}_{video_id}.json")

        if not os.path.exists(replay_file):
            return jsonify({
                'success':      True,
                'found':        False,
                'total_replays': 0,
                'nodes':        [],
                'flagged_nodes': []
            })

        with open(replay_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        nodes_list = sorted(
            data.get('nodes', {}).values(),
            key=lambda n: n['count'],
            reverse=True
        )

        return jsonify({
            'success':      True,
            'found':        True,
            'email':        email,
            'video_id':     video_id,
            'total_replays': data.get('total_replays', 0),
            'last_updated': data.get('last_updated', ''),
            'nodes':        list(nodes_list),
            'flagged_nodes': [n for n in nodes_list if n.get('flagged')],
            'most_replayed': nodes_list[:3] if nodes_list else []
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/get-class-replay-analysis/<video_id>', methods=['GET'])
def get_class_replay_analysis(video_id):
    """
    Aggregates replay data across ALL students for a video.
    Shows teacher which PI tree nodes the whole class struggles with.
    """
    try:
        replay_dir = os.path.join(DATA_FOLDER, 'replays')
        if not os.path.exists(replay_dir):
            return jsonify({'success': True, 'nodes': [], 'total_students': 0})

        # Aggregate all replay files for this video
        node_aggregate = {}   # node_id → {title, section, page_range, total_replays, students: set}

        student_count = 0
        for fname in os.listdir(replay_dir):
            if not fname.endswith(f'_{video_id}.json'):
                continue
            student_count += 1
            with open(os.path.join(replay_dir, fname), 'r', encoding='utf-8') as f:
                data = json.load(f)

            student_email = data.get('email', fname)
            for nid, node in data.get('nodes', {}).items():
                if nid not in node_aggregate:
                    node_aggregate[nid] = {
                        'node_id':    nid,
                        'title':      node.get('title', ''),
                        'section':    node.get('section', ''),
                        'page_range': node.get('page_range', ''),
                        'total_replays': 0,
                        'students_replayed': 0,
                        'student_list': []
                    }
                node_aggregate[nid]['total_replays']    += node.get('count', 0)
                node_aggregate[nid]['students_replayed'] += 1
                node_aggregate[nid]['student_list'].append(student_email)

        # Sort by number of students who replayed
        sorted_nodes = sorted(
            node_aggregate.values(),
            key=lambda n: (n['students_replayed'], n['total_replays']),
            reverse=True
        )

        return jsonify({
            'success':       True,
            'video_id':      video_id,
            'total_students': student_count,
            'nodes':         sorted_nodes,
            'hot_spots':     sorted_nodes[:5],   # top 5 most-replayed sections
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/explain-missed-concept', methods=['POST'])
def explain_missed_concept():
    """
    RAG concept explanation pipeline after a wrong answer:
    1. Search LOCAL TREE (textbook) first — most authoritative
       → returns section name + page range
    2. If tree score too low → fall back to transcript keyword search
    3. Gemini explains using only the retrieved content
    """
    try:
        data           = request.json or {}
        video_id       = data.get('videoId', '')
        question_text  = data.get('questionText', '')
        correct_answer = data.get('correctAnswer', '')
        student_answer = data.get('studentAnswer', '')
        bloom_level    = int(data.get('bloomLevel', 2))

        if not question_text:
            return jsonify({'success': False, 'error': 'questionText required'}), 400

        query = f"{question_text} {correct_answer}"
        qw    = get_query_terms(query)

        # ── Step 1: Search local tree (textbook) ──────────────────────────────
        tree_chunks, retrieval_source = search_tree(video_id, query, top_k=3)

        # ── Step 2: Search transcript as secondary source ─────────────────────
        tx_chunks = []
        json_path = os.path.join(TRANSCRIPTS_FOLDER, f"{video_id}.json")

        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                td = json.load(f)

            # FIX: use (score, index, seg) tuple so dicts are never compared
            tx_scored = []
            for i, seg in enumerate(td.get('segments', [])):
                t_lower = seg['text'].lower()
                sc = sum(1 for w in qw if w in t_lower)
                if sc > 0:
                    tx_scored.append((sc, i, seg))   # index i prevents dict comparison

            tx_scored.sort(key=lambda x: x[0], reverse=True)

            # Unpack with _ for the index — never touch the dicts for comparison
            for sc, _, seg in tx_scored[:2]:
                tx_chunks.append({
                    'text':          seg['text'],
                    'score':         round(sc / max(len(qw), 1), 2),
                    'source':        'transcript',
                    'start_time':    seg.get('start_time', '0:00:00'),
                    'start_seconds': float(seg.get('start', 0)),
                    'section':       f"Lecture at {seg.get('start_time', '0:00:00')}"
                })

        # ── Step 3: Build combined retrieved chunks list ───────────────────────
        # Tree chunks first (textbook is more authoritative)
        all_retrieved = []

        for c in tree_chunks:
            all_retrieved.append({
                'text':          c['text'][:600],
                'score':         round(score_chunk(c, qw), 2),
                'source':        'local_tree',
                'section':       c['section'],
                'node_id':       c['node_id'],
                'title':         c['title'],
                'depth':         c['depth'],
                'page_range':    f"pages {c.get('start_index', '?')}–{c.get('end_index', '?')}",
                'start_time':    '',
                'start_seconds': 0
            })

        all_retrieved.extend(tx_chunks)

        # ── Step 4: Absolute fallback — middle of transcript ──────────────────
        if not all_retrieved:
            retrieval_source = 'fallback'
            if os.path.exists(json_path):
                segs = td.get('segments', [])
                mid  = len(segs) // 2
                for seg in segs[max(0, mid - 2): mid + 3]:
                    all_retrieved.append({
                        'text':          seg['text'],
                        'score':         0.1,
                        'source':        'fallback',
                        'section':       f"Lecture at {seg.get('start_time', '0:00:00')}",
                        'start_time':    seg.get('start_time', '0:00:00'),
                        'start_seconds': float(seg.get('start', 0))
                    })

        # ── Step 5: Build Gemini prompt ────────────────────────────────────────
        bloom_instruction = {
            1: "Give a simple definition the student can memorize.",
            2: "Explain what it means and why it matters — help them understand, not just recall.",
            3: "Explain AND give a concrete real-life example of how it applies.",
            4: "Explain the concept and the reasoning behind why it works the way it does."
        }.get(bloom_level, "Explain it clearly and simply.")

        # Format context with attribution
        context_parts = []
        for c in all_retrieved:
            if c['source'] == 'local_tree':
                header = f"[TEXTBOOK — {c['section']} | {c.get('page_range', '')}]"
            else:
                header = f"[LECTURE — {c.get('section', c.get('start_time', '?'))}]"
            context_parts.append(f"{header}\n{c['text']}")

        chunks_text = '\n\n'.join(context_parts)

        m      = get_gemini()
        prompt = f"""A student answered a quiz question incorrectly. Explain the correct concept using ONLY the content below.

QUESTION THE STUDENT GOT WRONG:
{question_text}

CORRECT ANSWER:
{correct_answer}

STUDENT'S WRONG ANSWER:
{student_answer}

RETRIEVED CONTENT (textbook + lecture):
{chunks_text}

TASK: {bloom_instruction}

RULES:
- Use ONLY the content above — no outside knowledge
- If the answer comes from the textbook, start with: "This is covered in [Section Name] (page X) — here's what it says:"
- If from the lecture, start with: "Your teacher explained this at [timestamp] — here's what was said:"
- Give a simple explanation (3–5 sentences max)
- End with: "The key point to remember: [one sentence]"
- Be warm and encouraging — never condescending

Return ONLY valid JSON, no markdown fences:
{{
  "explanation": "Full explanation here",
  "key_takeaway": "One sentence the student should remember",
  "source_section": "Exact section name or lecture timestamp where this was found",
  "source_type": "textbook or lecture",
  "source_snippet": "Exact phrase from the content this explanation is based on (max 20 words)"
}}"""

        resp = m.generate_content(prompt)
        raw  = resp.text.strip().replace('```json', '').replace('```', '').strip()

        try:
            result = json.loads(raw)
        except Exception:
            # If JSON parse fails, wrap the raw text
            result = {
                "explanation":    raw,
                "key_takeaway":   "",
                "source_section": all_retrieved[0].get('section', '') if all_retrieved else '',
                "source_type":    all_retrieved[0].get('source', '') if all_retrieved else '',
                "source_snippet": ""
            }

        return jsonify({
            'success':          True,
            'explanation':      result,
            'retrieved_chunks': all_retrieved,
            'retrieval_source': retrieval_source,
            'concept':          question_text[:80]
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500
    
@app.route('/generate-summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json or {}
        txt  = data.get('transcript','')
        vid  = data.get('videoId','')
        if not txt: return jsonify({'success':False,'error':'No transcript'}),400
        tree_ctx = ''
        tree = load_tree(vid)
        if tree:
            secs = [c for c in flatten_tree(tree) if c['depth']==1][:6]
            tree_ctx = '\n\nCHAPTER SECTIONS:\n' + '\n'.join(f"• {s['title']}" for s in secs)
        m = get_gemini()
        resp = m.generate_content(f"""Create a structured lecture summary.
TRANSCRIPT: {txt[:5000]}{tree_ctx}

Return ONLY valid HTML for innerHTML:
1. Overview (2-3 sentences)
2. Key Concepts (3-5 bullet points)  
3. Important Topics (with subheadings)
4. SVG Diagram (400-500px, blues/purples/greens, show concept relationships)
5. Key Takeaways (3-4 points)
Use <h3>,<h4>,<p>,<ul>,<li>,<strong> with inline CSS. No markdown.""")
        html = resp.text.replace('```html','').replace('```','').strip()
        return jsonify({'success':True,'summary':{'html':html,'videoId':vid}})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/generate-concepts', methods=['POST'])
def generate_concepts():
    try:
        data = request.json or {}
        txt  = data.get('transcript','')
        vid  = data.get('videoId','')
        if not txt: return jsonify({'success':False,'error':'No transcript'}),400
        tree_hint = ''
        tree = load_tree(vid)
        if tree:
            secs = [c for c in flatten_tree(tree) if c['depth']==1]
            tree_hint = '\nKEY SECTIONS: ' + ', '.join(s['title'] for s in secs[:6])
        m = get_gemini()
        resp = m.generate_content(f"""Extract key concepts from this lecture.{tree_hint}
TRANSCRIPT: {txt[:5000]}
Return ONLY JSON array:
[{{"title":"Concept","description":"2-3 sentences","timestamp":"0:05:30","importance":"high"}}]""")
        text = resp.text.strip().replace('```json','').replace('```','').strip()
        try: concepts = json.loads(text)
        except: concepts = []
        return jsonify({'success':True,'concepts':concepts})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}),500

@app.route('/generate-practice', methods=['POST'])
def generate_practice():
    try:
        txt = (request.json or {}).get('transcript','')
        if not txt: return jsonify({'success':False,'error':'No transcript'}),400
        m = get_gemini()
        resp = m.generate_content(f"""Create 5 practice questions (2 fill-blank, 2 MCQ, 1 short-answer).
TRANSCRIPT: {txt[:5000]}
Return ONLY JSON:
[{{"id":1,"type":"fill-blank","question":"___ is...","answer":"ans","hint":"hint"}},
 {{"id":2,"type":"mcq","question":"What is...","options":["A","B","C","D"],"correctAnswer":1,"explanation":"..."}},
 {{"id":3,"type":"short-answer","question":"Explain...","keywords":["a"],"sampleAnswer":"..."}}]""")
        text = resp.text.strip().replace('```json','').replace('```','').strip()
        try: q = json.loads(text)
        except: q = []
        return jsonify({'success':True,'questions':q})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}),500

@app.route('/generate-flashcards', methods=['POST'])
def generate_flashcards():
    try:
        data = request.json or {}
        txt  = data.get('transcript','')
        vid  = data.get('videoId','')
        if not txt: return jsonify({'success':False,'error':'No transcript'}),400
        # Enrich with definitions from tree
        tree_defs = ''
        chunks, _ = search_tree(vid, 'definition terms', top_k=2)
        if chunks: tree_defs = '\nKEY DEFINITIONS:\n' + '\n'.join(c['text'][:300] for c in chunks)
        m = get_gemini()
        resp = m.generate_content(f"""Create 10 flashcard Q&A pairs.{tree_defs}
TRANSCRIPT: {txt[:5000]}
Return ONLY JSON: [{{"question":"...","answer":"...","explanation":"..."}}]""")
        text = resp.text.strip().replace('```json','').replace('```','').strip()
        try: cards = json.loads(text)
        except: cards = []
        return jsonify({'success':True,'flashcards':cards})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}),500

@app.route('/generate-revision-test', methods=['POST'])
def generate_revision_test():
    """
    Generates personalized revision content using:
    1. Weak nodes from replay/chat tracking (PI tree sections student struggled with)
    2. Falls back to weak areas list if no node data
    3. Gemini gets the actual textbook content from those nodes → hyper-targeted questions
    """
    try:
        data            = request.json or {}
        txt             = data.get('transcript', '')
        weak_areas      = data.get('weakAreas', [])
        video_id        = data.get('videoId', '')
        email           = data.get('studentEmail', '')
        generate_notes  = data.get('generateNotes', False)

        if not txt:
            return jsonify({'success': False, 'error': 'No transcript'}), 400

        # ── Step 1: Load weak nodes from replay/chat tracking ─────────────────
        weak_node_content = ''
        weak_node_titles  = []
        node_context_used = False

        if video_id and email:
            replay_dir  = os.path.join(DATA_FOLDER, 'replays')
            replay_file = os.path.join(replay_dir, f"{email.replace('@','_')}_{video_id}.json")

            if os.path.exists(replay_file):
                with open(replay_file, 'r', encoding='utf-8') as f:
                    rd = json.load(f)

                # Get flagged nodes sorted by replay count + chat hits
                flagged = [n for n in rd.get('nodes', {}).values() if n.get('flagged')]
                flagged.sort(
                    key=lambda n: n.get('count', 0) + n.get('chat_hits', 0) * 2,
                    reverse=True
                )

                if flagged:
                    # Load the actual textbook content for these nodes
                    tree = load_tree(video_id)
                    if tree:
                        all_chunks = flatten_tree(tree)
                        chunk_map  = {c['node_id']: c for c in all_chunks}

                        node_texts = []
                        for node in flagged[:4]:   # top 4 weakest nodes
                            nid = node['node_id']
                            weak_node_titles.append(node['title'])
                            if nid in chunk_map:
                                chunk = chunk_map[nid]
                                source_label = []
                                if node.get('count', 0) > 0:
                                    source_label.append(f"replayed {node['count']}x")
                                if node.get('chat_hits', 0) > 0:
                                    source_label.append(f"asked about {node['chat_hits']}x in chat")
                                node_texts.append(
                                    f"[WEAK SECTION: {chunk['section']} | {', '.join(source_label)}]\n"
                                    f"{chunk.get('text', '')[:800]}"
                                )

                        if node_texts:
                            weak_node_content = '\n\n'.join(node_texts)
                            node_context_used = True
                            print(f"[Revision] Using {len(node_texts)} weak nodes for {email}: {weak_node_titles}")

        # ── Step 2: Build Gemini prompt ───────────────────────────────────────
        m = get_gemini()

        if node_context_used:
            # PERSONALIZED: use actual weak node content
            context_section = f"""
STUDENT'S WEAK SECTIONS (from replay + chat analysis):
These are the specific parts of the textbook this student replayed or asked about repeatedly.
Generate questions ONLY from these sections.

{weak_node_content}
"""
            personalization_note = (
                f"This student specifically struggled with: {', '.join(weak_node_titles)}. "
                f"Every question must test one of these exact sections."
            )
        else:
            # Fallback: use weak areas + transcript
            context_section = f"LECTURE TRANSCRIPT:\n{txt[:4000]}"
            personalization_note = (
                f"Focus on: {', '.join(weak_areas)}" if weak_areas else "General revision."
            )

        # ── Step 3: Generate questions ────────────────────────────────────────
        q_prompt = f"""Generate a personalized 5-question revision test.

{context_section}

{personalization_note}

Rules:
- 3 MCQ (4 options each) + 2 fill-in-the-blank
- Each question must cite which section it comes from in the explanation
- Questions must be answerable ONLY from the content provided above
- Difficulty should be slightly higher than basic recall

Return ONLY valid JSON array:
[
  {{
    "id": 1,
    "type": "mcq",
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "From [Section Name]: ...",
    "weak_node": "{weak_node_titles[0] if weak_node_titles else 'general'}"
  }},
  {{
    "id": 2,
    "type": "fill-blank",
    "question": "___ is defined as ...",
    "answer": "answer",
    "explanation": "From [Section Name]: ...",
    "weak_node": "section name"
  }}
]"""

        resp = m.generate_content(q_prompt)
        text = resp.text.strip().replace('```json','').replace('```','').strip()
        try:
            questions = json.loads(text)
        except Exception:
            questions = []

        # ── Step 4: Generate personalized notes (optional) ────────────────────
        personalized_note = None
        if generate_notes and node_context_used:
            note_prompt = f"""Write a personalized revision note for a student who struggled with these textbook sections.

SECTIONS THE STUDENT FOUND DIFFICULT:
{weak_node_content}

Write a clear, friendly revision note that:
1. Acknowledges they found these sections hard (warmly, not condescendingly)
2. Re-explains each weak section in simpler language
3. Gives one memorable tip or trick for each concept
4. Ends with encouragement

Format as readable paragraphs with clear section headers.
Max 400 words."""

            note_resp = m.generate_content(note_prompt)
            personalized_note = note_resp.text.strip()

        return jsonify({
            'success':           True,
            'questions':         questions,
            'personalized':      node_context_used,
            'weak_nodes_used':   weak_node_titles,
            'personalized_note': personalized_note,
            'node_count':        len(weak_node_titles)
        })

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500
@app.route('/evaluate-answer', methods=['POST'])
def evaluate_answer():
    try:
        data = request.json or {}
        q,ua,ca,qt = data.get('question',''),data.get('userAnswer',''),data.get('correctAnswer',''),data.get('type','')
        if qt in ['fill-blank','mcq']:
            ok = str(ua).strip().lower()==str(ca).strip().lower()
            return jsonify({'success':True,'isCorrect':ok,'feedback':'Correct!' if ok else f'Correct answer: {ca}'})
        m = get_gemini()
        resp = m.generate_content(f"Evaluate: QUESTION:{q} EXPECTED:{ca} STUDENT:{ua}\nReturn ONLY JSON: {{\"isCorrect\":true,\"score\":8,\"feedback\":\"...\"}}")
        text = resp.text.strip().replace('```json','').replace('```','').strip()
        try: ev = json.loads(text)
        except: ev = {"isCorrect":False,"score":0,"feedback":"Could not evaluate"}
        return jsonify({'success':True,**ev})
    except Exception as e:
        return jsonify({'success':False,'error':str(e)}),500

@app.route('/generate-blooms-questions', methods=['POST'])
def generate_blooms_questions():
    try:
        data  = request.json or {}
        txt   = data.get('transcript','')
        bl    = int(data.get('bloomLevel',2))
        num   = int(data.get('numQuestions',3))
        cp    = data.get('checkpoint','alpha')
        vid   = data.get('videoId','')
        if not txt: return jsonify({'success':False,'error':'No transcript'}),400
        bd = {1:"recall facts/definitions (Remember)",2:"explain concepts (Understand)",
              3:"apply to new scenarios (Apply)",4:"analyze relationships (Analyze)"}.get(bl,"understand")
        tree_ctx = ''
        chunks, _ = search_tree(vid, txt[:100], top_k=2)
        if chunks: tree_ctx = '\nTEXTBOOK:\n' + '\n'.join(f"[{c['title']}]: {c['text'][:250]}" for c in chunks)
        m = get_gemini()
        resp = m.generate_content(f"""Generate exactly {num} MCQ at Bloom's L{bl} ({bd}).
{tree_ctx}
LECTURE: {txt[:3000]}
Return ONLY JSON:
{{"questions":[{{"id":"cp_{cp}_1","question":"...","options":["A","B","C","D"],"correctAnswer":0,"bloomLevel":{bl},"explanation":"..."}}]}}""")
        raw = resp.text.strip().replace('```json','').replace('```','').strip()
        try: result = json.loads(raw)
        except: return jsonify({'success':False,'error':'Parse failed','raw':raw[:300]}),500
        return jsonify({'success':True,'questions':result.get('questions',[]),'bloomLevel':bl,'checkpoint':cp})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/analyze-student-multidim', methods=['POST'])
def analyze_student_multidim():
    try:
        data = request.json or {}
        email = data.get('studentEmail','')
        pct   = float(data.get('completionPct',0))
        rep   = int(data.get('replayCount',0))
        cps   = data.get('checkpointAttempts',[])
        sess  = data.get('sessionHistory',[])
        cavg  = data.get('classAvg',{'score':65,'timeTaken':120,'replayCount':2})
        sh = [a.get('score',0) for a in cps]; th = [a.get('timeTaken',0) for a in cps]
        vel = (sh[-1]-sh[0]) if len(sh)>=2 else 0
        bd  = {a.get('checkpoint','?'):{'score':a.get('score',0),'bloomLevel':a.get('bloomLevel',1)} for a in cps}
        m = get_gemini()
        resp = m.generate_content(f"""Analyze student learning profile (Cognitive Load Theory + Metacognition).
Completion:{pct:.0f}% Replays:{rep}(avg:{cavg.get('replayCount',2)}) Scores:{sh} Velocity:{vel:+.0f}pts
Bloom:{json.dumps(bd)} Sessions:{len(sess[-20:])}

Return ONLY JSON:
{{"dimensions":{{"content_mastery":{{"score":75,"label":"Adequate","insight":"..."}},"engagement_depth":{{"score":60,"label":"Passive","insight":"..."}},"metacognitive_calibration":{{"score":50,"label":"Overconfident","insight":"..."}},"knowledge_retention":{{"score":70,"label":"Retaining","insight":"..."}},"learning_velocity":{{"score":65,"label":"Stable","insight":"..."}},"cognitive_load":{{"score":40,"label":"Overloaded","insight":"..."}}}},"primary_weakness":"cognitive_load","recommended_intervention":"...","student_message":"..."}}""")
        raw = resp.text.strip().replace('```json','').replace('```','').strip()
        try: result = json.loads(raw)
        except: result = {"error":"Parse failed","raw":raw[:200]}
        return jsonify({'success':True,'analysis':result,'studentEmail':email})
    except Exception as e:
        print(traceback.format_exc()); return jsonify({'success':False,'error':str(e)}),500

@app.route('/get-all-student-flags')
def get_all_student_flags():
    return jsonify({'success':True,'message':'Flags stored client-side'})

if __name__ == '__main__':
    print(f"\n{'='*50}\n  Paathshala — http://localhost:5000\n  Trees: {os.path.abspath(TREES_FOLDER)}\n{'='*50}\n")
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)