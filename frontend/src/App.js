import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, MessageSquare, FileText, HelpCircle, Users, MessageCircle, Lightbulb, Play, Volume2, Maximize, Bookmark, ChevronLeft, ChevronRight, Search, Filter, LogOut } from 'lucide-react';
import { Upload, Video, CheckCircle, XCircle, Loader, Download,Zap } from 'lucide-react';
import { Bell, Shield, AlertTriangle, Brain } from "lucide-react";
import { 
   Check, X, ChevronDown, ChevronUp, 
  AlertCircle, RefreshCw, Sparkles, TrendingUp, Award
} from 'lucide-react';


  const API_BASE = 'http://localhost:5000';

  // Place this OUTSIDE all components, near the top of App.js
const notifyTeacher = (studentEmail, videoId, checkpoint, score, violations, bloomLevel) => {
  const stored = JSON.parse(localStorage.getItem('teacher_notifications') || '[]');
  stored.unshift({
    id:           `${studentEmail}_${videoId}_${checkpoint}_${Date.now()}`,
    type:         violations > 0 ? 'flagged' : 'completed',
    studentEmail, videoId, checkpoint, score, violations, bloomLevel,
    timestamp:    new Date().toISOString(),
    read:         false,
    message:      violations > 0
      ? `⚠️ ${studentEmail} was flagged during ${checkpoint} checkpoint — ${violations} violation(s), score: ${score}%`
      : `✅ ${studentEmail} completed ${checkpoint} checkpoint — score: ${score}%`
  });
  localStorage.setItem('teacher_notifications', JSON.stringify(stored.slice(0, 100)));
};

// ==================== AUTH COMPONENTS ====================
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');



 const credentials = {
  teacher: {
    email: 'teacher@paathshala.com',
    password: 'teacher123'
  },
  student1: { email: 'student1@paathshala.com', password: 'student123' },
  student2: { email: 'student2@paathshala.com', password: 'student123' },
  student3: { email: 'student3@paathshala.com', password: 'student123' },
  student4: { email: 'student4@paathshala.com', password: 'student123' },
  student5: { email: 'student5@paathshala.com', password: 'student123' },
  student6: { email: 'student6@paathshala.com', password: 'student123' },
  student7: { email: 'student7@paathshala.com', password: 'student123' },
  student8: { email: 'student8@paathshala.com', password: 'student123' },
  student9: { email: 'student9@paathshala.com', password: 'student123' },
  student10: { email: 'student10@paathshala.com', password: 'student123' }
};
  const handleLogin = (e) => {
  e.preventDefault();
  setError('');

  if (email === credentials.teacher.email && password === credentials.teacher.password) {
    onLogin('teacher', 'teacher@paathshala.com');
  } else {
    const studentMatch = Object.keys(credentials).find(key => 
      key.startsWith('student') && 
      credentials[key].email === email && 
      credentials[key].password === password
    );
    
    if (studentMatch) {
      onLogin('student', email);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          PaathShala<span className="text-red-500">.</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">Your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="name@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-700 mb-2">Your password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            SIGN IN
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
  <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
  <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
    <p><span className="font-medium">Teacher:</span> teacher@paathshala.com / teacher123</p>
    <p><span className="font-medium">Students:</span> student1@paathshala.com to student10@paathshala.com / student123</p>
  </div>
</div>
      </div>

      <div className="mt-8 flex items-center gap-4 text-sm text-gray-600">
        <a href="#" className="hover:text-blue-600">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-blue-600">Terms and Conditions</a>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        © 2025 by PaathShala
      </div>
    </div>
  );
};
// ==================== FLAG SYSTEM HELPERS ====================

const computeStudentFlags = (userEmail, videoId) => {
  try {
    const allKeys = Object.keys(localStorage);

    // --- Gather raw data ---
    const progressKey = `progress_${userEmail}_${videoId}`;
    const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}');
    const completionPct = progressData.progress || 0;

    // All checkpoint attempts for this student + video
    const checkpointAttempts = allKeys
      .filter(k => k.startsWith(`cp_attempt_${userEmail}_${videoId}_`))
      .map(k => JSON.parse(localStorage.getItem(k)));

    // Replay events
    const replayKey = `replays_${userEmail}_${videoId}`;
    const replayData = JSON.parse(localStorage.getItem(replayKey) || '{"totalReplays":0,"segments":{}}');

    // Session history (for dropout flag)
    const sessionKey = `sessions_${userEmail}`;
    const sessions = JSON.parse(localStorage.getItem(sessionKey) || '[]');

    // Class averages (read from localStorage, set by teacher's view aggregation)
    const classAvgKey = `class_avg_${videoId}`;
    const classAvg = JSON.parse(localStorage.getItem(classAvgKey) || '{"score":65,"timeTaken":120,"replayCount":2}');

    // --- Flag 1: Content Gap ---
    // Trigger: avg score < 60% AND L1+L2 failure rate > 50% across 2+ checkpoints
    const flag1 = (() => {
      if (checkpointAttempts.length < 2) return false;
      const avgScore = checkpointAttempts.reduce((s, a) => s + (a.score || 0), 0) / checkpointAttempts.length;
      const l1l2Failures = checkpointAttempts.filter(a => a.bloomL1Score < 0.5 || a.bloomL2Score < 0.5).length;
      return avgScore < 60 && (l1l2Failures / checkpointAttempts.length) > 0.5;
    })();

    // --- Flag 2: Passive Watcher ---
    // Trigger: completion > 85% but latest checkpoint score < 55%
    const flag2 = (() => {
      if (checkpointAttempts.length === 0) return false;
      const latestAttempt = checkpointAttempts[checkpointAttempts.length - 1];
      return completionPct > 85 && (latestAttempt?.score || 0) < 55;
    })();

    // --- Flag 3: Cognitive Overload ---
    // Trigger: replay count > 2x class avg AND time on test > 2x class avg AND score < 55%
    const flag3 = (() => {
      if (checkpointAttempts.length === 0) return false;
      const latestAttempt = checkpointAttempts[checkpointAttempts.length - 1];
      const highReplays = replayData.totalReplays > classAvg.replayCount * 2;
      const slowTest = (latestAttempt?.timeTaken || 0) > classAvg.timeTaken * 2;
      const lowScore = (latestAttempt?.score || 0) < 55;
      return highReplays && slowTest && lowScore;
    })();

    // --- Flag 4: Metacognitive Gap ---
    // Trigger: first attempt time < 50% of class avg (rushed) AND score < 60% AND retry score > 75%
    const flag4 = (() => {
      const firstAttempt = checkpointAttempts[0];
      const laterAttempts = checkpointAttempts.slice(1);
      if (!firstAttempt || laterAttempts.length === 0) return false;
      const rushedTest = (firstAttempt.timeTaken || 999) < classAvg.timeTaken * 0.5;
      const badFirst = firstAttempt.score < 60;
      const goodLater = laterAttempts.some(a => a.score > 75);
      return rushedTest && badFirst && goodLater;
    })();

    // --- Flag 5: Dropout Risk ---
    // Trigger: session frequency dropped 40%+ in last 7 days, or no activity for 5+ days
    const flag5 = (() => {
      if (sessions.length < 4) return false;
      const now = Date.now();
      const last7days = sessions.filter(s => now - new Date(s.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000).length;
      const prev7days = sessions.filter(s => {
        const age = now - new Date(s.timestamp).getTime();
        return age >= 7 * 24 * 60 * 60 * 1000 && age < 14 * 24 * 60 * 60 * 1000;
      }).length;
      const lastSession = sessions[sessions.length - 1];
      const daysSinceLastSession = lastSession ? (now - new Date(lastSession.timestamp).getTime()) / (24 * 60 * 60 * 1000) : 999;
      const frequencyDrop = prev7days > 0 && last7days < prev7days * 0.6;
      return frequencyDrop || daysSinceLastSession >= 5;
    })();

    const flags = { flag1, flag2, flag3, flag4, flag5, computedAt: new Date().toISOString() };

    // Save flags to localStorage so teacher dashboard can read them
    localStorage.setItem(`flags_${userEmail}_${videoId}`, JSON.stringify(flags));

    // Also update the student's overall flag summary (union of all video flags)
    const summaryKey = `flags_summary_${userEmail}`;
    const existing = JSON.parse(localStorage.getItem(summaryKey) || '{}');
    existing[videoId] = flags;
    localStorage.setItem(summaryKey, JSON.stringify(existing));

    return flags;
  } catch (err) {
    console.error('Flag computation error:', err);
    return { flag1: false, flag2: false, flag3: false, flag4: false, flag5: false };
  }
};

const recordSession = (userEmail) => {
  const key = `sessions_${userEmail}`;
  const sessions = JSON.parse(localStorage.getItem(key) || '[]');
  sessions.push({ timestamp: new Date().toISOString() });
  // Keep last 60 sessions only
  if (sessions.length > 60) sessions.splice(0, sessions.length - 60);
  localStorage.setItem(key, JSON.stringify(sessions));
};

const FLAG_META = {
  flag1: { label: 'Content Gap',        color: 'bg-red-100 text-red-700 border-red-300',    dot: 'bg-red-500'    },
  flag2: { label: 'Passive Watcher',    color: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500' },
  flag3: { label: 'Overloaded',         color: 'bg-purple-100 text-purple-700 border-purple-300', dot: 'bg-purple-500' },
  flag4: { label: 'Metacog. Gap',       color: 'bg-teal-100 text-teal-700 border-teal-300',  dot: 'bg-teal-500'   },
  flag5: { label: 'Dropout Risk',       color: 'bg-blue-100 text-blue-700 border-blue-300',  dot: 'bg-blue-500'   },
};
const SummaryContent = ({ transcript, videoId }) => {
  const [summary, setSummary] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load cached summary if exists
  useEffect(() => {
    const cacheKey = `lecture_${videoId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.summary) {
        console.log('Loaded summary from localStorage');
        setSummary(data.summary);
      }
    }
  }, [videoId]);

  const generateSummary = async () => {
    if (!transcript) return;
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          transcript: transcript.segments.map(s => s.text).join(' ')
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);

        // ✅ Save to localStorage
        const cacheKey = `lecture_${videoId}`;
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        localStorage.setItem(cacheKey, JSON.stringify({
          ...cached,
          summary: data.summary,
          cachedAt: new Date().toISOString()
        }));
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      console.error('Summary generation error:', err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Lecture Summary</h3>
        {summary && <span className="text-xs text-green-600">Loaded from cache</span>}
        <button
          onClick={generateSummary}
          disabled={generating || !transcript}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            generating || !transcript
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
          }`}
        >
          {generating ? (
            <>
              <Loader className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb size={18} />
              Generate AI Summary
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      )}

      {summary ? (
        <div
          className="prose max-w-none bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200"
          dangerouslySetInnerHTML={{ __html: summary.html }}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Lightbulb size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">No summary generated yet</p>
          <p className="text-sm text-gray-500">Click "Generate AI Summary" to create one</p>
        </div>
      )}
    </div>
  );
};

// ==================== TEACHER UPLOAD COMPONENT ====================
const TeacherUploadView = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [subject, setSubject] = useState('Physics');
  const [customSubject, setCustomSubject] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [transcriptionResult, setTranscriptionResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setUploadStatus(null);
      setTranscriptionResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadStatus({ type: 'processing', message: 'Uploading video...' });
    
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('category', category);
    formData.append('subject', subject === 'Custom' ? customSubject : subject);
    formData.append('scheduledDate', scheduledDate);
    
    try {
      const response = await fetch(`${API_BASE}/upload-video`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUploadStatus({ 
          type: 'success', 
          message: 'Video uploaded and transcribed successfully!' 
        });
        setTranscriptionResult(data);
        
        setTimeout(() => {
          setVideoFile(null);
          setVideoTitle('');
          setVideoDescription('');
          setCustomSubject('');
          setScheduledDate('');
        }, 2000);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: `Upload failed: ${error.message}. Make sure Python server is running!` 
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTranscript = (format) => {
    if (!transcriptionResult) return;
    
    const transcriptPath = transcriptionResult.transcriptPaths[format];
    const videoId = transcriptionResult.transcriptionId;
    
    alert(`Transcript saved at: ${transcriptPath}\n\nAccess it at:\nhttp://localhost:5000/transcripts/${videoId}.${format}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Video className="text-blue-600" size={40} />
            Upload Lecture Video
          </h1>
          <p className="text-gray-600">Share your knowledge with automatic transcription</p>
        </div>

        {uploadStatus && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus.type === 'success' ? 'bg-green-50 border border-green-200' :
            uploadStatus.type === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-blue-50 border border-blue-200'
          }`}>
            {uploadStatus.type === 'success' && <CheckCircle className="text-green-600" size={24} />}
            {uploadStatus.type === 'error' && <XCircle className="text-red-600" size={24} />}
            {uploadStatus.type === 'processing' && <Loader className="text-blue-600 animate-spin" size={24} />}
            <p className={`font-medium ${
              uploadStatus.type === 'success' ? 'text-green-800' :
              uploadStatus.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {uploadStatus.message}
            </p>
          </div>
        )}

        {transcriptionResult && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" />
              Transcription Complete!
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Video ID</p>
                  <p className="font-mono text-sm font-medium text-gray-900">{transcriptionResult.transcriptionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{transcriptionResult.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="font-medium text-gray-900">{transcriptionResult.language.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Segments</p>
                  <p className="font-medium text-gray-900">{transcriptionResult.segments_count}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-3">Download Transcripts:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => downloadTranscript('json')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    JSON
                  </button>
                  <button
                    onClick={() => downloadTranscript('txt')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    TXT
                  </button>
                  <button
                    onClick={() => downloadTranscript('srt')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    SRT
                  </button>
                  <button
                    onClick={() => downloadTranscript('vtt')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                  >
                    <Download size={16} />
                    VTT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Video File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors bg-gray-50">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer">
                  {videoFile ? (
                    <div className="space-y-3">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                      <p className="text-sm font-medium text-gray-900">{videoFile.name}</p>
                      <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setVideoFile(null);
                          setTranscriptionResult(null);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto h-16 w-16 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900">Click to upload video</p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI, MKV, WEBM up to 500MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Lecture Title</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Introduction to Quantum Mechanics"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what students will learn"
                rows="4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Coding">Coding</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Placement">Placement</option>
                  <option value="Interview Prep">Interview Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Custom">Custom Subject</option>
                </select>
              </div>
            </div>

            {subject === 'Custom' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Subject Name</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Biology, Computer Science"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleUpload}
                disabled={!videoFile || uploading}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${
                  !videoFile || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload & Transcribe
                  </>
                )}
              </button>
              <button
                type="button"
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="text-blue-600" />
            How it works
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              Upload your lecture video in any format (MP4, MOV, AVI, etc.)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              AI automatically transcribes the video with precise timestamps
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              Get multiple transcript formats (JSON, TXT, SRT, VTT) instantly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              Use transcripts for subtitles, searchability, and accessibility
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================== LAYOUT COMPONENTS ====================
const Sidebar = ({ currentView, setCurrentView, userType, onLogout }) => (
  <div className="w-52 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
    <div className="p-6">
      <h1 className="text-2xl font-bold">PaathShala.</h1>
      <p className="text-xs text-gray-500 mt-1">{userType === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</p>
    </div>

    <nav className="flex-1 px-3">
      <SidebarItem icon={<div className="w-5 h-5 grid grid-cols-2 gap-0.5"><div className="bg-gray-600 rounded-sm"></div><div className="bg-gray-600 rounded-sm"></div><div className="bg-gray-600 rounded-sm"></div><div className="bg-gray-600 rounded-sm"></div></div>} text="Dashboard" />
      <SidebarItem icon={<MessageSquare size={20} />} text="Announcements" />
      <SidebarItem icon={<BookOpen size={20} />} text="Subjects" active={currentView === 'subjects'} onClick={() => setCurrentView('subjects')} />
      <SidebarItem icon={<BookOpen size={20} />} text="Lectures" active={currentView === 'lectures'} onClick={() => setCurrentView('lectures')} />
      {userType === 'student' && (
        <SidebarItem 
          icon={<FileText size={20} />} 
          text="Smart Scanner" 
          active={currentView === 'scanner'} 
          onClick={() => setCurrentView('scanner')} 
        />
      )}
      <SidebarItem icon={<FileText size={20} />} text="Assignments" />
      <SidebarItem icon={<HelpCircle size={20} />} text="Quiz" />
      <SidebarItem icon={<Users size={20} />} text="Discussions" />
      <SidebarItem icon={<MessageCircle size={20} />} text="PaathshalaVerse - Community" />
      <SidebarItem icon={<Lightbulb size={20} />} text="Changemakers Circle" />
      {userType === 'teacher' && (
        <>
          <SidebarItem
            icon={<Video size={20} />}
            text="Upload Video"
            active={currentView === 'upload'}
            onClick={() => setCurrentView('upload')}
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Student Analytics"
            active={currentView === 'analytics'}
            onClick={() => setCurrentView('analytics')}
          />

          <SidebarItem
            icon={<Users size={20} />}
            text="Weak Learners"
            active={currentView === 'weaklearners'}
            onClick={() => setCurrentView('weaklearners')}
          />

          
        </>
      )}
    </nav>

    <div className="p-3 border-t border-gray-200">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  </div>
);

const SidebarItem = ({ icon, text, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const Header = ({ onLogout, userType }) => {
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  return (
    <div className="fixed top-0 left-52 right-0 h-16 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <button className="p-2 hover:bg-gray-200 rounded-lg">
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <Bookmark size={20} />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg">
          <MessageSquare size={20} />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded-lg relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm hover:shadow-md transition-shadow"
          >
            {userType === 'teacher' ? 'T' : 'S'}
          </button>
          
          {showLogoutMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {userType === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
                </p>
                <p className="text-xs text-gray-500">
                  {userType === 'teacher' ? 'teacher@paathshala.com' : 'student@paathshala.com'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowLogoutMenu(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// ==================== SUBJECT COMPONENTS ====================
const SubjectsListView = ({ lectures, setSelectedSubject, setCurrentView }) => {
  const subjects = [...new Set(lectures.map(lecture => lecture.tag))].filter(Boolean);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subjects</h1>
        <p className="text-gray-600">Choose a subject to view lectures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => {
          const subjectLectures = lectures.filter(lecture => lecture.tag === subject);
          return (
            <div
              key={subject}
              onClick={() => {
                setSelectedSubject(subject);
                setCurrentView('lectures');
              }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{subject}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {subjectLectures.length} lectures
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Explore {subjectLectures.length} lecture{subjectLectures.length !== 1 ? 's' : ''} in {subject}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== LECTURE COMPONENTS ====================
const LecturesListView = ({ lectures, setSelectedLecture, loadingLectures, selectedSubject, setSelectedSubject }) => {
  const filteredLectures = selectedSubject ? lectures.filter(lecture => lecture.tag === selectedSubject) : lectures;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">All</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Upcoming</button>
          <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Past</button>
        </div>

        <div className="flex items-center gap-4">
          {selectedSubject && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">
              <span>Filtered by: {selectedSubject}</span>
              <button
                onClick={() => setSelectedSubject(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter size={18} />
            FILTERS
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loadingLectures ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading lectures...</p>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600">
              {selectedSubject ? `No lectures available for ${selectedSubject}` : 'No lectures available yet'}
            </p>
          </div>
        ) : (
          filteredLectures.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} setSelectedLecture={setSelectedLecture} />
          ))
        )}
      </div>
    </div>
  );
};
const TranscriptPanel = ({ setShowTranscript, transcript, loading, error, videoRef }) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(null);
  const transcriptRefs = useRef([]);

  useEffect(() => {
    if (!videoRef?.current || !transcript?.segments) return;

    const video = videoRef.current;
    
    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      
      const activeIndex = transcript.segments.findIndex((segment, index) => {
        const startTime = parseTimestamp(segment.start_time);
        const endTime = segment.end_time 
          ? parseTimestamp(segment.end_time)
          : (transcript.segments[index + 1] ? parseTimestamp(transcript.segments[index + 1].start_time) : Infinity);
        
        return currentTime >= startTime && currentTime < endTime;
      });
      
      if (activeIndex !== -1 && activeIndex !== activeSegmentIndex) {
        setActiveSegmentIndex(activeIndex);
        
        // Auto-scroll to active segment
        if (transcriptRefs.current[activeIndex]) {
          transcriptRefs.current[activeIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [transcript, videoRef, activeSegmentIndex]);

  const parseTimestamp = (timestamp) => {
    const parts = timestamp.split(':');
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
    }
    return 0;
  };

  const seekToTime = (timestamp) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = parseTimestamp(timestamp);
      videoRef.current.play();
    }
  };

  return (
    <div className="w-96">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg sticky top-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            Transcript
          </h3>
          <button 
            onClick={() => setShowTranscript(false)}
            className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors"
          >
            HIDE
          </button>
        </div>
        
        <div className="p-4 max-h-[600px] overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600 mt-3">Loading transcript...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">{error}</p>
              <p className="text-xs text-gray-600 mt-2">Using sample data for demonstration.</p>
            </div>
          )}
          
          {!loading && transcript && (
            <div className="space-y-2">
              {transcript.segments.map((segment, index) => (
                <div 
                  key={index}
                  ref={el => transcriptRefs.current[index] = el}
                  onClick={() => seekToTime(segment.start_time)}
                  className={`group p-3 rounded-lg transition-all cursor-pointer ${
                    activeSegmentIndex === index
                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                      : 'hover:bg-blue-50 border border-transparent hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-mono font-semibold ${
                      activeSegmentIndex === index ? 'text-blue-700' : 'text-blue-600'
                    }`}>
                      {segment.start_time}
                    </span>
                    <Play 
                      size={14} 
                      className={`transition-opacity ${
                        activeSegmentIndex === index 
                          ? 'text-blue-600 opacity-100' 
                          : 'text-gray-400 opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    activeSegmentIndex === index ? 'text-gray-900 font-medium' : 'text-gray-700'
                  }`}>
                    {segment.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {transcript && !loading && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Total segments: {transcript.segments.length}</span>
              <span>Language: {transcript.language?.toUpperCase() || 'EN'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LectureCard = ({ lecture, setSelectedLecture }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{lecture.title}</h3>
          {lecture.isLive && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">LIVE SESSION</span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-medium">
              {lecture.instructor.split(' ').map(n => n[0]).join('')}
            </div>
            <span>{lecture.instructor}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{lecture.date}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>{lecture.tag}</span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => setSelectedLecture(lecture)}
        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        VIEW RECORDING
      </button>
    </div>
  </div>
);
// ── Replay Tracker Hook ───────────────────────────────────────────────────────
// Detects when student seeks backward and sends event to backend
const useReplayTracker = (videoRef, videoId, userEmail) => {
  const lastTimeRef    = useRef(0);
  const trackingActive = useRef(false);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video || !videoId || !userEmail) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      // Normal playback — just update last position
      if (!trackingActive.current) {
        lastTimeRef.current = current;
      }
    };

    const handleSeeked = async () => {
      const current  = video.currentTime;
      const previous = lastTimeRef.current;
      const diff     = previous - current;

      // Only count as replay if student seeked backward by >10s
      if (diff > 10) {
        console.log(`[Replay] Detected: ${previous.toFixed(0)}s → ${current.toFixed(0)}s (back ${diff.toFixed(0)}s)`);
        try {
          await fetch(`${API_BASE}/save-replay-event`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              email:       userEmail,
              videoId,
              fromSeconds: previous,
              toSeconds:   current
            })
          });
        } catch (err) {
          // Silent — don't break video playback on tracking failure
          console.warn('[Replay] Tracking event failed:', err);
        }
      }

      lastTimeRef.current = current;
    };

    const handlePlay = () => { trackingActive.current = false; };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked',     handleSeeked);
    video.addEventListener('play',       handlePlay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked',     handleSeeked);
      video.removeEventListener('play',       handlePlay);
    };
  }, [videoRef, videoId, userEmail]);
};

// ── Must be OUTSIDE TeacherAnalytics (top-level hook) ────────────────────────
const useTeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('teacher_notifications') || '[]');
    setNotifications(stored);
  };

  const markRead = (id) => {
    const stored = JSON.parse(localStorage.getItem('teacher_notifications') || '[]');
    const updated = stored.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem('teacher_notifications', JSON.stringify(updated));
    setNotifications(updated);
  };

  const clearAll = () => {
    localStorage.setItem('teacher_notifications', JSON.stringify([]));
    setNotifications([]);
  };

  return {
    notifications,
    markRead,
    clearAll,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

// ── Notification Bell ─────────────────────────────────────────────────────────
const NotificationBell = ({ notifications, markRead, clearAll }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Bell size={22} className="text-gray-600" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                Notifications {unread > 0 && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unread} new</span>}
              </h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Clear all
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs mt-1">You'll be notified when students complete tests</p>
                </div>
              ) : notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 mt-0.5">
                      {n.type === 'flagged' ? '⚠️' : '✅'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {new Date(n.timestamp).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ── Proctoring Report Viewer ───────────────────────────────────────────────────
const ProctoringReportViewer = ({ studentEmail, onClose, inline = false }) => {
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const found = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`ap_session_${studentEmail}_`)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          found.push({ key, ...data });
        } catch (e) {}
      }
    }
    found.sort((a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0));
    setSessions(found);
  }, [studentEmail]);

  const checkpointLabel = (cp) => ({
    alpha: 'α Alpha — 25% (L1: Remember)',
    beta:  'β Beta  — 60% (L2: Understand)',
    omega: 'Ω Omega — 99% (L3/L4: Apply & Analyze)'
  }[cp] || cp);

  const scoreColor = (score) =>
    score >= 70 ? 'text-green-600 bg-green-50 border-green-200' :
    score >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200' :
                  'text-red-600   bg-red-50   border-red-200';

  const body = (
    <div className={inline ? '' : 'flex-1 overflow-y-auto p-6'}>
      {sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Shield size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No proctored sessions found for this student</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.key}
              className={`border-2 rounded-xl overflow-hidden ${
                (session.violations || 0) > 0 ? 'border-red-200' : 'border-gray-200'
              }`}
            >
              {/* Row header */}
              <div className={`px-5 py-4 flex items-center justify-between ${
                (session.violations || 0) > 0 ? 'bg-red-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {session.checkpoint === 'alpha' ? 'α' :
                     session.checkpoint === 'beta'  ? 'β' : 'Ω'}
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {checkpointLabel(session.checkpoint)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session.videoId} •{' '}
                      {session.startedAt
                        ? new Date(session.startedAt).toLocaleString('en-IN')
                        : 'Date unknown'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1.5 rounded-lg border font-bold text-sm ${scoreColor(session.score || 0)}`}>
                    {session.score || 0}%
                  </div>

                  {(session.violations || 0) > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg border border-red-200">
                      <AlertTriangle size={13} />
                      <span className="text-sm font-bold">
                        {session.violations} violation{session.violations > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => setExpanded(expanded === session.key ? null : session.key)}
                    className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    {expanded === session.key ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === session.key && (
                <div className="px-5 py-4 space-y-4 border-t border-gray-200 bg-white">

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Score',      value: `${session.score || 0}%` },
                      {
                        label: 'Time Taken',
                        value: session.timeTaken
                          ? `${Math.floor(session.timeTaken / 60)}m ${session.timeTaken % 60}s`
                          : 'N/A'
                      },
                      { label: 'Violations', value: session.violations || 0 },
                      { label: 'Bloom Level', value: `L${session.bloomLevel || '?'}` }
                    ].map(stat => (
                      <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Violation log */}
                  {(session.violations || 0) > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle size={13} /> Violation Log
                      </p>
                      {session.violationLog && session.violationLog.length > 0 ? (
                        <div className="space-y-2">
                          {session.violationLog.map((v, vi) => (
                            <div key={vi} className="flex items-start gap-2 text-xs text-red-700">
                              <span className="font-mono text-red-400 flex-shrink-0">
                                {v.timestamp ? new Date(v.timestamp).toLocaleTimeString() : `Event ${vi + 1}`}
                              </span>
                              <span>{v.type || v.reason || JSON.stringify(v)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-red-600">Violation count recorded but log details unavailable.</p>
                      )}
                    </div>
                  )}

                  {/* Per-question breakdown */}
                  {session.answers && session.answers.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-2">Question Breakdown</p>
                      <div className="space-y-2">
                        {session.answers.map((ans, ai) => (
                          <div
                            key={ai}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm border ${
                              ans.correct
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <span className="text-gray-700 flex-1 mr-3 line-clamp-1">
                              Q{ai + 1}: {ans.question || 'Question ' + (ai + 1)}
                            </span>
                            <span className={`font-bold text-base flex-shrink-0 ${
                              ans.correct ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {ans.correct ? '✓' : '✗'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Inline mode: render flat (used inside a tab)
  if (inline) return body;

  // Modal mode: wrap in overlay
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Proctoring Reports</h2>
            <p className="text-sm text-gray-500">{studentEmail}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500">✕</button>
        </div>
        {body}
      </div>
    </div>
  );
};

// ── Student Detail Modal (tabbed: Overview / Bloom's / Proctoring / Deep Analysis) ──
const TeacherStudentDetail = ({ student, onClose }) => {
  const [activeTab, setActiveTab]           = useState('overview');
  const [multidimAnalysis, setMultidimAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading]   = useState(false);
const [replayData,      setReplayData]      = useState(null);
const [replayLoading,   setReplayLoading]   = useState(false);
const [selectedVideoId, setSelectedVideoId] = useState('');
  useEffect(() => {
    const cached = localStorage.getItem(`multidim_${student.email}`);
    if (cached) {
      try { setMultidimAnalysis(JSON.parse(cached)); } catch (e) {}
    }
  }, [student.email]);

  const runDeepAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const checkpoints = JSON.parse(localStorage.getItem(`checkpoints_${student.email}`) || '[]');
      const res = await fetch(`${API_BASE}/analyze-student-multidim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentEmail:       student.email,
          completionPct:      parseFloat(student.avgProgress) || 0,
          replayCount:        student.replayCount || 0,
          checkpointAttempts: checkpoints,
          sessionHistory:     [],
          classAvg:           { score: 65, timeTaken: 120, replayCount: 2 }
        })
      });
      const data = await res.json();
      if (data.success) {
        setMultidimAnalysis(data.analysis);
        localStorage.setItem(`multidim_${student.email}`, JSON.stringify(data.analysis));
      }
    } catch (e) {
      console.error('Deep analysis failed:', e);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Build Bloom's data from localStorage checkpoints
  const bloomData = (() => {
    const checkpoints = JSON.parse(localStorage.getItem(`checkpoints_${student.email}`) || '[]');
    return [1, 2, 3, 4].map(lvl => {
      const forLevel = checkpoints.filter(cp => (cp.bloomLevel || 1) === lvl);
      const avg = forLevel.length
        ? Math.round(forLevel.reduce((s, cp) => s + (cp.score || 0), 0) / forLevel.length)
        : null;
      return {
        level: lvl,
        label: ['', 'Remember', 'Understand', 'Apply', 'Analyze'][lvl],
        checkpoint: ['', 'Alpha (α)', 'Beta (β)', 'Omega (Ω)', 'Omega (Ω)'][lvl],
        avg,
        attempts: forLevel.length
      };
    });
  })();

  const dimColors = {
    content_mastery:           { bar: 'bg-blue-500',   text: 'text-blue-700',   bg: 'bg-blue-50'   },
    engagement_depth:          { bar: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50'  },
    metacognitive_calibration: { bar: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50' },
    knowledge_retention:       { bar: 'bg-amber-500',  text: 'text-amber-700',  bg: 'bg-amber-50'  },
    learning_velocity:         { bar: 'bg-cyan-500',   text: 'text-cyan-700',   bg: 'bg-cyan-50'   },
    cognitive_load:            { bar: 'bg-red-400',    text: 'text-red-700',    bg: 'bg-red-50'    }
  };

  const dimLabels = {
    content_mastery:           'Content Mastery',
    engagement_depth:          'Engagement Depth',
    metacognitive_calibration: 'Metacognitive Calibration',
    knowledge_retention:       'Knowledge Retention',
    learning_velocity:         'Learning Velocity',
    cognitive_load:            'Cognitive Load'
  };

  const TABS = [
    { id: 'overview',      label: 'Overview' },
    { id: 'blooms',        label: "Bloom's Taxonomy" },
      { id: 'replay_habits', label: 'Replay Habits' },   // ← add this
    { id: 'proctoring',    label: 'Proctoring Reports' },
    { id: 'deep_analysis', label: 'Deep Analysis' }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                {student.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-blue-100 text-sm">{student.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <XCircle size={22} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Avg Score',     value: `${student.avgScore}%`,       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
                  { label: 'Avg Progress',  value: `${student.avgProgress}%`,    color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200'  },
                  { label: 'Tests Taken',   value: student.testsCompleted,        color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' }
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Watch time */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Total Watch Time</span>
                <span className="text-lg font-bold text-gray-900">{student.totalWatchTime} min</span>
              </div>

              {/* Flags */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-3">Active Flags</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(student.flags || {}).map(([key, active]) =>
                    active ? (
                      <span key={key} className={`px-3 py-1 rounded-full text-xs font-semibold border ${FLAG_META[key]?.color}`}>
                        {FLAG_META[key]?.label}
                      </span>
                    ) : null
                  )}
                  {!Object.values(student.flags || {}).some(Boolean) && (
                    <span className="text-sm text-green-600 font-medium">✓ No flags — student performing well</span>
                  )}
                </div>
              </div>

              {/* Subject breakdown */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Subject Breakdown</p>
                <div className="space-y-2">
                  {student.subjectBreakdown.filter(s => s.videos > 0 || s.tests > 0).map(sub => (
                    <div key={sub.subject} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{sub.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {sub.videos} video{sub.videos !== 1 ? 's' : ''} · {sub.tests} test{sub.tests !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                        sub.avgScore >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                        sub.avgScore >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200'   :
                        sub.avgScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                             'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {sub.avgScore}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BLOOM'S TAXONOMY ── */}
          {activeTab === 'blooms' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                Shows performance at each Bloom's Taxonomy level based on checkpoint tests completed.
                Alpha = L1, Beta = L2, Omega = L3/L4.
              </p>

              {bloomData.map(lvl => (
                <div key={lvl.level} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        lvl.level === 1 ? 'bg-blue-100   text-blue-700'   :
                        lvl.level === 2 ? 'bg-green-100  text-green-700'  :
                        lvl.level === 3 ? 'bg-amber-100  text-amber-700'  :
                                          'bg-red-100    text-red-700'
                      }`}>
                        L{lvl.level}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900">{lvl.label}</p>
                        <p className="text-xs text-gray-400">
                          {lvl.checkpoint} · {lvl.attempts} attempt{lvl.attempts !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${
                      lvl.avg === null ? 'text-gray-300' :
                      lvl.avg >= 70    ? 'text-green-600' :
                      lvl.avg >= 50    ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {lvl.avg === null ? '—' : `${lvl.avg}%`}
                    </p>
                  </div>

                  {lvl.avg !== null && (
                    <>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            lvl.avg >= 70 ? 'bg-green-500' :
                            lvl.avg >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lvl.avg}%` }}
                        />
                      </div>
                      {lvl.avg < 60 && (
                        <p className="text-xs text-gray-500 mt-2 pl-1">
                          {lvl.level === 1 && '→ Struggling to recall facts. Recommend: flashcard review session.'}
                          {lvl.level === 2 && '→ Conceptual gap. Recommend: re-watch lecture + AI Chat questions.'}
                          {lvl.level === 3 && '→ Cannot apply concepts. Recommend: worked examples + practice problems.'}
                          {lvl.level === 4 && '→ Analytical thinking weak. Recommend: comparative / why-type questions.'}
                        </p>
                      )}
                    </>
                  )}

                  {lvl.avg === null && (
                    <p className="text-xs text-gray-400 mt-1 pl-1">No checkpoint completed at this level yet.</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── PROCTORING REPORTS ──
          {process.env.NODE_ENV === 'development' && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between">
    <p className="text-xs text-yellow-700 font-medium">
      🛠 Dev: Inject test replay data to verify UI
    </p>
    <button
      onClick={async () => {
        // Use first available video from watch history
        const wh = JSON.parse(localStorage.getItem(`watch_history_${student.email}`) || '[]');
        const vid = wh[0]?.videoId || selectedVideoId;
        if (!vid) { alert('No video found — watch a video first'); return; }
        const r = await fetch(
          `${API_BASE}/debug-inject-replay/${vid}/${encodeURIComponent(student.email)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
        );
        const d = await r.json();
        if (d.success) {
          alert(`✅ Injected replay data for ${d.injected?.length} nodes in video "${vid}"`);
          // Auto-load that video's data
          setSelectedVideoId(vid);
          const r2 = await fetch(`${API_BASE}/get-replay-analysis/${vid}/${encodeURIComponent(student.email)}`);
          setReplayData(await r2.json());
        } else {
          alert('❌ ' + d.error);
        }
      }}
      className="text-xs px-3 py-1.5 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
    >
      Inject Test Data
    </button>
  </div>
)} */}
          {activeTab === 'proctoring' && (
            <ProctoringReportViewer
              studentEmail={student.email}
              onClose={() => setActiveTab('overview')}
              inline={true}
            />
          )}
          {/* Add this at the top of the replay_habits tab content, before the video selector */}

          {/* ── REPLAY HABITS ── */}
{activeTab === 'replay_habits' && (
  <div className="space-y-5">
    <p className="text-sm text-gray-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
      Sections the student replayed. Each replay of a PI tree node is a signal they found it difficult.
      Nodes replayed 2+ times are flagged.
    </p>

    {/* Video selector */}
    <div>
      <label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
        Select Video
      </label>
      <div className="flex gap-2 flex-wrap">
        {/* Get all videos this student has watch history for */}
        {(() => {
          const keys = Object.keys(localStorage)
            .filter(k => k.startsWith(`watch_history_${student.email}`));
          const watchHistory = JSON.parse(
            localStorage.getItem(`watch_history_${student.email}`) || '[]'
          );
          const videoIds = [...new Set(watchHistory.map(v => v.videoId).filter(Boolean))];
          if (videoIds.length === 0) {
            return <p className="text-sm text-gray-400">No watch history found</p>;
          }
          return videoIds.map(vid => (
            <button
              key={vid}
              onClick={async () => {
                setSelectedVideoId(vid);
                setReplayLoading(true);
                try {
                  const r = await fetch(`${API_BASE}/get-replay-analysis/${vid}/${encodeURIComponent(student.email)}`);
                  const d = await r.json();
                  setReplayData(d);
                } catch (e) {
                  setReplayData({ found: false });
                } finally {
                  setReplayLoading(false);
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                selectedVideoId === vid
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-amber-400'
              }`}
            >
              {vid.replace(/_/g, ' ')}
            </button>
          ));
        })()}
      </div>
    </div>

    {replayLoading && (
      <div className="flex items-center gap-2 text-amber-600 py-4">
        <Loader className="animate-spin" size={16} />
        <span className="text-sm">Loading replay data...</span>
      </div>
    )}

    {replayData && !replayLoading && (
      <>
        {!replayData.found ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No replay events recorded for this video yet.</p>
            <p className="text-xs mt-1">Replays are tracked automatically while the student watches.</p>
          </div>
        ) : (
          <div className="space-y-4">

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Replays',    value: replayData.total_replays,              color: 'text-amber-600' },
                { label: 'Sections Replayed', value: replayData.nodes?.length || 0,         color: 'text-blue-600'  },
                { label: 'Flagged Sections',  value: replayData.flagged_nodes?.length || 0, color: 'text-red-600'   }
              ].map(s => (
                <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Node list */}
            {replayData.nodes?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Replayed Sections (most to least)
                </p>
                <div className="space-y-2">
                  {replayData.nodes.map((node, i) => (
                    <div
                      key={node.node_id}
                      className={`border-2 rounded-xl p-4 ${
                        node.flagged
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              i === 0 ? 'bg-red-100 text-red-700' :
                              i === 1 ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-600'
                            }`}>
                              #{i + 1}
                            </span>
                            <p className="font-semibold text-gray-900 text-sm truncate">
                              {node.title}
                            </p>
                            {node.flagged && node.flag_types?.map(f => (
                              <span key={f} className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${FLAG_META[f]?.color || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                                {FLAG_META[f]?.label || f}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{node.section}</p>
                          {node.page_range && (
                            <p className="text-xs text-gray-400 mt-0.5">📖 {node.page_range}</p>
                          )}
                        </div>

                        {/* Replay count badge */}
                        <div className="flex-shrink-0 text-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                            node.count >= 5 ? 'bg-red-500 text-white' :
                            node.count >= 3 ? 'bg-amber-500 text-white' :
                            node.count >= 2 ? 'bg-amber-100 text-amber-700' :
                                              'bg-gray-100 text-gray-600'
                          }`}>
                            {node.count}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">replays</p>
                        </div>
                      </div>

                      {/* Replay bar */}
                      <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            node.count >= 5 ? 'bg-red-500' :
                            node.count >= 3 ? 'bg-amber-500' : 'bg-amber-300'
                          }`}
                          style={{ width: `${Math.min((node.count / (replayData.most_replayed?.[0]?.count || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </>
    )}
  </div>
)}

          {/* ── DEEP ANALYSIS ── */}
          {activeTab === 'deep_analysis' && (
            <div className="space-y-4">
              {!multidimAnalysis && !analysisLoading && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Brain size={32} className="text-purple-600" />
                  </div>
                  <p className="text-base font-bold text-gray-900 mb-1">6-Dimension AI Learning Analysis</p>
                  <p className="text-sm text-gray-500 mb-1">Based on Cognitive Load Theory + Metacognition research</p>
                  <p className="text-xs text-gray-400 mb-5">
                    Analyses: Content Mastery, Engagement, Calibration, Retention, Velocity, Cognitive Load
                  </p>
                  <button
                    onClick={runDeepAnalysis}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Run Deep Analysis
                  </button>
                </div>
              )}

              {analysisLoading && (
                <div className="text-center py-10">
                  <Loader className="animate-spin mx-auto mb-3 text-purple-500" size={36} />
                  <p className="text-sm text-gray-500">Analysing learning patterns across all dimensions...</p>
                </div>
              )}

              {multidimAnalysis && !analysisLoading && (
                <div className="space-y-4">

                  {/* Student message card */}
                  {multidimAnalysis.student_message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-blue-500 mb-1 uppercase tracking-wide">Suggested Message for Student</p>
                      <p className="text-sm text-blue-900 italic">"{multidimAnalysis.student_message}"</p>
                    </div>
                  )}

                  {/* Teacher action */}
                  {multidimAnalysis.recommended_intervention && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-wide">Recommended Teacher Action</p>
                      <p className="text-sm text-amber-900 font-medium">{multidimAnalysis.recommended_intervention}</p>
                    </div>
                  )}

                  {/* 6 dimension cards */}
                  {multidimAnalysis.dimensions && (
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(multidimAnalysis.dimensions).map(([key, dim]) => {
                        const c = dimColors[key] || { bar: 'bg-gray-400', text: 'text-gray-700', bg: 'bg-gray-50' };
                        return (
                          <div key={key} className={`${c.bg} border border-gray-200 rounded-xl p-4`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex-1 min-w-0 mr-4">
                                <p className={`text-sm font-bold ${c.text}`}>{dimLabels[key] || key}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{dim.insight}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={`text-2xl font-bold ${c.text}`}>{dim.score}</p>
                                <p className="text-xs text-gray-500">{dim.label}</p>
                              </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${c.bar} rounded-full transition-all duration-700`}
                                style={{ width: `${Math.min(dim.score, 100)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <button
                    onClick={runDeepAnalysis}
                    className="w-full py-2.5 text-sm text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors font-medium"
                  >
                    Re-run Analysis
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ── TeacherAnalytics (main component — your existing logic preserved) ──────────
const TeacherAnalytics = () => {
  const [analytics, setAnalytics]         = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [timeFilter, setTimeFilter]       = useState('all');
  const [proctoringReport, setProctoringReport] = useState(null);

  // ← Hook called at top level of component (not inside)
  const { notifications, markRead, clearAll, unreadCount } = useTeacherNotifications();

  useEffect(() => {
    calculateTeacherAnalytics();
  }, [timeFilter]);

  const calculateTeacherAnalytics = () => {
    try {
      setLoading(true);

      const students = [
        'student1@paathshala.com', 'student2@paathshala.com', 'student3@paathshala.com',
        'student4@paathshala.com', 'student5@paathshala.com', 'student6@paathshala.com',
        'student7@paathshala.com', 'student8@paathshala.com', 'student9@paathshala.com',
        'student10@paathshala.com'
      ];

      const subjects  = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'General'];
      const allKeys   = Object.keys(localStorage);

      const studentData = students.map(email => {
        const watchHistory = JSON.parse(localStorage.getItem(`watch_history_${email}`) || '[]');
        const testResults  = allKeys
          .filter(key => key.startsWith(`test_result_${email}_`))
          .map(key => JSON.parse(localStorage.getItem(key)));

        const now        = new Date();
        const filterDate = timeFilter === 'week'  ? new Date(now - 7  * 864e5) :
                           timeFilter === 'month' ? new Date(now - 30 * 864e5) :
                           new Date(0);

        const filteredWatch = watchHistory.filter(v => new Date(v.lastWatched) >= filterDate);
        const filteredTests = testResults.filter(t  => new Date(t.date) >= filterDate);

        const totalWatchTime = filteredWatch.reduce((sum, v) => sum + (v.currentTime || 0), 0);
        const avgProgress    = filteredWatch.length
          ? filteredWatch.reduce((sum, v) => sum + v.progress, 0) / filteredWatch.length
          : 0;
        const avgScore       = filteredTests.length
          ? filteredTests.reduce((sum, t) => sum + parseFloat(t.score), 0) / filteredTests.length
          : 0;

        let category = 'Inactive';
        if (avgScore >= 80 && avgProgress >= 70)                      category = 'Excellent';
        else if (avgScore >= 60 && avgProgress >= 50)                 category = 'Good';
        else if (avgScore >= 40 || avgProgress >= 30)                 category = 'Average';
        else if (filteredTests.length > 0 || filteredWatch.length > 0) category = 'Needs Attention';

        return {
          email,
          name:           email.split('@')[0],
          totalWatchTime: Math.floor(totalWatchTime / 60),
          videosWatched:  filteredWatch.length,
          testsCompleted: filteredTests.length,
          avgProgress:    avgProgress.toFixed(1),
          avgScore:       avgScore.toFixed(1),
          category,
          recentActivity: filteredWatch.length + filteredTests.length,
          flags: (() => {
            const flagSummary = JSON.parse(localStorage.getItem(`flags_summary_${email}`) || '{}');
            return {
              flag1: Object.values(flagSummary).some(f => f.flag1),
              flag2: Object.values(flagSummary).some(f => f.flag2),
              flag3: Object.values(flagSummary).some(f => f.flag3),
              flag4: Object.values(flagSummary).some(f => f.flag4),
              flag5: Object.values(flagSummary).some(f => f.flag5),
            };
          })(),
          subjectBreakdown: subjects.map(subject => ({
            subject,
            videos:   filteredWatch.filter(v => v.subject === subject).length,
            tests:    filteredTests.filter(t => t.subject === subject).length,
            avgScore: filteredTests.filter(t => t.subject === subject).length > 0
              ? (filteredTests.filter(t => t.subject === subject)
                  .reduce((sum, t) => sum + parseFloat(t.score), 0) /
                 filteredTests.filter(t => t.subject === subject).length).toFixed(1)
              : 0
          }))
        };
      });

      const subjectStats = subjects.map(subject => {
        const subjectTests = studentData.flatMap(s =>
          s.subjectBreakdown.find(sb => sb.subject === subject)
        ).filter(Boolean);
        return {
          subject,
          totalTests:  subjectTests.reduce((sum, st) => sum + st.tests, 0),
          totalVideos: subjectTests.reduce((sum, st) => sum + st.videos, 0),
          avgScore:    subjectTests.filter(st => st.avgScore > 0).length > 0
            ? (subjectTests.reduce((sum, st) => sum + parseFloat(st.avgScore || 0), 0) /
               subjectTests.filter(st => st.avgScore > 0).length).toFixed(1)
            : 0
        };
      });

      const distribution = {
        Excellent:        studentData.filter(s => s.category === 'Excellent').length,
        Good:             studentData.filter(s => s.category === 'Good').length,
        Average:          studentData.filter(s => s.category === 'Average').length,
        'Needs Attention': studentData.filter(s => s.category === 'Needs Attention').length,
        Inactive:         studentData.filter(s => s.category === 'Inactive').length
      };

      setAnalytics({
        studentData: studentData.sort((a, b) => b.avgScore - a.avgScore),
        subjectStats,
        distribution,
        totalActiveStudents: studentData.filter(s => s.category !== 'Inactive').length,
        overallAvgScore: (
          studentData.reduce((sum, s) => sum + parseFloat(s.avgScore), 0) / studentData.length
        ).toFixed(1)
      });

    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => ({
    Excellent:        'bg-green-100  text-green-800  border-green-300',
    Good:             'bg-blue-100   text-blue-800   border-blue-300',
    Average:          'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Needs Attention': 'bg-orange-100 text-orange-800 border-orange-300',
    Inactive:         'bg-gray-100   text-gray-800   border-gray-300'
  }[category] || 'bg-gray-100 text-gray-800 border-gray-300');

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="animate-spin mx-auto text-blue-600" size={48} />
        <p className="text-gray-600 mt-4">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Header row with notification bell ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor student performance and engagement</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <NotificationBell
            notifications={notifications}
            markRead={markRead}
            clearAll={clearAll}
          />
          {/* Time filters */}
          {['all', 'month', 'week'].map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'month' ? 'This Month' : 'This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Students',   value: `${analytics.totalActiveStudents}/10`, from: 'from-blue-500',   to: 'to-blue-600'   },
          { label: 'Overall Avg Score', value: `${analytics.overallAvgScore}%`,       from: 'from-green-500',  to: 'to-green-600'  },
          { label: 'Top Performers',    value: analytics.distribution.Excellent,       from: 'from-purple-500', to: 'to-purple-600' },
          { label: 'Need Attention',    value: analytics.distribution['Needs Attention'], from: 'from-orange-500', to: 'to-orange-600' }
        ].map(card => (
          <div key={card.label} className={`bg-gradient-to-br ${card.from} ${card.to} text-white rounded-xl p-6 shadow-lg`}>
            <p className="text-white/80 text-sm mb-1">{card.label}</p>
            <p className="text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Performance distribution */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Distribution</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(analytics.distribution).map(([category, count]) => (
            <div key={category} className={`p-4 rounded-xl border-2 text-center ${getCategoryColor(category)}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm font-medium mt-1">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subject stats */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {analytics.subjectStats.map(subject => (
            <div key={subject.subject} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">{subject.subject}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Videos</span><span className="font-semibold">{subject.totalVideos}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tests</span><span className="font-semibold">{subject.totalTests}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Avg Score</span><span className="font-semibold text-blue-600">{subject.avgScore}%</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Replay Heatmap — class-wide weak spots */}
<ClassReplayHeatmap videos={analytics.studentData
  .flatMap(s => JSON.parse(localStorage.getItem(`watch_history_${s.email}`) || '[]'))
  .map(v => v.videoId)
  .filter(Boolean)
  .filter((v, i, a) => a.indexOf(v) === i)  // unique
} />

      {/* Student table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Student Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                {['Student','Videos','Watch Time','Tests','Avg Score','Progress','Category','Flags','Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics.studentData.map(student => (
                <tr key={student.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-400">{student.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{student.videosWatched}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{student.totalWatchTime} min</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{student.testsCompleted}</td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-bold ${
                      student.avgScore >= 80 ? 'text-green-600' :
                      student.avgScore >= 60 ? 'text-blue-600'  :
                      student.avgScore >= 40 ? 'text-amber-600' : 'text-red-600'
                    }`}>{student.avgScore}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${student.avgProgress}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{student.avgProgress}%</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(student.category)}`}>
                      {student.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(student.flags || {}).map(([key, active]) =>
                        active ? (
                          <span key={key} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${FLAG_META[key]?.color}`}>
                            {FLAG_META[key]?.label}
                          </span>
                        ) : null
                      )}
                      {!Object.values(student.flags || {}).some(Boolean) && (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setProctoringReport({ email: student.email })}
                        className="text-xs px-3 py-1.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                      >
                        Reports
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student detail modal (tabbed) */}
      {selectedStudent && (
        <TeacherStudentDetail
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* Standalone proctoring report modal (from "Reports" button) */}
      {proctoringReport && (
        <ProctoringReportViewer
          studentEmail={proctoringReport.email}
          onClose={() => setProctoringReport(null)}
          inline={false}
        />
      )}
    </div>
  );
};

const ClassReplayHeatmap = ({ videos }) => {
  const [heatData,     setHeatData]     = useState({});
  const [loadingVid,   setLoadingVid]   = useState(null);
  const [selectedVid,  setSelectedVid]  = useState(null);

  const loadHeatmap = async (videoId) => {
    if (heatData[videoId]) { setSelectedVid(videoId); return; }
    setLoadingVid(videoId);
    try {
      const r = await fetch(`${API_BASE}/get-class-replay-analysis/${videoId}`);
      const d = await r.json();
      setHeatData(prev => ({ ...prev, [videoId]: d }));
      setSelectedVid(videoId);
    } catch (e) {
      console.error('Heatmap load failed:', e);
    } finally {
      setLoadingVid(null);
    }
  };

  const data = selectedVid ? heatData[selectedVid] : null;

  if (!videos || videos.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Class Replay Heatmap</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Textbook sections most replayed across all students — reveals class-wide weak spots
          </p>
        </div>
      </div>

      {/* Video selector */}
      <div className="flex gap-2 flex-wrap mb-5">
        {videos.map(vid => (
          <button
            key={vid}
            onClick={() => loadHeatmap(vid)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              selectedVid === vid
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
          >
            {loadingVid === vid
              ? <span className="flex items-center gap-1"><Loader size={12} className="animate-spin" /> Loading...</span>
              : vid.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {data && (
        data.nodes?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No replay data recorded for this video yet.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>{data.total_students} student{data.total_students !== 1 ? 's' : ''} tracked</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-300 inline-block"></span> 1 student</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500 inline-block"></span> Many</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block"></span> Most</span>
              </div>
            </div>

            {data.nodes?.slice(0, 8).map((node, i) => {
              const pct = data.total_students > 0
                ? (node.students_replayed / data.total_students) * 100
                : 0;
              return (
                <div key={node.node_id} className="flex items-center gap-3">
                  <div className="w-6 text-xs text-gray-400 text-right flex-shrink-0">#{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">{node.title}</p>
                      <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {node.students_replayed}/{data.total_students} students · {node.total_replays} replays
                      </p>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 60 ? 'bg-red-500' :
                          pct >= 35 ? 'bg-amber-500' : 'bg-amber-300'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{node.section}</p>
                  </div>
                </div>
              );
            })}

            {data.hot_spots?.length > 0 && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-bold text-red-700 mb-2">⚠️ Class-wide Weak Spots — Consider Re-teaching</p>
                <ul className="space-y-1">
                  {data.hot_spots.slice(0, 3).map(node => (
                    <li key={node.node_id} className="text-sm text-red-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span className="font-medium">{node.title}</span>
                      <span className="text-red-500 text-xs">— {node.students_replayed} students replayed this</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};


// const TeacherAnalytics = () => {
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [timeFilter, setTimeFilter] = useState('all'); // all, week, month
//   const [proctoringReport, setProctoringReport] = useState(null); // {email, videoId}

//   useEffect(() => {
//     calculateTeacherAnalytics();
//   }, [timeFilter]);

//   const useTeacherNotifications = (teacherEmail) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     loadNotifications();
//     // Poll for new notifications every 30s
//     const interval = setInterval(loadNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const loadNotifications = () => {
//     const stored = JSON.parse(localStorage.getItem('teacher_notifications') || '[]');
//     setNotifications(stored);
//   };

//   const markRead = (id) => {
//     const stored = JSON.parse(localStorage.getItem('teacher_notifications') || '[]');
//     const updated = stored.map(n => n.id === id ? { ...n, read: true } : n);
//     localStorage.setItem('teacher_notifications', JSON.stringify(updated));
//     setNotifications(updated);
//   };

//   const clearAll = () => {
//     localStorage.setItem('teacher_notifications', JSON.stringify([]));
//     setNotifications([]);
//   };

//   return { notifications, markRead, clearAll, unreadCount: notifications.filter(n => !n.read).length };
// };

//   const calculateTeacherAnalytics = () => {
//     try {
//       setLoading(true);
      
//       const students = [
//         'student1@paathshala.com', 'student2@paathshala.com', 'student3@paathshala.com',
//         'student4@paathshala.com', 'student5@paathshala.com', 'student6@paathshala.com',
//         'student7@paathshala.com', 'student8@paathshala.com', 'student9@paathshala.com',
//         'student10@paathshala.com'
//       ];

//       const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'General'];
//       const allKeys = Object.keys(localStorage);
      
//       // Aggregate student data
//       const studentData = students.map(email => {
//         const watchHistory = JSON.parse(localStorage.getItem(`watch_history_${email}`) || '[]');
//         const testResults = allKeys
//           .filter(key => key.startsWith(`test_result_${email}_`))
//           .map(key => JSON.parse(localStorage.getItem(key)));

//         // Filter by time if needed
//         const now = new Date();
//         const filterDate = timeFilter === 'week' ? new Date(now - 7 * 24 * 60 * 60 * 1000) :
//                           timeFilter === 'month' ? new Date(now - 30 * 24 * 60 * 60 * 1000) :
//                           new Date(0);

//         const filteredWatch = watchHistory.filter(v => new Date(v.lastWatched) >= filterDate);
//         const filteredTests = testResults.filter(t => new Date(t.date) >= filterDate);

//         const totalWatchTime = filteredWatch.reduce((sum, v) => sum + (v.currentTime || 0), 0);
//         const avgProgress = filteredWatch.length > 0
//           ? filteredWatch.reduce((sum, v) => sum + v.progress, 0) / filteredWatch.length
//           : 0;
        
//         const avgScore = filteredTests.length > 0
//           ? filteredTests.reduce((sum, t) => sum + parseFloat(t.score), 0) / filteredTests.length
//           : 0;

//         // Categorize performance
//         let category = 'Inactive';
//         if (avgScore >= 80 && avgProgress >= 70) category = 'Excellent';
//         else if (avgScore >= 60 && avgProgress >= 50) category = 'Good';
//         else if (avgScore >= 40 || avgProgress >= 30) category = 'Average';
//         else if (filteredTests.length > 0 || filteredWatch.length > 0) category = 'Needs Attention';

//         return {
//           email,
//           name: email.split('@')[0],
//           totalWatchTime: Math.floor(totalWatchTime / 60),
//           videosWatched: filteredWatch.length,
//           testsCompleted: filteredTests.length,
//           avgProgress: avgProgress.toFixed(1),
//           avgScore: avgScore.toFixed(1),
//           category,
//           recentActivity: filteredWatch.length + filteredTests.length,
//           flags: (() => {
//             const flagSummary = JSON.parse(localStorage.getItem(`flags_summary_${email}`) || '{}');
//             // Union all flags across all videos
//             return {
//               flag1: Object.values(flagSummary).some(f => f.flag1),
//               flag2: Object.values(flagSummary).some(f => f.flag2),
//               flag3: Object.values(flagSummary).some(f => f.flag3),
//               flag4: Object.values(flagSummary).some(f => f.flag4),
//               flag5: Object.values(flagSummary).some(f => f.flag5),
//             };
//           })(),
//           subjectBreakdown: subjects.map(subject => ({
//             subject,
//             videos: filteredWatch.filter(v => v.subject === subject).length,
//             tests: filteredTests.filter(t => t.subject === subject).length,
//             avgScore: filteredTests.filter(t => t.subject === subject).length > 0
//               ? (filteredTests.filter(t => t.subject === subject)
//                   .reduce((sum, t) => sum + parseFloat(t.score), 0) / 
//                   filteredTests.filter(t => t.subject === subject).length).toFixed(1)
//               : 0
//           }))
//         };
//       });

//       // Subject-wise aggregation
//       const subjectStats = subjects.map(subject => {
//         const subjectTests = studentData.flatMap(s => 
//           s.subjectBreakdown.find(sb => sb.subject === subject)
//         ).filter(Boolean);

//         return {
//           subject,
//           totalTests: subjectTests.reduce((sum, st) => sum + st.tests, 0),
//           totalVideos: subjectTests.reduce((sum, st) => sum + st.videos, 0),
//           avgScore: subjectTests.length > 0 
//             ? (subjectTests.reduce((sum, st) => sum + parseFloat(st.avgScore || 0), 0) / subjectTests.filter(st => st.avgScore > 0).length || 0).toFixed(1)
//             : 0
//         };
//       });

//       // Performance distribution
//       const distribution = {
//         Excellent: studentData.filter(s => s.category === 'Excellent').length,
//         Good: studentData.filter(s => s.category === 'Good').length,
//         Average: studentData.filter(s => s.category === 'Average').length,
//         'Needs Attention': studentData.filter(s => s.category === 'Needs Attention').length,
//         Inactive: studentData.filter(s => s.category === 'Inactive').length
//       };

//       setAnalytics({
//         studentData: studentData.sort((a, b) => b.avgScore - a.avgScore),
//         subjectStats,
//         distribution,
//         totalActiveStudents: studentData.filter(s => s.category !== 'Inactive').length,
//         overallAvgScore: studentData.length > 0
//           ? (studentData.reduce((sum, s) => sum + parseFloat(s.avgScore), 0) / studentData.length).toFixed(1)
//           : 0
//       });

//     } catch (error) {
//       console.error('Error calculating analytics:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCategoryColor = (category) => {
//     switch (category) {
//       case 'Excellent': return 'bg-green-100 text-green-800 border-green-300';
//       case 'Good': return 'bg-blue-100 text-blue-800 border-blue-300';
//       case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
//       case 'Needs Attention': return 'bg-orange-100 text-orange-800 border-orange-300';
//       case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-300';
//       default: return 'bg-gray-100 text-gray-800 border-gray-300';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-12">
//         <Loader className="animate-spin mx-auto text-blue-600" size={48} />
//         <p className="text-gray-600 mt-4">Loading analytics...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Student Analytics Dashboard</h1>
//           <p className="text-gray-600 mt-1">Monitor student performance and engagement</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setTimeFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               timeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             All Time
//           </button>
//           <button
//             onClick={() => setTimeFilter('month')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               timeFilter === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             This Month
//           </button>
//           <button
//             onClick={() => setTimeFilter('week')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               timeFilter === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             This Week
//           </button>
//         </div>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
//           <p className="text-blue-100 text-sm mb-1">Active Students</p>
//           <p className="text-4xl font-bold">{analytics.totalActiveStudents}/10</p>
//         </div>
//         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 shadow-lg">
//           <p className="text-green-100 text-sm mb-1">Overall Avg Score</p>
//           <p className="text-4xl font-bold">{analytics.overallAvgScore}%</p>
//         </div>
//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
//           <p className="text-purple-100 text-sm mb-1">Top Performers</p>
//           <p className="text-4xl font-bold">{analytics.distribution.Excellent}</p>
//         </div>
//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6 shadow-lg">
//           <p className="text-orange-100 text-sm mb-1">Need Attention</p>
//           <p className="text-4xl font-bold">{analytics.distribution['Needs Attention']}</p>
//         </div>
//       </div>

//       {/* Performance Distribution */}
//       <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Distribution</h3>
//         <div className="grid grid-cols-5 gap-3">
//           {Object.entries(analytics.distribution).map(([category, count]) => (
//             <div key={category} className={`p-4 rounded-lg border-2 text-center ${getCategoryColor(category)}`}>
//               <p className="text-2xl font-bold">{count}</p>
//               <p className="text-sm font-medium mt-1">{category}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Subject-wise Stats */}
//       <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">Subject-wise Performance</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           {analytics.subjectStats.map(subject => (
//             <div key={subject.subject} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <h4 className="font-bold text-gray-900 mb-3">{subject.subject}</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Videos:</span>
//                   <span className="font-semibold">{subject.totalVideos}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tests:</span>
//                   <span className="font-semibold">{subject.totalTests}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Avg Score:</span>
//                   <span className="font-semibold text-blue-600">{subject.avgScore}%</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Student List */}
//       <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
//           <h3 className="text-xl font-bold text-gray-900">Student Performance Details</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-100 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Student</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Videos</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Watch Time</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tests</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Avg Score</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Flags</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {analytics.studentData.map((student) => (
//                 <tr key={student.email} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="font-medium text-gray-900">{student.name}</p>
//                       <p className="text-xs text-gray-500">{student.email}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{student.videosWatched}</td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{student.totalWatchTime} min</td>
//                   <td className="px-6 py-4 text-sm text-gray-900">{student.testsCompleted}</td>
//                   <td className="px-6 py-4">
//                     <span className={`text-sm font-semibold ${
//                       student.avgScore >= 80 ? 'text-green-600' :
//                       student.avgScore >= 60 ? 'text-blue-600' :
//                       student.avgScore >= 40 ? 'text-yellow-600' :
//                       'text-red-600'
//                     }`}>
//                       {student.avgScore}%
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-500 h-2 rounded-full"
//                         style={{ width: `${student.avgProgress}%` }}
//                       ></div>
//                     </div>
//                     <span className="text-xs text-gray-500">{student.avgProgress}%</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(student.category)}`}>
//                       {student.category}
//                     </span>
//                   </td>
//                  <td className="px-6 py-4">
//                   <div className="flex items-center gap-3">
//                     <button
//                       onClick={() => setSelectedStudent(student)}
//                       className="text-blue-600 hover:text-blue-700 font-medium text-sm"
//                     >
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => setProctoringReport({ email: student.email, videoId: null })}
//                       className="text-slate-600 hover:text-slate-800 font-medium text-sm"
//                     >
//                       Reports
//                     </button>
//                   </div>
//                 </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-wrap gap-1">
//                       {Object.entries(student.flags || {}).map(([key, active]) =>
//                         active ? (
//                           <span key={key} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${FLAG_META[key]?.color}`}>
//                             {FLAG_META[key]?.label}
//                           </span>
//                         ) : null
//                       )}
//                       {!Object.values(student.flags || {}).some(Boolean) && (
//                         <span className="text-xs text-gray-400">None</span>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Student Detail Modal */}
//       {selectedStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
//                   <p className="text-blue-100">{selectedStudent.email}</p>
//                 </div>
//                 <button
//                   onClick={() => setSelectedStudent(null)}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
//                 >
//                   <XCircle size={24} />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6 space-y-6">
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                   <p className="text-sm text-gray-600">Total Watch Time</p>
//                   <p className="text-2xl font-bold text-blue-600">{selectedStudent.totalWatchTime} min</p>
//                 </div>
//                 <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                   <p className="text-sm text-gray-600">Tests Completed</p>
//                   <p className="text-2xl font-bold text-green-600">{selectedStudent.testsCompleted}</p>
//                 </div>
//                 <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
//                   <p className="text-sm text-gray-600">Average Score</p>
//                   <p className="text-2xl font-bold text-purple-600">{selectedStudent.avgScore}%</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-3">
//                     <p className="text-sm text-gray-600 mb-2 font-semibold">Active Flags</p>
//                     <div className="flex flex-wrap gap-2">
//                       {Object.entries(selectedStudent.flags || {}).map(([key, active]) =>
//                         active ? (
//                           <span key={key} className={`px-3 py-1 rounded-full text-xs font-semibold border ${FLAG_META[key]?.color}`}>
//                             {FLAG_META[key]?.label}
//                           </span>
//                         ) : null
//                       )}
//                       {!Object.values(selectedStudent.flags || {}).some(Boolean) && (
//                         <span className="text-sm text-green-600 font-medium">✓ No flags raised — student is performing well</span>
//                       )}
//                     </div>
//                   </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-gray-900 mb-3">Subject-wise Breakdown</h3>
//                 <div className="space-y-3">
//                   {selectedStudent.subjectBreakdown.map(subject => (
//                     <div key={subject.subject} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                       <div className="flex justify-between items-center mb-2">
//                         <h4 className="font-bold text-gray-900">{subject.subject}</h4>
//                         <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                           subject.avgScore >= 80 ? 'bg-green-200 text-green-800' :
//                           subject.avgScore >= 60 ? 'bg-blue-200 text-blue-800' :
//                           subject.avgScore >= 40 ? 'bg-yellow-200 text-yellow-800' :
//                           'bg-red-200 text-red-800'
//                         }`}>
//                           {subject.avgScore}%
//                         </span>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4 text-sm">
//                         <div>
//                           <span className="text-gray-600">Videos Watched:</span>
//                           <span className="ml-2 font-semibold">{subject.videos}</span>
//                         </div>
//                         <div>
//                           <span className="text-gray-600">Tests Taken:</span>
//                           <span className="ml-2 font-semibold">{subject.tests}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Proctoring Reports */}
// <div>
//   <div className="flex items-center justify-between mb-3">
//     <h3 className="text-lg font-bold text-gray-900">Proctoring Reports</h3>
//   </div>
//   {(() => {
//     const allKeys = Object.keys(localStorage);
//     // Find all AP sessions for this student across all videos
//     const apSessions = allKeys
//       .filter(k => k.startsWith(`ap_session_${selectedStudent.email}_`))
//       .map(k => {
//         const parts = k.replace(`ap_session_${selectedStudent.email}_`, '').split('_');
//         const checkpoint = parts[parts.length - 1];
//         const videoId = parts.slice(0, -1).join('_');
//         const data = JSON.parse(localStorage.getItem(k) || '{}');
//         return { videoId, checkpoint, ...data };
//       });

//     if (apSessions.length === 0) {
//       return <p className="text-sm text-gray-500">No proctored test sessions recorded for this student yet.</p>;
//     }

//     // Group by videoId
//     const byVideo = {};
//     apSessions.forEach(s => {
//       if (!byVideo[s.videoId]) byVideo[s.videoId] = [];
//       byVideo[s.videoId].push(s);
//     });

//     return (
//       <div className="space-y-2">
//         {Object.entries(byVideo).map(([vid, sessions]) => (
//           <div key={vid} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-semibold text-gray-800">{vid}</p>
//               <p className="text-xs text-gray-500">{sessions.length} checkpoint session{sessions.length > 1 ? 's' : ''} recorded</p>
//             </div>
//             <button
//               onClick={() => {
//                 setSelectedStudent(null);
//                 setProctoringReport({ email: selectedStudent.email, videoId: vid });
//               }}
//               className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors"
//             >
//               View Report
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   })()}
// </div>
//         </div>
//       )}

//       {/* Proctoring Report Modal */}
// {proctoringReport && (
//   <ProctoringReportViewer
//     studentEmail={proctoringReport.email}
//     videoId={proctoringReport.videoId || Object.keys(localStorage)
//       .filter(k => k.startsWith(`ap_session_${proctoringReport.email}_`))
//       .map(k => k.replace(`ap_session_${proctoringReport.email}_`, '').split('_').slice(0,-1).join('_'))[0] || ''}
//     onClose={() => setProctoringReport(null)}
//   />
// )}
//     </div>
//   );
// };

// ==================== LECTURE DETAIL COMPONENTS ====================

// const LectureDetailView = ({ lecture, showTranscript, setShowTranscript, activeTab, setActiveTab }) => (
//   <div className="p-6">
// <Breadcrumb onBack={onBack} lectureTitle={lecture.title} />
//     <LectureHeader lecture={lecture} />

//     <div className="flex gap-6">
//      <div className="flex-1">
// <VideoPlayer videoId={lecture.videoId} videoRef={videoRef} userEmail={userEmail} lecture={lecture} />  <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
// </div>

//       {showTranscript && <TranscriptPanel setShowTranscript={setShowTranscript} />}
//     </div>
//   </div>
// );
const PersonalizedRevision = ({ userEmail }) => {
  const [flashcards, setFlashcards]               = useState([]);
  const [revisionTests, setRevisionTests]         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [activeView, setActiveView]               = useState('flashcards');
  const [currentCardIndex, setCurrentCardIndex]   = useState(0);
  const [flippedCards, setFlippedCards]           = useState(new Set());
  const [masteredCards, setMasteredCards]         = useState(new Set());
  const [revisionAnswers, setRevisionAnswers]     = useState({});
  const [showRevisionResults, setShowRevisionResults] = useState(false);

  // ── NEW states for personalized weak-node revision ──
  const [personalizedNote, setPersonalizedNote]   = useState(null);
  const [weakNodesBanner, setWeakNodesBanner]     = useState([]);
  const [isPersonalized, setIsPersonalized]       = useState(false);

  useEffect(() => {
    generatePersonalizedContent();
  }, [userEmail]);

  const generatePersonalizedContent = async () => {
    try {
      setLoading(true);

      const allKeys    = Object.keys(localStorage);
      const testResults = allKeys
        .filter(key => key.startsWith(`test_result_${userEmail}_`))
        .map(key => {
          try { return JSON.parse(localStorage.getItem(key)); }
          catch (e) { return null; }
        })
        .filter(Boolean);

      const watchHistory = JSON.parse(
        localStorage.getItem(`watch_history_${userEmail}`) 
      );

      if (testResults.length === 0 && watchHistory.length === 0) {
        setLoading(false);
        return;
      }

      // ── Identify weak topics from wrong answers ──
      const weakTopics = [];
      testResults.forEach(test => {
        Object.entries(test.evaluations || {}).forEach(([qId, evaluation]) => {
          if (!evaluation.isCorrect) {
            weakTopics.push({
              subject: test.subject,
              videoId: test.videoId,
              score:   evaluation.score || 0
            });
          }
        });
      });

      // ── Collect unique videoIds (weak first, then recent) ──
      const uniqueVideoIds = [
        ...new Set([
          ...weakTopics.map(t => t.videoId),
          ...watchHistory.slice(0, 3).map(v => v.videoId)
        ])
      ].filter(Boolean);

      if (uniqueVideoIds.length === 0) {
        setLoading(false);
        return;
      }

      // ── Generate flashcards ──
      const flashcardsArrays = await Promise.all(
        uniqueVideoIds.slice(0, 3).map(async (videoId) => {
          try {
            const res = await fetch(`${API_BASE}/get-transcript/${videoId}`);
            if (!res.ok) return [];
            const transcript = await res.json();
            return generateFlashcardsForVideo(transcript, videoId);
          } catch (err) {
            console.error(`Flashcard error for ${videoId}:`, err);
            return [];
          }
        })
      );
      setFlashcards(flashcardsArrays.flat().filter(Boolean));

      // ── Generate revision test for first/weakest video ──
      const primaryVideoId = uniqueVideoIds[0];
      const weakAreas      = [...new Set(weakTopics.map(t => t.subject).filter(Boolean))];
      await generateRevisionTest(primaryVideoId, weakAreas);

    } catch (error) {
      console.error('PersonalizedRevision error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateFlashcardsForVideo = async (transcript, videoId) => {
    try {
      const res = await fetch(`${API_BASE}/generate-flashcards`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          transcript: transcript.segments.map(s => s.text).join(' '),
          videoId
        })
      });
      const data = await res.json();
      if (data.success) {
        return data.flashcards.map((card, idx) => ({
          ...card,
          id:      `${videoId}_${idx}`,
          videoId
        }));
      }
    } catch (err) {
      console.error('Flashcard generation error:', err);
    }
    return [];
  };

  // ── FIXED: generateRevisionTest ──────────────────────────────────────────────
  // Previously broken: state setters called before response parsed, weakAreas undefined
  const generateRevisionTest = async (videoId, weakAreas = []) => {
    try {
      // Step 1: fetch transcript
      const transcriptRes = await fetch(`${API_BASE}/get-transcript/${videoId}`);
      if (!transcriptRes.ok) return;
      const transcript = await transcriptRes.json();

      // Step 2: call revision endpoint with ALL required fields
      const revisionRes = await fetch(`${API_BASE}/generate-revision-test`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          transcript:   transcript.segments.map(s => s.text).join(' '),
          videoId,
          studentEmail: userEmail,      // ← so backend loads weak nodes
          weakAreas,                    // ← from wrong answers
          generateNotes: true           // ← get personalized note
        })
      });

      // Step 3: parse response FIRST, then update state
      const data = await revisionRes.json();

      if (!data.success) {
        console.error('Revision test failed:', data.error);
        return;
      }

      // Step 4: update all states from parsed data
      setRevisionTests(data.questions || []);

      if (data.personalized_note) {
        setPersonalizedNote(data.personalized_note);
      }

      if (data.personalized && data.weak_nodes_used?.length > 0) {
        setWeakNodesBanner(data.weak_nodes_used);
        setIsPersonalized(true);
      }

    } catch (err) {
      console.error('Revision test generation error:', err);
    }
  };

  // ── Card helpers ─────────────────────────────────────────────────────────────
  const flipCard = (index) => {
    setFlippedCards(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const markAsMastered = (index) => {
    setMasteredCards(prev => new Set(prev).add(index));
    if (index < flashcards.length - 1) setCurrentCardIndex(index + 1);
  };

  const handleRevisionAnswer = (questionId, answer) => {
    setRevisionAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const evaluateRevisionAnswer = (question) => {
    const ua = revisionAnswers[question.id];
    if (question.type === 'mcq')        return ua === question.correctAnswer;
    if (question.type === 'fill-blank') return ua?.toLowerCase().trim() === question.answer?.toLowerCase().trim();
    return false;
  };

  const retakeTest = () => {
    setShowRevisionResults(false);
    setRevisionAnswers({});
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="animate-spin mx-auto text-purple-600" size={48} />
        <p className="text-gray-600 mt-4 font-medium">Generating personalized revision content...</p>
        <p className="text-gray-400 text-sm mt-1">Checking your replay habits and weak areas...</p>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (flashcards.length === 0 && revisionTests.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-300">
        <Bookmark size={64} className="mx-auto text-purple-400 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Revision Content Yet</h3>
        <p className="text-gray-500">Watch videos and take tests to get personalized flashcards and revision tests!</p>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-1">📚 Personalized Revision</h2>
        <p className="text-purple-100 text-sm">
          {isPersonalized
            ? `Tailored to your weak sections: ${weakNodesBanner.slice(0, 2).join(', ')}${weakNodesBanner.length > 2 ? '...' : ''}`
            : 'Flashcards and tests tailored to your learning needs'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 bg-white rounded-xl p-2 shadow border border-gray-200">
        <button
          onClick={() => setActiveView('flashcards')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeView === 'flashcards'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎴 Flashcards ({flashcards.length})
        </button>
        <button
          onClick={() => setActiveView('revision')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeView === 'revision'
              ? 'bg-pink-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          📝 Revision Test ({revisionTests.length})
          {isPersonalized && (
            <span className="ml-2 text-xs bg-white/30 px-1.5 py-0.5 rounded-full">🎯</span>
          )}
        </button>
      </div>

      {/* ── FLASHCARDS VIEW ── */}
      {activeView === 'flashcards' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-6 shadow border-2 border-purple-200">

            {/* Progress header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Mastered: {masteredCards.size}/{flashcards.length}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentCardIndex(i => Math.max(0, i - 1))}
                  disabled={currentCardIndex === 0}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setCurrentCardIndex(i => Math.min(flashcards.length - 1, i + 1))}
                  disabled={currentCardIndex === flashcards.length - 1}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${flashcards.length ? (masteredCards.size / flashcards.length) * 100 : 0}%` }}
              />
            </div>

            {flashcards[currentCardIndex] && (
              <div className="space-y-4">
                {/* Card face */}
                <div
                  onClick={() => flipCard(currentCardIndex)}
                  className="cursor-pointer"
                  style={{ minHeight: '280px' }}
                >
                  {!flippedCards.has(currentCardIndex) ? (
                    <div className="w-full bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[280px]">
                      <p className="text-xs uppercase tracking-widest mb-4 opacity-70">Question</p>
                      <h3 className="text-xl font-bold text-center leading-relaxed">
                        {flashcards[currentCardIndex].question}
                      </h3>
                      <p className="text-xs mt-8 opacity-60">Tap to reveal answer</p>
                    </div>
                  ) : (
                    <div className="w-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-8 shadow-xl flex flex-col items-center justify-center min-h-[280px]">
                      <p className="text-xs uppercase tracking-widest mb-4 opacity-70">Answer</p>
                      <p className="text-lg text-center leading-relaxed font-medium">
                        {flashcards[currentCardIndex].answer}
                      </p>
                      {flashcards[currentCardIndex].explanation && (
                        <p className="text-sm mt-4 opacity-80 italic text-center border-t border-white/20 pt-4">
                          {flashcards[currentCardIndex].explanation}
                        </p>
                      )}
                      <p className="text-xs mt-6 opacity-50">Tap to flip back</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                {flippedCards.has(currentCardIndex) && !masteredCards.has(currentCardIndex) && (
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => markAsMastered(currentCardIndex)}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={18} /> I Know This!
                    </button>
                    <button
                      onClick={() => {
                        flipCard(currentCardIndex);
                        setCurrentCardIndex(i => Math.min(flashcards.length - 1, i + 1));
                      }}
                      className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 shadow transition-all"
                    >
                      Review Later
                    </button>
                  </div>
                )}

                {masteredCards.has(currentCardIndex) && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle className="mx-auto text-green-600 mb-1" size={28} />
                    <p className="text-green-800 font-bold">Mastered ✓</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── REVISION TEST VIEW ── */}
      {activeView === 'revision' && (
        <div className="space-y-5">

          {/* Personalized weak-node banner */}
          {weakNodesBanner.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-1">
                🎯 Personalized Revision
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                These questions focus on sections you replayed or asked about repeatedly:
                <span className="font-semibold"> {weakNodesBanner.join(', ')}</span>
              </p>
            </div>
          )}

          {/* Personalized note */}
          {personalizedNote && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <p className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                📝 Your Personal Revision Notes
              </p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
                {personalizedNote}
              </p>
            </div>
          )}

          {!showRevisionResults ? (
            <div className="bg-white rounded-xl p-6 shadow border-2 border-pink-200">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {isPersonalized ? '🎯 Targeted Revision Test' : 'Quick Revision Test'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {isPersonalized
                  ? 'Questions drawn from the specific sections you struggled with.'
                  : 'This test focuses on topics where you need more practice.'}
              </p>

              <div className="space-y-6">
                {revisionTests.map((question, idx) => (
                  <div key={question.id} className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-base font-medium text-gray-900">{question.question}</p>
                        {question.weak_node && (
                          <p className="text-xs text-amber-600 mt-1 font-medium">
                            📖 {question.weak_node}
                          </p>
                        )}
                      </div>
                    </div>

                    {question.type === 'mcq' && (
                      <div className="space-y-2 ml-11">
                        {question.options.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => handleRevisionAnswer(question.id, optIdx)}
                            className={`w-full text-left px-4 py-3 border-2 rounded-xl transition-all text-sm ${
                              revisionAnswers[question.id] === optIdx
                                ? 'border-pink-500 bg-pink-50 font-medium'
                                : 'border-gray-200 hover:border-pink-300 bg-white'
                            }`}
                          >
                            <span className="font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                            {option}
                          </button>
                        ))}
                      </div>
                    )}

                    {question.type === 'fill-blank' && (
                      <div className="ml-11">
                        <input
                          type="text"
                          value={revisionAnswers[question.id] || ''}
                          onChange={e => handleRevisionAnswer(question.id, e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-sm transition-colors"
                          placeholder="Type your answer here..."
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRevisionResults(true)}
                disabled={Object.keys(revisionAnswers).length < revisionTests.length}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Submit Test ({Object.keys(revisionAnswers).length}/{revisionTests.length} answered)
              </button>
            </div>
          ) : (
            /* Results */
            <div className="bg-white rounded-xl p-6 shadow border-2 border-green-200 space-y-5">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <CheckCircle className="text-green-600" size={28} />
                Test Results
              </h3>

              {(() => {
                const correct    = revisionTests.filter(q => evaluateRevisionAnswer(q)).length;
                const total      = revisionTests.length;
                const percentage = total ? ((correct / total) * 100).toFixed(1) : 0;

                return (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Correct',   value: correct,          color: 'text-green-600', bg: 'bg-green-50',  border: 'border-green-200' },
                        { label: 'Incorrect', value: total - correct,   color: 'text-red-600',   bg: 'bg-red-50',    border: 'border-red-200'   },
                        { label: 'Score',     value: `${percentage}%`,  color: 'text-blue-600',  bg: 'bg-blue-50',   border: 'border-blue-200'  }
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
                          <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {revisionTests.map((question, idx) => {
                        const isCorrect = evaluateRevisionAnswer(question);
                        return (
                          <div
                            key={question.id}
                            className={`rounded-xl p-4 border-2 ${
                              isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {isCorrect
                                ? <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                : <XCircle    className="text-red-600   flex-shrink-0 mt-0.5" size={20} />}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm mb-1">{question.question}</p>

                                {question.weak_node && (
                                  <p className="text-xs text-amber-600 mb-2">📖 {question.weak_node}</p>
                                )}

                                <p className="text-xs text-gray-600">
                                  <strong>Your answer:</strong>{' '}
                                  {question.type === 'mcq'
                                    ? (question.options?.[revisionAnswers[question.id]] ?? 'Not answered')
                                    : (revisionAnswers[question.id] || 'Not answered')}
                                </p>

                                {!isCorrect && (
                                  <p className="text-xs text-gray-700 mt-1">
                                    <strong>Correct:</strong>{' '}
                                    {question.type === 'mcq'
                                      ? question.options?.[question.correctAnswer]
                                      : question.answer}
                                  </p>
                                )}

                                {question.explanation && (
                                  <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-200 pt-2">
                                    💡 {question.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={retakeTest}
                      className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all"
                    >
                      Retake Test
                    </button>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== CHECKPOINT MODAL (Non-Skippable Proctored Test) ====================

const CheckpointModal = ({ checkpoint, transcript, videoId, userEmail, onComplete, videoRef }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('requesting_permissions'); // requesting_permissions | proctoring_setup | active | submitted
  const [score, setScore] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime] = useState(Date.now());
  const [proctoringError, setProctoringError] = useState(null);
  const [proctoringViolations, setProctoringViolations] = useState([]);
  const apRef = useRef(null);
  const containerRef = useRef(null);

  const CHECKPOINT_CONFIG = {
    alpha: { bloomLevel: 1, numQuestions: 3, label: 'Checkpoint 1 — 25%', subtitle: 'Recall questions from the first quarter of the lecture', color: '#2563EB' },
    beta:  { bloomLevel: 2, numQuestions: 3, label: 'Checkpoint 2 — 60%', subtitle: 'Understanding questions from the middle section', color: '#7C3AED' },
    omega: { bloomLevel: 3, numQuestions: 4, label: 'Final Checkpoint',    subtitle: 'Application questions covering the full lecture', color: '#0F172A' },
  };
  const config = CHECKPOINT_CONFIG[checkpoint] || CHECKPOINT_CONFIG.alpha;

  useEffect(() => {
    // Request fullscreen immediately when modal opens
    if (videoRef?.current) {
      videoRef.current.pause();
      console.log('[Checkpoint] Video paused for test');
    }
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();

    fetchQuestions();

    return () => {
      // Exit fullscreen when modal closes
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const segments = transcript?.segments || [];
      const total = segments.length;
      const zones = {
        alpha: [0, Math.floor(total * 0.25)],
        beta:  [Math.floor(total * 0.25), Math.floor(total * 0.6)],
        omega: [Math.floor(total * 0.6), total]
      };
      const [s, e] = zones[checkpoint] || [0, total];
      const zoneText = segments.slice(s, e).map(seg => seg.text).join(' ');

      const res = await fetch(`${API_BASE}/generate-blooms-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: zoneText || transcript?.full_text || '',
          bloomLevel: config.bloomLevel,
          numQuestions: config.numQuestions,
          checkpoint
        })
      });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setLoading(false);
        // Now init AutoProctor
        await initAutoProctor();
      }
    } catch (err) {
      console.error('Failed to fetch checkpoint questions:', err);
      setLoading(false);
      setPhase('active'); // Degrade gracefully
    }
  };

  const initAutoProctor = async () => {
    try {
      // ── Request camera + mic permissions explicitly first ──
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (permErr) {
        setProctoringError('Camera/microphone permission denied. Proctoring is required to take this test. Please allow access and refresh.');
        setPhase('proctoring_setup');
        return;
      }

      setPhase('proctoring_setup');

      if (!window.AutoProctor) {
        // AutoProctor script not loaded — proceed without proctoring
        console.warn('AutoProctor not loaded');
        setPhase('active');
        return;
      }

      const CLIENT_ID = 'Kny9rqZq';
      const CLIENT_SECRET =  'kS2AGg11LgmiWST';
      const TEST_ATTEMPT_ID = `${userEmail}_${videoId}_${checkpoint}_${Date.now()}`;

      // Compute HMAC-SHA256 hash
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw', enc.encode(CLIENT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
      );
      const sig = await crypto.subtle.sign('HMAC', key, enc.encode(TEST_ATTEMPT_ID));
      const hashedTestAttemptId = btoa(String.fromCharCode(...new Uint8Array(sig)));

      const credentials = { clientId: CLIENT_ID, testAttemptId: TEST_ATTEMPT_ID, hashedTestAttemptId };

      const proctoringOptions = {
        trackingOptions: {
          audio: true,          // Detect background noise / verbal help
          numHumans: true,       // Detect multiple faces or absence
          tabSwitch: true,       // Detect switching to other tabs/windows
          photosAtRandom: true,  // Random snapshots for teacher report
        }
      };

      apRef.current = new window.AutoProctor(credentials);
      await apRef.current.setup(proctoringOptions);
      apRef.current.start();

      // Save testAttemptId for teacher report
      localStorage.setItem(
        `ap_session_${userEmail}_${videoId}_${checkpoint}`,
        JSON.stringify({ testAttemptId: TEST_ATTEMPT_ID, clientId: CLIENT_ID, startedAt: new Date().toISOString() })
      );

      // Show test content only once proctoring is confirmed active
      window.addEventListener('apMonitoringStarted', () => {
        setPhase('active');
      }, { once: true });

      // Track violations
      window.addEventListener('apViolation', (e) => {
        setProctoringViolations(prev => [...prev, { type: e.detail?.type, time: new Date().toLocaleTimeString() }]);
      });

      // Fallback: if apMonitoringStarted never fires within 8s, proceed anyway
      setTimeout(() => {
        setPhase(p => p === 'proctoring_setup' ? 'active' : p);
      }, 8000);

    } catch (err) {
      console.warn('AutoProctor init error:', err);
      setPhase('active');
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeTaken(elapsed);

    let correct = 0;
    let bloomL1 = 0, bloomL2 = 0, bloomL1Total = 0, bloomL2Total = 0;
    questions.forEach(q => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) correct++;
      if (q.bloomLevel <= 1) { bloomL1Total++; if (isCorrect) bloomL1++; }
      if (q.bloomLevel <= 2) { bloomL2Total++; if (isCorrect) bloomL2++; }
    });

    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setPhase('submitted');

    // Save attempt
    const attemptData = {
      checkpoint, videoId, userEmail, score: pct,
      correctAnswers: correct, totalQuestions: questions.length,
      bloomLevel: config.bloomLevel,
      bloomL1Score: bloomL1Total > 0 ? bloomL1 / bloomL1Total : 0,
      bloomL2Score: bloomL2Total > 0 ? bloomL2 / bloomL2Total : 0,
      timeTaken: elapsed, answers,
      violations: proctoringViolations,
      completedAt: new Date().toISOString()
    };

    // 1. Save AP session
  const sessionKey = `ap_session_${userEmail}_${videoId}_${checkpoint}`;
  localStorage.setItem(sessionKey, JSON.stringify({
    checkpoint,
    videoId,
    score:        pct,
    violations:   proctoringViolations.length,
    violationLog: proctoringViolations,
    bloomLevel:   config.bloomLevel,
    answers:      answers,
    timeTaken:    elapsed,
    startedAt:    new Date(startTime).toISOString(),
    stoppedAt:    new Date().toISOString()
  }));

  // 2. Save to Bloom's checkpoint log (used by TeacherStudentDetail Bloom's tab)
  const existing = JSON.parse(localStorage.getItem(`checkpoints_${userEmail}`) || '[]');
  existing.push({
    checkpoint, videoId, score: pct,
    bloomLevel: config.bloomLevel, timeTaken: elapsed,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem(`checkpoints_${userEmail}`, JSON.stringify(existing));

  // 3. Notify teacher — bell will show red badge
  notifyTeacher(userEmail, videoId, checkpoint, pct, proctoringViolations.length, config.bloomLevel);


    localStorage.setItem(`cp_attempt_${userEmail}_${videoId}_${checkpoint}_${Date.now()}`, JSON.stringify(attemptData));

    // Update class averages
    const classAvgKey = `class_avg_${videoId}`;
    const ca = JSON.parse(localStorage.getItem(classAvgKey) || '{"score":65,"timeTaken":120,"replayCount":2,"count":0}');
    const nc = ca.count + 1;
    localStorage.setItem(classAvgKey, JSON.stringify({ score: ((ca.score * ca.count) + pct) / nc, timeTaken: ((ca.timeTaken * ca.count) + elapsed) / nc, replayCount: ca.replayCount, count: nc }));

    // Stop AutoProctor
    if (apRef.current) {
      try {
        apRef.current.stop();
        // Save the stop event for teacher report access
        window.addEventListener('apMonitoringStopped', () => {
          const apSession = JSON.parse(localStorage.getItem(`ap_session_${userEmail}_${videoId}_${checkpoint}`) || '{}');
          apSession.stoppedAt = new Date().toISOString();
          apSession.score = pct;
          apSession.violations = proctoringViolations.length;
          localStorage.setItem(`ap_session_${userEmail}_${videoId}_${checkpoint}`, JSON.stringify(apSession));
        }, { once: true });
      } catch (e) {}
    }

      // 4. Exit fullscreen
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

  // 5. Resume video is NOT automatic — student clicks play
  onComplete({ checkpoint, score: pct });
  };

  const handleDone = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    onComplete({ checkpoint, score });
  };

  // ── Phases ──────────────────────────────────────────────────────────────────

  if (phase === 'requesting_permissions' || (loading && phase !== 'active')) {
    return (
      <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-white text-lg font-semibold mb-2">Preparing checkpoint test</p>
        <p className="text-gray-400 text-sm">Generating questions and requesting camera access...</p>
      </div>
    );
  }

  if (proctoringError) {
    return (
      <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Camera Access Required</h2>
          <p className="text-gray-600 text-sm mb-6">{proctoringError}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
            Refresh & Try Again
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'proctoring_setup') {
    return (
      <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <p className="text-white text-xl font-bold mb-2">Starting Proctored Test</p>
          <p className="text-gray-400 text-sm mb-1">Allow camera and microphone access when prompted</p>
          <p className="text-gray-500 text-xs">This test is monitored. Tab switching and multiple faces will be flagged.</p>
          <div className="flex justify-center mt-6 gap-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'active') {
    return (
      <div ref={containerRef} className="fixed inset-0 bg-gray-950 z-50 flex flex-col" id="checkpoint-fullscreen">
        {/* Top bar */}
        <div style={{ backgroundColor: config.color }} className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">{config.label}</h1>
            <p className="text-white text-opacity-80 text-sm">{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            {proctoringViolations.length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {proctoringViolations.length} violation{proctoringViolations.length > 1 ? 's' : ''} flagged
              </span>
            )}
            <div className="flex items-center gap-2 bg-black bg-opacity-30 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-white text-xs font-semibold">Proctoring Active</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-300 text-sm">
                <span className="font-semibold text-white">Instructions:</span> Answer all {questions.length} questions. You cannot skip or come back — answer each one before moving to the next. Your screen is being monitored.
              </p>
            </div>

            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">Question {idx + 1} of {questions.length}</span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                    Level {q.bloomLevel} — {['','Remember','Understand','Apply','Analyze'][q.bloomLevel] || ''}
                  </span>
                </div>
                <div className="px-6 py-5">
                  <p className="text-gray-900 font-semibold text-base mb-5 leading-relaxed">{q.question}</p>
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all font-medium text-sm ${
                          answers[q.id] === optIdx
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <span className="inline-flex w-6 h-6 items-center justify-center bg-gray-100 rounded-full text-xs font-bold mr-3">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full py-4 font-bold text-white rounded-2xl transition-all text-base shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: Object.keys(answers).length >= questions.length ? config.color : '#6B7280' }}
            >
              {Object.keys(answers).length < questions.length
                ? `Answer all questions (${Object.keys(answers).length}/${questions.length})`
                : 'Submit Checkpoint Test'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results phase ────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-8 py-6 text-center" style={{ backgroundColor: config.color }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <span className="text-3xl font-black text-white">{score}%</span>
          </div>
          <h2 className="text-white text-xl font-bold">
            {score >= 70 ? 'Checkpoint Passed' : score >= 50 ? 'Submitted' : 'Review Needed'}
          </h2>
          <p className="text-white text-opacity-80 text-sm mt-1">{config.label}</p>
        </div>

        <div className="px-8 py-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Score', value: `${score}%` },
              { label: 'Time', value: `${timeTaken}s` },
              { label: 'Violations', value: proctoringViolations.length }
            ].map(s => (
              <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">{s.label}</p>
                <p className="text-lg font-bold text-gray-800">{s.value}</p>
              </div>
            ))}
          </div>

          {score < 60 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">Review recommended</p>
              <p>Check the Practice tab to revisit the concepts covered in this section. Your teacher has been notified.</p>
            </div>
          )}

          {proctoringViolations.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
              <p className="font-semibold mb-1">{proctoringViolations.length} monitoring event(s) recorded</p>
              <p>These have been flagged for your teacher's review.</p>
            </div>
          )}

          {/* Per-question results */}
          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.correctAnswer;
              return (
                <div key={q.id} className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCorrect ? <Check size={12} color="white" strokeWidth={3} /> : <X size={12} color="white" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 mb-1">{q.question}</p>
                      {!isCorrect && (
                        <p className="text-xs text-gray-600">
                          Correct: <span className="font-semibold text-green-700">{q.options[q.correctAnswer]}</span>
                        </p>
                      )}
                      {q.explanation && <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={handleDone} className="w-full py-3.5 font-bold text-white rounded-xl transition-all" style={{ backgroundColor: config.color }}>
            Continue Watching →
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGEINDEX RAG — CONCEPT EXPLANATION PANEL ====================
const ConceptExplanationPanel = ({ question, userAnswer, videoId, videoRef, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('explanation'); // explanation | rag_trace

  useEffect(() => { fetchExplanation(); }, []);

  const fetchExplanation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/explain-missed-concept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          questionText: question.question,
          correctAnswer: question.type === 'mcq' ? question.options?.[question.correctAnswer] : question.answer,
          studentAnswer: question.type === 'mcq' ? question.options?.[userAnswer] : userAnswer,
          bloomLevel: question.bloomLevel || 2
        })
      });
      const data = await res.json();
      if (data.success) setResult(data);
    } catch (err) {
      console.error('Concept explanation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const seekTo = (seconds) => {
    if (videoRef?.current) {
      videoRef.current.currentTime = parseFloat(seconds) || 0;
      videoRef.current.play();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl overflow-hidden shadow-2xl max-h-screen md:max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Concept Review</p>
            <h3 className="text-white font-bold text-base">Let's revisit this concept</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[
            { key: 'explanation', label: 'Explanation' },
            { key: 'rag_trace',   label: 'How it was found' }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-sm">Searching lecture for this concept...</p>
              <p className="text-gray-400 text-xs mt-1">Using RAG to find where your teacher explained this</p>
            </div>
          ) : !result ? (
            <div className="p-6 text-center text-gray-500">Could not load explanation.</div>
          ) : activeTab === 'explanation' ? (
            <div className="p-6 space-y-5">
              {/* What went wrong */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs text-red-600 font-semibold uppercase mb-2">Question</p>
                <p className="text-sm text-gray-800 font-medium">{question.question}</p>
                {question.type === 'mcq' && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <p className="text-xs text-gray-500">Your answer: <span className="font-semibold text-red-600">{question.options?.[userAnswer] || '—'}</span></p>
                    <p className="text-xs text-gray-500">Correct answer: <span className="font-semibold text-green-600">{question.options?.[question.correctAnswer]}</span></p>
                  </div>
                )}
              </div>

              {/* Explanation from lecture */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen size={12} color="white" />
                  </div>
                  <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">From your lecture</p>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{result.explanation?.explanation}</p>
              </div>

              {/* Key takeaway */}
              {result.explanation?.key_takeaway && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs text-amber-700 font-semibold uppercase mb-1">Key point to remember</p>
                  <p className="text-sm font-semibold text-gray-800">{result.explanation.key_takeaway}</p>
                </div>
              )}

              {/* Jump to lecture */}
              {result.explanation?.source_timestamp && result.explanation.source_timestamp !== '0:00:00' && (
                <button
                  onClick={() => {
                    const chunk = result.retrieved_chunks?.[0];
                    seekTo(chunk?.start_seconds || 0);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors"
                >
                  <Play size={16} />
                  Watch this part in the lecture — {result.explanation.source_timestamp}
                </button>
              )}
            </div>
          ) : (
            /* RAG Trace tab — visualizes how PageIndex/keyword search found the content */
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Retrieval method</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${result.retrieval_source === 'pageindex' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {result.retrieval_source === 'pageindex' ? '⚡ PageIndex Semantic Search' : '🔍 Keyword Search'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {result.retrieval_source === 'pageindex'
                    ? 'PageIndex semantically matched your question against the indexed transcript using vector embeddings.'
                    : 'Keyword search scanned the transcript segments for words from the question and correct answer.'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                  {result.retrieved_chunks?.length || 0} transcript chunks retrieved
                </p>
                <div className="space-y-3">
                  {(result.retrieved_chunks || []).map((chunk, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {i + 1}
                          </span>
                          {chunk.start_time && (
                            <span className="text-xs font-mono text-gray-500 font-semibold">{chunk.start_time}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((chunk.score || 0) * 100)}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{Math.round((chunk.score || 0) * 100)}% match</span>
                        </div>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{chunk.text}</p>
                        {(result.retrieved_chunks || []).map((chunk, i) => (
  <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{i+1}</span>
        {/* Show section path for tree chunks, timestamp for transcript chunks */}
        {chunk.source === 'local_tree' ? (
          <span className="text-xs text-blue-700 font-semibold">{chunk.section || chunk.title}</span>
        ) : (
          chunk.start_time && <span className="text-xs font-mono text-gray-500">{chunk.start_time}</span>
        )}
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          chunk.source === 'local_tree' ? 'bg-green-100 text-green-700' :
          chunk.source === 'transcript' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-500'
        }`}>
          {chunk.source === 'local_tree' ? '📚 Textbook' :
           chunk.source === 'transcript' ? '🎥 Lecture' : 'Fallback'}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-gray-200 rounded-full">
          <div className="h-full bg-blue-500 rounded-full" style={{width:`${Math.min(Math.round((chunk.score||0)*100),100)}%`}}></div>
        </div>
        <span className="text-xs text-gray-400 font-mono">{Math.min(Math.round((chunk.score||0)*100),100)}%</span>
      </div>
    </div>
    <div className="px-4 py-3">
      <p className="text-sm text-gray-700 leading-relaxed">{chunk.text}</p>
      {chunk.source === 'transcript' && chunk.start_time && (
        <button onClick={() => seekTo(chunk.start_seconds || 0)}
          className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
          <Play size={11}/> Jump to {chunk.start_time} in lecture
        </button>
      )}
    </div>
  </div>
))}

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-800">
                <p className="font-semibold mb-1">How this works</p>
                <p>These chunks were retrieved from your lecture transcript. They were then passed to Gemini to generate the explanation — so the answer is grounded in what your teacher actually said, not general knowledge.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LectureDetailWithVideo = ({ lecture, onBack, userEmail, userType }) => {
  const [showTranscript, setShowTranscript] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const [concepts, setConcepts] = useState(null);
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  // useReplayTracker(videoRef, videoId, userEmail);


  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/get-transcript/${lecture.videoId}`);

      if (response.ok) {
        const data = await response.json();
        setTranscript(data);
        await fetchOrLoadLectureData(data.full_text);
      } else {
        throw new Error('Transcript not found');
      }
    } catch (err) {
      console.error('Error fetching transcript:', err);
      setError('Could not load transcript.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrLoadLectureData = async (transcriptText) => {
    const cacheKey = `lecture_${lecture.videoId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      console.log('Loaded lecture data from cache.');
      const data = JSON.parse(cached);
      setSummary(data.summary);
      setConcepts(data.concepts);
      setPractice(data.practice);
      return;
    }

    // Otherwise, call APIs once and cache
    console.log('Generating summary, concepts, and practice...');
    const [summaryRes, conceptRes, practiceRes] = await Promise.all([
      fetch(`${API_BASE}/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: lecture.videoId, transcript: transcriptText }),
      }),
      fetch(`${API_BASE}/generate-concepts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText }),
      }),
      fetch(`${API_BASE}/generate-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText }),
      }),
    ]);

    const summaryData = await summaryRes.json();
    const conceptData = await conceptRes.json();
    const practiceData = await practiceRes.json();

    const dataToCache = {
      summary: summaryData.summary,
      concepts: conceptData.concepts,
      practice: practiceData.questions,
      cachedAt: new Date().toISOString(),
    };

    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
    setSummary(dataToCache.summary);
    setConcepts(dataToCache.concepts);
    setPractice(dataToCache.practice);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb onBack={onBack} lectureTitle={lecture.title} />
        <LectureHeader lecture={lecture} />

        <div className="flex gap-6">
          <div className="flex-1">
<VideoPlayer videoId={lecture.videoId} videoRef={videoRef} userEmail={userEmail} lecture={lecture} />
<TabsSection
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  transcript={transcript}
  lecture={lecture}
  summary={summary}
  concepts={concepts}
  practice={practice}
  videoRef={videoRef}
  userEmail={userEmail}
  userType={userType}
/>
          </div>

          {showTranscript && (
            <TranscriptPanel
              setShowTranscript={setShowTranscript}
              transcript={transcript}
              loading={loading}
              error={error}
              videoRef={videoRef}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Breadcrumb = ({ onBack, lectureTitle }) => (
  <div className="mb-4 flex items-center justify-between">
    <div className="text-sm text-gray-600">
      <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
      <ChevronRight size={16} className="inline mx-2" />
      <span 
        onClick={onBack}
        className="hover:text-blue-600 cursor-pointer"
      >
        Lectures
      </span>
      <ChevronRight size={16} className="inline mx-2" />
      <span className="text-blue-600">{lectureTitle}</span>
    </div>
  </div>
);

const LectureHeader = ({ lecture }) => (
  <div className="flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{lecture.title}</h1>
        {lecture.isLive && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
            ● LIVE
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
            {lecture.instructor.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="font-medium">{lecture.instructor}</span>
        </div>
        <span className="flex items-center gap-1">
          <span className="text-gray-400">●</span>
          {lecture.date}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {lecture.tag}
        </span>
      </div>
    </div>
    <button className="flex items-center gap-2 px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-lg border-2 border-blue-200 transition-colors">
      <Bookmark size={18} />
      <span className="font-semibold">BOOKMARK</span>
    </button>
  </div>
);

// ==================== NEW STUDENT DOCUMENT SCANNER COMPONENT ====================

const StudentDocumentScanner = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'correct', 'incorrect'

  // ---------------------------------------------------------
  // 1. DATA PARSING LOGIC (Transforms your API response)
  // ---------------------------------------------------------
  const parseExtractionData = (data) => {
    // Handle nested structures based on your JSON sample
    const rawExtraction = data.data?.extraction || data.data || {};
    
    // We need to group "question 1", "answer 1", "score 1" into a single object
    const groupedItems = {};

    Object.entries(rawExtraction).forEach(([key, value]) => {
      // Extract the number and the type (e.g., "question 1" -> type="question", id="1")
      const match = key.match(/([a-zA-Z]+)\s*(\d+)/); 
      if (match) {
        const [_, type, id] = match;
        if (!groupedItems[id]) groupedItems[id] = { id };
        groupedItems[id][type.toLowerCase()] = value;
      }
    });

    return Object.values(groupedItems);
  };

  // ---------------------------------------------------------
  // 2. MOCK DATA (For testing without backend)
  // ---------------------------------------------------------
  const MOCK_RESPONSE = {
    "success": true,
    "data": {
      "extraction": {
        "question 1": "8.] A diatomic gas having Cp = 3.5R and Cv = 2.5 R is heated at constant pressure. The ratio of constant ΔU: dQ:dW is",
        "answer 1": "1] 5:7:3",
        "score 1": 0,
        "explanation 1": "The ratio required is ΔU : Q : W. For constant pressure heating, this corresponds to Cv : Cp : R. Given the values, the ratio is 2.5R : 3.5R : R, which simplifies to 5:7:2. The selected option (5:7:3) is incorrect.",
        "question 2": "9.] In thermodynamics, heat and work are:",
        "answer 2": "1.) Path function",
        "score 2": 1,
        "explanation 2": "Heat and work are historically defined as path functions, meaning their values depend on the process path taken between two states. This is correct.",
        "question 3": "1.] Each side of a cubic metal sheet box is 'a' at temperature 'T'. The linear expansion coefficient of the sheet is 'α'. The metal box is heated uniformly by temperature ΔT. Calculate the increase in the volume of the metal box.",
        "answer 3": "4α 3³ dα t (Interpreted as $4 a^3 \\alpha \\Delta T$ or similar)",
        "score 3": 0,
        "explanation 3": "The correct formula for the increase in volume (ΔV) is ΔV = βV₀ΔT, where β (volumetric expansion) = 3α (linear expansion). Since V₀ = a³, the correct answer is 3a³αΔT. The student's answer contains a coefficient of 4 instead of 3, making it incorrect."
      },
      "ocr_metadata": { "page_count": 2, "confidence": 0.84 }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const processDocument = async () => {
    setLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
        setResult(parseExtractionData(MOCK_RESPONSE));
        setLoading(false);
    }, 1500);

    // --- REAL CODE (Uncomment when backend is fixed) ---
  /*
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', 'general');
      const response = await fetch('http://localhost:8000/api/v1/pipeline/process', { method: 'POST', body: formData });
      const data = await response.json();
      setResult(parseExtractionData(data));
    } catch (err) {
      console.error(err); 
      // Fallback to mock data on error so you can see UI
      setResult(parseExtractionData(MOCK_RESPONSE));
    } finally { setLoading(false); }
    */
  };

  // ---------------------------------------------------------
  // 3. UI COMPONENTS
  // ---------------------------------------------------------
  
  // Calculate Score
  const totalQuestions = result ? result.length : 0;
  const correctAnswers = result ? result.filter(i => i.score === 1).length : 0;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Filter Logic
  const filteredResult = result 
    ? result.filter(item => {
        if (activeFilter === 'correct') return item.score === 1;
        if (activeFilter === 'incorrect') return item.score === 0;
        return true;
      }) 
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <RefreshCw className={`text-indigo-600 ${loading ? 'animate-spin' : ''}`} size={32} />
            Smart Assessment Scanner
          </h1>
          <p className="text-gray-600 mt-1">Upload your answer sheet (PDF/Image) to get instant AI grading and feedback.</p>
        </div>
        
        {/* Upload Button (Hidden if result is shown, to keep UI clean) */}
        {!result && (
          <div className="relative group">
            <input 
              type="file" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg group-hover:bg-indigo-700 transition-all">
              <Upload size={20} />
              {file ? "Change File" : "Upload Answer Sheet"}
            </button>
            {file && <p className="text-xs text-center mt-2 text-indigo-600 font-medium">{file.name}</p>}
          </div>
        )}
      </div>

      {/* START SCREEN (Before Upload) */}
      {!result && !loading && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-indigo-400 transition-colors">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="text-indigo-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Grade?</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
                Upload a photo or PDF of your written test. AI will analyze your handwriting, check your answers against physics/math concepts, and provide detailed explanations.
            </p>
            <button 
                onClick={processDocument}
                disabled={!file}
                className={`px-8 py-3 rounded-full font-bold text-lg transition-all transform ${
                    file 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 shadow-xl' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                Start Analysis
            </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-20">
            <Loader className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800">Analyzing your answers...</h3>
            <p className="text-gray-500">Checking against Diatomic Gas laws...</p>
        </div>
      )}

      {/* RESULTS DASHBOARD */}
      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
            
            {/* 1. SCORECARD HEADER */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                
                {/* Score Circle */}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                        <circle 
                            cx="64" cy="64" r="56" 
                            stroke="currentColor" strokeWidth="12" 
                            fill="transparent" 
                            strokeDasharray={351} 
                            strokeDashoffset={351 - (351 * scorePercentage) / 100} 
                            className={`${scorePercentage >= 50 ? 'text-green-500' : 'text-orange-500'} transition-all duration-1000 ease-out`} 
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">{scorePercentage}%</span>
                        <span className="text-xs text-gray-500 font-medium uppercase">Score</span>
                    </div>
                </div>

                {/* Summary Text */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {scorePercentage >= 80 ? "Excellent Work! 🌟" : scorePercentage >= 50 ? "Good Effort! 👍" : "Needs Review 📚"}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        You answered <strong className="text-gray-900">{correctAnswers}</strong> out of <strong className="text-gray-900">{totalQuestions}</strong> questions correctly. 
                        Review the explanations below to improve your understanding of Thermodynamics.
                    </p>
                    
                    {/* Filters */}
                    <div className="flex gap-2 justify-center md:justify-start">
                        {['all', 'correct', 'incorrect'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                                    activeFilter === filter 
                                    ? 'bg-indigo-600 text-white shadow-md' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. QUESTION CARDS LIST */}
            <div className="grid gap-6">
                {filteredResult.map((item, index) => (
                    <QuestionCard key={index} item={item} />
                ))}
            </div>

            <button 
                onClick={() => { setResult(null); setFile(null); }}
                className="mx-auto block text-gray-500 hover:text-indigo-600 font-medium transition-colors"
            >
                Scan Another Document
            </button>
        </div>
      )}
    </div>
  );
};

// ==================== SUB-COMPONENT: QUESTION CARD ====================
const QuestionCard = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isCorrect = item.score === 1;

    return (
        <div className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${
            isCorrect ? 'border-green-100 hover:border-green-200' : 'border-red-100 hover:border-red-200'
        }`}>
            {/* Card Header (Always Visible) */}
            <div 
                className="p-5 cursor-pointer flex gap-4 items-start"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Status Icon */}
                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                    {isCorrect ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                </div>

                {/* Content Preview */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Question {item.id}</h4>
                        <div className="text-gray-400">
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-2 line-clamp-2">{item.question}</p>
                    
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="text-gray-500">Your Answer:</span>
                        <span className={`font-mono px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700 decoration-red-500'
                        }`}>
                            {item.answer}
                        </span>
                    </div>
                </div>
            </div>

            {/* Expanded Details (Explanation) */}
            {isOpen && (
                <div className={`px-5 pb-5 pt-0 ml-12 border-l-2 ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <h5 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                            <AlertCircle size={16} className="text-indigo-500" />
                            AI Explanation
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            {item.explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const VideoPlayer = ({ videoId, videoRef, userEmail, lecture, videoUrl }) => {
  const [watchProgress, setWatchProgress] = useState(0);
  const [activeCheckpoint, setActiveCheckpoint] = useState(null);   // 'alpha' | 'beta' | 'omega' | null
  const [completedCheckpoints, setCompletedCheckpoints] = useState(() => {
    const saved = localStorage.getItem(`completed_cp_${userEmail}_${videoId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [transcript, setTranscript] = useState(null);
  const replayTracker = useRef({ lastSeekTime: 0, segments: {} });
  const checkpointFiredRef = useRef({ alpha: false, beta: false, omega: false });
    useReplayTracker(videoRef, videoId, userEmail);


  // Load previously completed checkpoints from storage
  useEffect(() => {
    const saved = localStorage.getItem(`completed_cp_${userEmail}_${videoId}`);
    if (saved) {
      const cp = JSON.parse(saved);
      checkpointFiredRef.current = {
        alpha: cp.includes('alpha'),
        beta:  cp.includes('beta'),
        omega: cp.includes('omega'),
      };
    }
  }, [userEmail, videoId]);

  // Fetch transcript (needed for checkpoint questions)
  useEffect(() => {
    fetch(`http://localhost:5000/get-transcript/${videoId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setTranscript(data); })
      .catch(() => {});
  }, [videoId]);

  // Set up video event listeners
  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    loadProgress();

    const handleTimeUpdate = () => {
      const { currentTime, duration } = video;
      if (!duration) return;

      const pct = (currentTime / duration) * 100;
      setWatchProgress(pct);
      saveProgress(currentTime, duration);

      // Fire checkpoints (pause video, show modal)
      if (pct >= 25 && !checkpointFiredRef.current.alpha && !completedCheckpoints.includes('alpha')) {
        checkpointFiredRef.current.alpha = true;
        video.pause();
        setActiveCheckpoint('alpha');
      } else if (pct >= 60 && !checkpointFiredRef.current.beta && !completedCheckpoints.includes('beta')) {
        checkpointFiredRef.current.beta = true;
        video.pause();
        setActiveCheckpoint('beta');
      } else if (pct >= 99 && !checkpointFiredRef.current.omega && !completedCheckpoints.includes('omega')) {
        checkpointFiredRef.current.omega = true;
        video.pause();
        setActiveCheckpoint('omega');
      }
    };

    // Track replays (seeking backwards = replay)
    const handleSeeked = () => {
      const current = video.currentTime;
      const last = replayTracker.current.lastSeekTime;
      if (last - current > 5) {
        // Backwards seek of more than 5 seconds = replay
        const segKey = Math.floor(current / 30); // 30-second segment buckets
        replayTracker.current.segments[segKey] = (replayTracker.current.segments[segKey] || 0) + 1;
        const totalReplays = Object.values(replayTracker.current.segments).reduce((s, v) => s + v, 0);
        const replayKey = `replays_${userEmail}_${videoId}`;
        localStorage.setItem(replayKey, JSON.stringify({
          totalReplays,
          segments: replayTracker.current.segments,
          updatedAt: new Date().toISOString()
        }));
      }
      replayTracker.current.lastSeekTime = current;
    };

    const handleTimeUpdateForReplay = () => {
      replayTracker.current.lastSeekTime = video.currentTime;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('timeupdate', handleTimeUpdateForReplay);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('timeupdate', handleTimeUpdateForReplay);
    };
  }, [videoRef, videoId, userEmail, completedCheckpoints]);

  const handleCheckpointComplete = ({ checkpoint, score }) => {
    const newCompleted = [...completedCheckpoints, checkpoint];
    setCompletedCheckpoints(newCompleted);
    localStorage.setItem(`completed_cp_${userEmail}_${videoId}`, JSON.stringify(newCompleted));
    setActiveCheckpoint(null);
    // Resume video
    if (videoRef?.current) {
      setTimeout(() => videoRef.current.play(), 300);
    }
  };

  const loadProgress = () => {
    try {
      const storageKey = `progress_${userEmail}_${videoId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setWatchProgress(data.progress);
        if (videoRef?.current) {
          videoRef.current.currentTime = data.currentTime;
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = (currentTime, duration) => {
    try {
      const progress = (currentTime / duration) * 100;
      const storageKey = `progress_${userEmail}_${videoId}`;
      const progressData = {
        videoId, userEmail, currentTime, duration, progress,
        lastWatched: new Date().toISOString(),
        subject: lecture.tag || 'General'
      };
      localStorage.setItem(storageKey, JSON.stringify(progressData));
      updateWatchHistory(userEmail, videoId, progressData);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateWatchHistory = (email, vId, progressData) => {
    try {
      const historyKey = `watch_history_${email}`;
      let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      const existingIndex = history.findIndex(h => h.videoId === vId);
      if (existingIndex >= 0) history[existingIndex] = progressData;
      else history.push(progressData);
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const cpDots = [
    { key: 'alpha', pct: 25, label: '25%' },
    { key: 'beta',  pct: 60, label: '60%' },
    { key: 'omega', pct: 99, label: 'End' },
  ];

  const videoSrc = videoUrl?.startsWith('http') 
  ? videoUrl 
  : `${API_BASE}/uploads/${videoId}.mp4`

  const vttSrc = `${API_BASE}/transcripts/${videoId}.vtt`;


  return (
    <div className="bg-black rounded-lg overflow-hidden mb-6 shadow-2xl relative">

      {/* Checkpoint Modal — overlays the video */}
      {activeCheckpoint && (
        <CheckpointModal
          checkpoint={activeCheckpoint}
          videoId={videoId}
          transcript={transcript}
          userEmail={userEmail}
          onComplete={handleCheckpointComplete}
        />
      )}

      <video
        ref={videoRef}
        controls
        className="w-full"
        style={{ maxHeight: '600px' }}
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23000000' width='1920' height='1080'/%3E%3C/svg%3E"
      >
      
        <source src={videoSrc} type="video/mp4" />
        <source src={`http://localhost:5000/uploads/${videoId}.mov`} type="video/quicktime" />
        <source src={`http://localhost:5000/uploads/${videoId}.avi`} type="video/x-msvideo" />
        <track kind="subtitles" src={vttSrc} srcLang="en" label="English" default />
        Your browser does not support the video tag.
      </video>

      <div className="bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between text-white text-sm mb-2">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Video ID: <span className="font-mono text-blue-400">{videoId}</span>
          </p>
          <p className="text-xs text-gray-400">Progress: {watchProgress.toFixed(1)}%</p>
        </div>

        {/* Progress bar with checkpoint markers */}
        <div className="relative">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${watchProgress}%` }}></div>
          </div>
          {/* Checkpoint markers */}
          {cpDots.map(cp => (
            <div
              key={cp.key}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${cp.pct}%` }}
              title={`Checkpoint ${cp.key} (${cp.label})`}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-white ${
                completedCheckpoints.includes(cp.key) ? 'bg-green-400' : 'bg-yellow-400'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Checkpoint status pills */}
        <div className="flex gap-2 mt-2">
          {cpDots.map(cp => (
            <span key={cp.key} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              completedCheckpoints.includes(cp.key)
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {completedCheckpoints.includes(cp.key) ? '✓' : '○'} {cp.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabsSection = ({ activeTab, setActiveTab, transcript, lecture, summary, concepts, practice, videoRef, userEmail, userType }) => (  
<div className="bg-white border border-gray-200 rounded-lg shadow">
   <div className="flex border-b border-gray-200 overflow-x-auto">
  <TabButton text="Summary" icon={<FileText size={18} />} active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} />
  <TabButton text="Important Concepts" icon={<Bookmark size={18} />} active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} />
  <TabButton text="AI Chat" icon={<MessageCircle size={18} />} active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
  <TabButton text="Practice" icon={<FileText size={18} />} active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} />
  <TabButton text="Notes" icon={<FileText size={18} />} active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
  {userType === 'student' && (
    <TabButton text="Analytics" icon={<Users size={18} />} active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
  )}
  {userType === 'student' && (
  <TabButton 
    text="Revision" 
    icon={<Bookmark size={18} />} 
    active={activeTab === 'revision'} 
    onClick={() => setActiveTab('revision')} 
  />
)}
  <TabButton text="Discussions" icon={<Users size={18} />} active={activeTab === 'discussions'} onClick={() => setActiveTab('discussions')} />
</div>
<div className="p-6">
  {activeTab === 'summary' && <SummaryContent transcript={transcript} videoId={lecture.videoId} />}
  {activeTab === 'concepts' && <ConceptsContent transcript={transcript} videoId={lecture.videoId} videoRef={videoRef} />}
  {activeTab === 'chat' && <AIChatContent transcript={transcript} videoId={lecture.videoId} videoRef={videoRef} />}
  {activeTab === 'practice' && <PracticeContent
  transcript={transcript}
  videoId={lecture.videoId}
  userEmail={userEmail}
  videoRef={videoRef}   // ← add this
/>}
  {activeTab === 'notes' && <NotesContent videoId={lecture.videoId} userEmail={userEmail} />}
  {activeTab === 'analytics' && userType === 'student' && <StudentAnalytics userEmail={userEmail} />}
  {activeTab === 'discussions' && (
    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <Users size={48} className="mx-auto text-gray-400 mb-3" />
      <p className="text-gray-600">Discussions feature coming soon</p>
    </div>
  )}
  {activeTab === 'revision' && userType === 'student' && (
  <PersonalizedRevision userEmail={userEmail} />
)}
</div>
  </div>
);

const TabButton = ({ text, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all whitespace-nowrap ${
      active 
        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
    }`}
  >
    {icon}
    {text}
  </button>
);



const ConceptsContent = ({ transcript, videoId, videoRef }) => {
  const [concepts, setConcepts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load cached concepts if exists
  useEffect(() => {
    const cacheKey = `lecture_${videoId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.concepts) {
        console.log('Loaded concepts from localStorage');
        setConcepts(data.concepts);
      }
    }
  }, [videoId]);

  const generateConcepts = async () => {
    if (!transcript) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/generate-concepts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.segments.map(s => s.text).join(' ')
        }),
      });

      const data = await response.json();
      if (data.success) {
        setConcepts(data.concepts);

        // ✅ Save to localStorage
        const cacheKey = `lecture_${videoId}`;
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        localStorage.setItem(cacheKey, JSON.stringify({
          ...cached,
          concepts: data.concepts,
          cachedAt: new Date().toISOString()
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seekToTimestamp = (timestamp) => {
    if (!videoRef?.current) return;
    const parts = timestamp.split(':');
    let seconds = 0;
    if (parts.length === 3) seconds = +parts[0] * 3600 + +parts[1] * 60 + +parts[2];
    else if (parts.length === 2) seconds = +parts[0] * 60 + +parts[1];
    videoRef.current.currentTime = seconds;
    videoRef.current.play();
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Important Concepts</h3>
        {concepts && <span className="text-xs text-green-600">Loaded from cache</span>}
        <button
          onClick={generateConcepts}
          disabled={loading || !transcript}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            loading || !transcript
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb size={18} />
              Extract Concepts
            </>
          )}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">{error}</div>}

      {concepts ? (
        <div className="space-y-3">
          {concepts.map((concept, idx) => (
            <div key={idx} className={`p-4 border-l-4 rounded-lg ${getImportanceColor(concept.importance)}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900">{concept.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    concept.importance === 'high' ? 'bg-red-200 text-red-800' :
                    concept.importance === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {concept.importance}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{concept.description}</p>
                {concept.timestamp && (
                  <button
                    onClick={() => seekToTimestamp(concept.timestamp)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Play size={12} /> Jump to {concept.timestamp}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Bookmark size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">No concepts extracted yet</p>
          <p className="text-sm text-gray-500">Click "Extract Concepts" to identify key topics</p>
        </div>
      )}
    </div>
  );
};

const PracticeContent = ({ transcript, videoId, userEmail, videoRef }) => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [evaluating, setEvaluating] = useState(false);

  // ✅ Load cached practice questions if available
  useEffect(() => {
    const cacheKey = `lecture_${videoId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.practice) {
        console.log('Loaded practice questions from localStorage');
        setQuestions(data.practice);
      }
    }
  }, [videoId]);
const [confidenceRatings, setConfidenceRatings] = useState({}); 
const [explainQuestion, setExplainQuestion] = useState(null); // {question, userAnswer}// {questionId: 'confident'|'unsure'|'guessing'}
const saveTestResult = (lectureSubject = 'General') => {
  try {
    if (!questions || questions.length === 0) return;
    const totalQuestions = questions.length;
    const correctAnswers = Object.values(evaluations).filter(e => e.isCorrect).length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Calibration analysis: confident + wrong = metacognitive gap signal
    const confidentWrong = Object.entries(evaluations).filter(([qId, ev]) => !ev.isCorrect && confidenceRatings[qId] === 'confident').length;
    const guessingRight = Object.entries(evaluations).filter(([qId, ev]) => ev.isCorrect && confidenceRatings[qId] === 'guessing').length;

    const testResult = {
      videoId,
      subject: lectureSubject,
      date: new Date().toISOString(),
      totalQuestions,
      correctAnswers,
      score: score.toFixed(1),
      evaluations,
      confidenceRatings,
      calibration: {
        confidentWrong,         // Key Flag 4 signal
        guessingRight,
        hasCalibrationData: Object.keys(confidenceRatings).length > 0
      }
    };

    const storageKey = `test_result_${userEmail}_${videoId}_${Date.now()}`;
    localStorage.setItem(storageKey, JSON.stringify(testResult));

    // Save confidence data separately for flag computation
    localStorage.setItem(`confidence_${userEmail}_${videoId}`, JSON.stringify(confidenceRatings));

    alert(`Test completed! Score: ${score.toFixed(1)}%${confidentWrong > 0 ? `\n⚠️ You were confident on ${confidentWrong} question(s) you got wrong — worth reviewing!` : ''}`);
  } catch (error) {
    console.error('Error saving test result:', error);
  }
};

  const generateQuestions = async () => {
    if (!transcript) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/generate-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.segments.map(s => s.text).join(' ')
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);

        // ✅ Save to localStorage
        const cacheKey = `lecture_${videoId}`;
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '{}');
        localStorage.setItem(cacheKey, JSON.stringify({
          ...cached,
          practice: data.questions,
          cachedAt: new Date().toISOString()
        }));
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const evaluateAnswer = async (question) => {
  const userAnswer = userAnswers[question.id];
  if (userAnswer === undefined || userAnswer === null) return;  // Changed this line

  setEvaluating(true);
  
  try {
    const response = await fetch(`${API_BASE}/evaluate-answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.type === 'mcq' ? question.correctAnswer : 
                      question.type === 'fill-blank' ? question.answer :
                      question.keywords,
        type: question.type
      })
    });

    const data = await response.json();
    if (data.success) {
      setEvaluations(prev => ({
        ...prev,
        [question.id]: {
          isCorrect: data.isCorrect,
          feedback: data.feedback,
          score: data.score
        }
      }));
    }
  } catch (err) {
    console.error('Evaluation error:', err);
  } finally {
    setEvaluating(false);
  }
};

 const renderQuestion = (question) => {
    const evaluation = evaluations[question.id];
    const userAnswer = userAnswers[question.id];
    const confidence = confidenceRatings[question.id];

    return (
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                {question.type === 'fill-blank' ? 'Fill in the Blank' :
                 question.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
              </span>
              {question.bloomLevel && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                  Bloom's L{question.bloomLevel}
                </span>
              )}
              <span className="text-sm text-gray-500">Question {question.id}</span>
            </div>
            <p className="text-lg font-medium text-gray-900">{question.question}</p>
          </div>
        </div>

        {question.type === 'fill-blank' && (
          <div className="space-y-3">
            <input type="text" value={userAnswer || ''} onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              disabled={evaluation}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
              placeholder="Type your answer..." />
            {question.hint && !evaluation && <p className="text-sm text-gray-500 italic">💡 Hint: {question.hint}</p>}
          </div>
        )}

        {question.type === 'mcq' && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswerChange(question.id, idx)} disabled={evaluation}
                className={`w-full text-left px-4 py-3 border-2 rounded-lg transition-all ${
                  userAnswer !== undefined && userAnswer === idx
                    ? evaluation
                      ? evaluation.isCorrect && idx === question.correctAnswer ? 'border-green-500 bg-green-50'
                        : idx === userAnswer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      : 'border-blue-500 bg-blue-50'
                    : evaluation && idx === question.correctAnswer ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-300'
                } disabled:cursor-not-allowed`}>
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'short-answer' && (
          <textarea value={userAnswer || ''} onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            disabled={evaluation}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
            rows="4" placeholder="Write your answer in 2-3 sentences..." />
        )}

        {/* ── CONFIDENCE TAGGING (Metacognitive Calibration) ── */}
        {userAnswer !== undefined && userAnswer !== null && !evaluation && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2">How confident are you in this answer?</p>
            <div className="flex gap-2">
              {[
                { key: 'confident', label: '😎 Confident', color: 'bg-green-100 text-green-700 border-green-300' },
                { key: 'unsure',    label: '🤔 Unsure',    color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                { key: 'guessing',  label: '🎲 Guessing',  color: 'bg-red-100 text-red-700 border-red-300' }
              ].map(opt => (
                <button key={opt.key} onClick={() => setConfidenceRatings(prev => ({ ...prev, [question.id]: opt.key }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    confidence === opt.key ? opt.color + ' shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {evaluation && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${evaluation.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start gap-2">
              {evaluation.isCorrect ? <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} /> : <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />}
              <div className="flex-1">
                <p className={`font-semibold ${evaluation.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {evaluation.isCorrect ? 'Correct!' : 'Not quite right'}{evaluation.score && ` (${evaluation.score}/10)`}
                </p>
                {/* Metacognitive feedback */}
                {confidence && !evaluation.isCorrect && confidence === 'confident' && (
                  <div className="mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    <strong>Calibration note:</strong> You felt confident but got this wrong. This is worth reviewing — your understanding of this concept may have a gap. Try explaining it in your own words.
                  </div>
                )}
                {confidence && evaluation.isCorrect && confidence === 'guessing' && (
                  <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    <strong>Nice!</strong> You got it right even when unsure. Review why this answer is correct to build real confidence.
                  </div>
                )}
                <p className="text-sm text-gray-700 mt-1">{evaluation.feedback}</p>
                {question.explanation && <p className="text-sm text-gray-600 mt-2"><strong>Explanation:</strong> {question.explanation}</p>
                }
                {!evaluation.isCorrect && (
  <button
    onClick={() => setExplainQuestion({ question, userAnswer: userAnswers[question.id] })}
    className="mt-3 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
  >
    <BookOpen size={14} />
    Explain this concept from the lecture →
  </button>
)}
              </div>
            </div>
          </div>
        )}

        {!evaluation && userAnswer !== undefined && userAnswer !== null && (
          <button onClick={() => evaluateAnswer(question)} disabled={evaluating}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2">
            {evaluating ? (<><Loader className="animate-spin" size={16} />Checking...</>) : 'Submit Answer'}
          </button>
        )}
        
      </div>
    );
  };

  return (
      <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Practice Questions</h3>
        {questions && <span className="text-xs text-green-600">Loaded from cache</span>}
        <button
          onClick={generateQuestions}
          disabled={loading || !transcript}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            loading || !transcript
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
          }`}
        >
          {loading ? (
            <>
              <Loader className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <FileText size={18} />
              Generate Questions
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">{error}</div>
      )}

      {questions ? (
        <div className="space-y-6">
          {questions.map((question) => (
            <div key={question.id}>
              {renderQuestion(question)}
            </div>
          ))}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Progress:</strong> {Object.keys(evaluations).length} / {questions.length} questions answered
            </p>
          </div>
    {Object.keys(evaluations).length === questions.length && (
  <button
    onClick={() => saveTestResult('Physics')}
    className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
  >
    Submit Test & Save Results
  </button>
)}

        </div>

      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600 mb-2">No practice questions yet</p>
          <p className="text-sm text-gray-500">Click "Generate Questions" to create a quiz</p>
        </div>
      )}
      {explainQuestion && (
  <ConceptExplanationPanel
    question={explainQuestion.question}
    userAnswer={explainQuestion.userAnswer}
    videoId={videoId}
    videoRef={videoRef}   // ← was null before
    onClose={() => setExplainQuestion(null)}
  />
)}
    </div>
  );
};

const AIChatContent = ({ transcript, videoId, videoRef }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [piStatus, setPiStatus] = useState('unknown');
  const [showGapAnalysis, setShowGapAnalysis] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!videoId || !transcript) return;
    initPageIndex();
  }, [videoId, transcript]);

  const initPageIndex = async () => {
    try {
      const r = await fetch(`${API_BASE}/pi-status/${videoId}`);
      const d = await r.json();
      console.log('[PageIndex] status check:', d);

      if (d.status === 'completed') {
        setPiStatus('ready');
        console.log('[PageIndex] ✅ Tree ready — RAG active');
      } else {
        setPiStatus('unavailable');
        console.log('[PageIndex] ⚠️ No tree for this video — using transcript fallback');
      }
    } catch (err) {
      console.warn('[PageIndex] status check failed:', err);
      setPiStatus('unavailable');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !transcript) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      let aiMessage;

      if (piStatus === 'ready') {
        // ── USE TREE RAG (pi-chat) ─────────────────────────────────────────
        // This traverses the PageIndex tree, finds matching sections,
        // and falls back to transcript automatically on the backend
        console.log('[Chat] Using /pi-chat (tree RAG)');

        const res = await fetch(`${API_BASE}/pi-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId,
            message:  currentInput,
            history:  messages,
            mode:     'chat',
            studentEmail: 'student5@paathshala.com'   // ← add this

          })
        });
        const data = await res.json();
        console.log('[Chat] pi-chat response:', data);

        if (!data.success) throw new Error(data.error);

        // Build source chips from retrieved chunks
        // For textbook chunks: show section + page
        // For transcript chunks: show timestamp (clickable)
        const sourceChips = (data.retrieved_chunks || []).map(c => ({
          type:          c.source === 'transcript' ? 'transcript' : 'textbook',
          label:         c.source === 'transcript'
                           ? c.start_time || '?'
                           : c.section || c.title || 'Textbook',
          pageRange:     c.page_range || '',
          text:          c.text || '',
          start_seconds: c.start_seconds || 0,
          start_time:    c.start_time || ''
        }));

        aiMessage = {
          role:        'assistant',
          content:     data.answer,
          source:      data.source,           // 'local_tree' | 'transcript_fallback'
          sourceChips,
          retrieved:   data.retrieved_chunks || [],
          sourceDetail: data.source_detail || []
        };

      } else {
        // ── FALLBACK: transcript-only chat ─────────────────────────────────
        console.log('[Chat] Using /chat-with-transcript (no tree available)');

        const res = await fetch(`${API_BASE}/chat-with-transcript`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            videoId,
            transcript: transcript.segments.map(s => s.text).join(' '),
            segments:   transcript.segments,
            message:    currentInput,
            history:    messages
          })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);

        const sourceChips = (data.response.segments || []).map(seg => ({
          type:          'transcript',
          label:         seg.start_time,
          text:          seg.text,
          start_seconds: seg.start_seconds || 0,
          start_time:    seg.start_time
        }));

        aiMessage = {
          role:        'assistant',
          content:     data.response.answer,
          source:      'transcript',
          sourceChips,
          retrieved:   [],
          sourceDetail: []
        };
      }

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error('[Chat] Error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I hit an error. Please try again.',
        source: 'error', sourceChips: [], retrieved: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  // const runGapAnalysis = async () => {
  //   setGapLoading(true);
  //   setShowGapAnalysis(true);
  //   try {
  //     const res = await fetch(`${API_BASE}/pi-chat`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ videoId, message: '', mode: 'gaps', history: [] })
  //     });
  //     const data = await res.json();
  //     if (data.success) setGapAnalysis(data.answer);
  //     else setGapAnalysis('Could not load gap analysis: ' + (data.error || 'unknown error'));
  //   } catch (err) {
  //     setGapAnalysis('Could not load gap analysis.');
  //   } finally {
  //     setGapLoading(false);
  //   }
  // };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-600" />
              AI Tutor Chat
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {piStatus === 'ready'
                ? 'Searching textbook chapters + lecture'
                : 'Searching lecture transcript'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* RAG status badge */}
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              piStatus === 'ready'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                piStatus === 'ready' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {piStatus === 'ready' ? '📚 Textbook RAG active' : '🎥 Transcript only'}
            </span>

            {/* {piStatus === 'ready' && (
              <button
                onClick={runGapAnalysis}
                className="text-xs px-3 py-1 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Gap Analysis
              </button>
            )} */}
          </div>
        </div>
      </div>

      {/* Gap Analysis Panel */}
      {/* {showGapAnalysis && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-amber-900">Prerequisite Knowledge Gap Analysis</h4>
            <button onClick={() => setShowGapAnalysis(false)} className="text-amber-500 text-xs hover:text-amber-700">✕ close</button>
          </div>
          {gapLoading ? (
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <Loader className="animate-spin" size={14} />
              Analyzing chapter structure...
            </div>
          ) : (
            <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">{gapAnalysis}</p>
          )}
        </div>
      )} */}

      {/* Chat window */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="h-96 overflow-y-auto p-4 space-y-4">

          {messages.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm mb-4">Ask anything about this topic</p>
              <div className="space-y-1.5 text-left max-w-xs mx-auto">
                {[
                  "What is meant by unidentate, didentate and ambidentate ligands?",
                  "What is Werner's theory?",
                  "Explain geometric isomerism",
                  "What should I know before studying this?"
                ].map(q => (
                  <button key={q} onClick={() => setInputMessage(q)}
                    className="w-full text-left text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'
              }`}>

                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                {/* Source attribution */}
                {msg.role === 'assistant' && msg.source && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      msg.source === 'local_tree'
                        ? 'bg-green-100 text-green-700'
                        : msg.source === 'transcript_fallback' || msg.source === 'transcript'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {msg.source === 'local_tree'         ? '📚 From textbook'          :
                       msg.source === 'transcript_fallback' ? '🎥 From lecture (textbook didn\'t cover this)' :
                       msg.source === 'transcript'          ? '🎥 From lecture'           : '🤖 AI generated'}
                    </span>
                  </div>
                )}

                {/* Source chips — textbook sections OR transcript timestamps */}
                {msg.role === 'assistant' && msg.sourceChips && msg.sourceChips.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                    <p className="text-xs text-gray-400 font-medium">Sources used:</p>
                    {msg.sourceChips.map((chip, i) => (
                      chip.type === 'textbook' ? (
                        // Textbook section — not clickable, just informational
                        <div key={i} className="flex items-start gap-2 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-green-600 text-xs mt-0.5 flex-shrink-0">📖</span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-green-800 truncate">{chip.label}</p>
                            {chip.pageRange && (
                              <p className="text-xs text-green-600">{chip.pageRange}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Transcript timestamp — clickable, seeks video
                        <button
                          key={i}
                          onClick={() => {
                            if (videoRef?.current) {
                              videoRef.current.currentTime = chip.start_seconds || 0;
                              videoRef.current.play();
                            }
                          }}
                          className="flex items-start gap-2 w-full text-left px-2 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
                        >
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-blue-600 text-white text-xs font-mono rounded font-bold">
                            {chip.label}
                          </span>
                          <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-800 line-clamp-2">
                            "{chip.text}"
                          </span>
                        </button>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader className="animate-spin text-blue-600" size={14} />
                <span className="text-sm text-gray-500">
                  {piStatus === 'ready' ? 'Searching textbook chapters...' : 'Searching lecture...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
              disabled={loading || !transcript}
              placeholder={
                !transcript ? "Loading transcript..." :
                piStatus === 'ready' ? "Ask about the textbook or lecture..." :
                "Ask about the lecture..."
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim() || !transcript}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              {loading ? <Loader className="animate-spin" size={16} /> : <MessageCircle size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">
            {piStatus === 'ready'
              ? '📚 Textbook + 🎥 Lecture — answers cite their source'
              : '🎥 Transcript search active'}
          </p>
        </div>
      </div>
    </div>
  );
};


const NotesContent = ({ videoId, userEmail }) => {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, [videoId, userEmail]);

  const loadNotes = () => {
    try {
      const storageKey = `notes_${userEmail}_${videoId}`;
      const savedNotes = localStorage.getItem(storageKey);
      if (savedNotes) {
        setNotes(savedNotes);
        const metadata = JSON.parse(localStorage.getItem(`${storageKey}_meta`) || '{}');
        setLastSaved(metadata.lastSaved);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = () => {
    try {
      setSaving(true);
      const storageKey = `notes_${userEmail}_${videoId}`;
      localStorage.setItem(storageKey, notes);
      
      const metadata = {
        lastSaved: new Date().toISOString(),
        videoId,
        userEmail
      };
      localStorage.setItem(`${storageKey}_meta`, JSON.stringify(metadata));
      
      setLastSaved(metadata.lastSaved);
      setTimeout(() => setSaving(false), 500);
    } catch (error) {
      console.error('Error saving notes:', error);
      setSaving(false);
    }
  };

  const downloadNotes = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_${videoId}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatText = (command) => {
    document.execCommand(command, false, null);
  };

  const insertList = (ordered) => {
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false, null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">My Notes</h3>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-gray-500">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={saveNotes}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? <Loader className="animate-spin" size={16} /> : <Download size={16} />}
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={downloadNotes}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 p-2 flex gap-1 flex-wrap bg-gray-50">
          <button
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-200 rounded"
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            onClick={() => insertList(false)}
            className="p-2 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => insertList(true)}
            className="p-2 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            1.
          </button>
          <div className="w-px bg-gray-300 mx-1"></div>
          <button
            onClick={() => formatText('formatBlock', '<h3>')}
            className="p-2 hover:bg-gray-200 rounded text-sm"
            title="Heading"
          >
            H
          </button>
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => setNotes(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: notes }}
          className="min-h-96 p-4 focus:outline-none"
          style={{ maxHeight: '600px', overflowY: 'auto' }}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>💡 Tip:</strong> Your notes are automatically saved locally and synced to this video.
          Use the toolbar to format your text with bold, italics, lists, and headings.
        </p>
      </div>
    </div>
  );
};

const StudentAnalytics = ({ userEmail }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => { buildAnalytics(); }, [userEmail]);

  const buildAnalytics = () => {
    setLoading(true);
    try {
      const watchHistory = JSON.parse(localStorage.getItem(`watch_history_${userEmail}`) || '[]');
      const allKeys = Object.keys(localStorage);
      const testResults = allKeys.filter(k => k.startsWith(`test_result_${userEmail}_`)).map(k => JSON.parse(localStorage.getItem(k)));
      const cpAttempts  = allKeys.filter(k => k.startsWith(`cp_attempt_${userEmail}_`)).map(k => JSON.parse(localStorage.getItem(k)));

      // Bloom's per level
      const bloom = { l1: [], l2: [], l3: [], l4: [] };
      cpAttempts.forEach(a => { const l = `l${Math.min(a.bloomLevel || 1, 4)}`; bloom[l].push(a.score || 0); });
      const bloomAvg = Object.fromEntries(Object.entries(bloom).map(([l, scores]) => [l, scores.length ? Math.round(scores.reduce((s,v) => s+v,0)/scores.length) : null]));

      // Calibration
      const calibTests = testResults.filter(t => t.calibration?.hasCalibrationData);
      const confidentWrong = calibTests.reduce((s,t) => s + (t.calibration?.confidentWrong || 0), 0);
      const totalConfidentQuestions = calibTests.length * 5; // rough estimate
      const calibrationScore = calibTests.length > 0 ? Math.max(0, 100 - (confidentWrong / Math.max(totalConfidentQuestions,1)) * 100) : null;

      // Score trend
      const scoreTrend = cpAttempts.slice(-6).map(a => ({ score: a.score || 0, checkpoint: a.checkpoint, date: new Date(a.completedAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) }));
      const velocity = scoreTrend.length >= 2 ? scoreTrend[scoreTrend.length-1].score - scoreTrend[0].score : null;

      // Flags
      const flagSummary = JSON.parse(localStorage.getItem(`flags_summary_${userEmail}`) || '{}');
      const flags = {
        flag1: Object.values(flagSummary).some(f => f.flag1),
        flag2: Object.values(flagSummary).some(f => f.flag2),
        flag3: Object.values(flagSummary).some(f => f.flag3),
        flag4: Object.values(flagSummary).some(f => f.flag4),
        flag5: Object.values(flagSummary).some(f => f.flag5),
      };

      // Subject stats
      const subjects = ['Physics','Chemistry','Biology','Mathematics','General'];
      const subjectStats = subjects.map(sub => {
        const svids = watchHistory.filter(v => v.subject === sub);
        const stests = testResults.filter(t => t.subject === sub);
        const avgScore = stests.length ? (stests.reduce((s,t) => s + parseFloat(t.score),0) / stests.length) : null;
        const avgProgress = svids.length ? (svids.reduce((s,v) => s + v.progress,0) / svids.length) : 0;
        return { subject: sub, videos: svids.length, tests: stests.length, avgScore, avgProgress: Math.round(avgProgress) };
      }).filter(s => s.videos > 0 || s.tests > 0);

      setAnalytics({
        watchTime: Math.round(watchHistory.reduce((s,v) => s + (v.currentTime||0), 0) / 60),
        videosWatched: watchHistory.length,
        testsTaken: testResults.length,
        checkpointsTaken: cpAttempts.length,
        overallScore: testResults.length ? (testResults.reduce((s,t) => s + parseFloat(t.score),0) / testResults.length).toFixed(1) : null,
        bloomAvg, calibrationScore, confidentWrong, scoreTrend, velocity, flags, subjectStats
      });
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!analytics) return null;

  const BLOOM_LEVELS = [
    { key: 'l1', level: 'L1', name: 'Remember',    desc: 'Can you recall facts and definitions from the lecture?' },
    { key: 'l2', level: 'L2', name: 'Understand',  desc: 'Can you explain concepts in your own words?' },
    { key: 'l3', level: 'L3', name: 'Apply',       desc: 'Can you use what you learned to solve new problems?' },
    { key: 'l4', level: 'L4', name: 'Analyze',     desc: 'Can you break down ideas and see how they relate?' },
  ];

  const BLOOM_INSIGHT = (score) => {
    if (score === null) return { text: 'No data yet', color: 'text-gray-400' };
    if (score >= 70) return { text: 'Strong', color: 'text-green-600' };
    if (score >= 50) return { text: 'Developing', color: 'text-amber-600' };
    return { text: 'Needs work', color: 'text-red-600' };
  };

  const NAV = [
    { key: 'overview',    label: 'Overview' },
    { key: 'bloom',       label: "Bloom's Analysis" },
    { key: 'calibration', label: 'Calibration' },
    { key: 'subjects',    label: 'By Subject' },
  ];

  return (
    <div className="space-y-0">
      {/* Section nav */}
      <div className="flex border-b border-gray-200 mb-6 -mt-2">
        {NAV.map(n => (
          <button key={n.key} onClick={() => setActiveSection(n.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${activeSection === n.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {n.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeSection === 'overview' && (
        <div className="space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Watch Time',   value: `${analytics.watchTime} min`, sub: `${analytics.videosWatched} videos` },
              { label: 'Tests Taken',  value: analytics.testsTaken,          sub: `${analytics.checkpointsTaken} checkpoints` },
              { label: 'Avg Score',    value: analytics.overallScore ? `${analytics.overallScore}%` : '—', sub: 'across all tests' },
              { label: 'Trend',        value: analytics.velocity !== null ? `${analytics.velocity > 0 ? '+' : ''}${analytics.velocity?.toFixed(0)}pts` : '—', sub: 'last 6 checkpoints' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Score trend */}
          {analytics.scoreTrend.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-4">Checkpoint Score Trend</p>
              <div className="flex items-end gap-3 h-28">
                {analytics.scoreTrend.map((point, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <span className="text-xs text-gray-500 mb-1">{point.score}%</span>
                    <div
                      className={`w-full rounded-t-md transition-all ${point.score >= 70 ? 'bg-green-500' : point.score >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ height: `${Math.max(point.score * 0.85, 8)}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-1.5 text-center leading-tight">{point.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags summary — plain, no emojis */}
          {Object.values(analytics.flags).some(Boolean) && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Areas flagged for attention</p>
              <div className="space-y-2">
                {analytics.flags.flag1 && <p className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>Some concepts may have prerequisite gaps — review foundational material.</p>}
                {analytics.flags.flag2 && <p className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>Watch time is high relative to test scores — try active recall while watching.</p>}
                {analytics.flags.flag3 && <p className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0"></span>High replay count detected — some content may be too dense. Ask your tutor.</p>}
                {analytics.flags.flag4 && <p className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0"></span>Confidence often doesn't match performance — review before submitting answers.</p>}
                {analytics.flags.flag5 && <p className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>Activity has dropped recently — try to log in consistently.</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BLOOM'S ANALYSIS ── */}
      {activeSection === 'bloom' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-1">What is Bloom's Taxonomy?</p>
            <p className="text-sm text-gray-500">Bloom's Taxonomy is a framework that classifies thinking skills from basic recall to complex analysis. Checkpoint questions are designed at specific levels — if you struggle at L3 but pass L1/L2, it means you understand the concept but need more practice applying it.</p>
          </div>

          <div className="space-y-3">
            {BLOOM_LEVELS.map(bl => {
              const avg = analytics.bloomAvg[bl.key];
              const insight = BLOOM_INSIGHT(avg);
              return (
                <div key={bl.key} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-black text-gray-600">{bl.level}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{bl.name}</p>
                        <p className="text-xs text-gray-500">{bl.desc}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      {avg !== null ? (
                        <>
                          <p className="text-xl font-bold text-gray-900">{avg}%</p>
                          <p className={`text-xs font-semibold ${insight.color}`}>{insight.text}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">No data</p>
                      )}
                    </div>
                  </div>
                  {avg !== null && (
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${avg >= 70 ? 'bg-green-500' : avg >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${avg}%` }}></div>
                    </div>
                  )}
                  {avg !== null && avg < 60 && (
                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <p className="text-xs text-gray-600 font-semibold mb-0.5">Suggestion</p>
                      <p className="text-xs text-gray-500">
                        {bl.key === 'l1' && "Review the key terms and definitions from the lecture. Use the Flashcards section."}
                        {bl.key === 'l2' && "Try explaining each concept in your own words after watching. The AI Chat can test your understanding."}
                        {bl.key === 'l3' && "Practice with examples. In the Practice tab, look for questions that ask 'how would you use...' or 'give an example of...'"}
                        {bl.key === 'l4' && "Try comparing two related concepts — how are they similar? How are they different? This builds analytical thinking."}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">How to read this</p>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500">Struggling at <strong className="text-gray-700">L1 + L2</strong> → foundational gap. Review lecture notes and flashcards.</p>
              <p className="text-xs text-gray-500">Good L1/L2, struggling at <strong className="text-gray-700">L3</strong> → cognitive overload during application. Take it step by step.</p>
              <p className="text-xs text-gray-500">Good L1/L2/L3, struggling at <strong className="text-gray-700">L4</strong> → analytical thinking gap. Practice comparing related concepts.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── CALIBRATION ── */}
      {activeSection === 'calibration' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-1">What is metacognitive calibration?</p>
            <p className="text-sm text-gray-500">Calibration measures how accurately you judge your own answers. If you often feel confident but get the answer wrong, that's a sign your mental model of the concept has a gap you haven't noticed yet. This is one of the strongest predictors of long-term learning success.</p>
          </div>

          {analytics.calibrationScore !== null ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">Your calibration score</p>
                <span className={`text-2xl font-black ${analytics.calibrationScore >= 80 ? 'text-green-600' : analytics.calibrationScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {analytics.calibrationScore}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                <div className={`h-2.5 rounded-full ${analytics.calibrationScore >= 80 ? 'bg-green-500' : analytics.calibrationScore >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${analytics.calibrationScore}%` }}></div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {analytics.confidentWrong === 0 ? (
                  <p className="text-sm text-gray-600">Your confidence matches your performance well. Keep it up.</p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-1">You were confident but wrong on {analytics.confidentWrong} question{analytics.confidentWrong > 1 ? 's' : ''}</p>
                    <p className="text-sm text-gray-500">This is a metacognitive gap — your understanding feels complete but has hidden errors. Use the "Explain from lecture" button after wrong answers to find the exact gap.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-500">No calibration data yet. Complete practice questions and use the confidence rating buttons to build your calibration score.</p>
            </div>
          )}
        </div>
      )}

      {/* ── BY SUBJECT ── */}
      {activeSection === 'subjects' && (
        <div className="space-y-3">
          {analytics.subjectStats.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
              No subject data yet. Watch some lectures and take tests to see your breakdown.
            </div>
          ) : analytics.subjectStats.map(s => (
            <div key={s.subject} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800">{s.subject}</p>
                {s.avgScore !== null && (
                  <span className={`text-sm font-bold ${s.avgScore >= 70 ? 'text-green-600' : s.avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                    {s.avgScore.toFixed(1)}%
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <div><p className="text-xs text-gray-400">Videos</p><p className="text-sm font-bold text-gray-700">{s.videos}</p></div>
                <div><p className="text-xs text-gray-400">Tests</p><p className="text-sm font-bold text-gray-700">{s.tests}</p></div>
                <div><p className="text-xs text-gray-400">Progress</p><p className="text-sm font-bold text-gray-700">{s.avgProgress}%</p></div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${s.avgScore !== null && s.avgScore >= 70 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${s.avgProgress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== WEAK LEARNER REPORT (Teacher View) ====================
// ==================== WEAK LEARNER REPORT (Teacher View) ====================

const seedDummyData = () => {
  const alreadySeeded = localStorage.getItem('__dummy_seeded_v1');
  if (alreadySeeded) return;

  // ---------- student1 ----------
  const s1 = 'student1@paathshala.com';
  localStorage.setItem(`watch_history_${s1}`, JSON.stringify([
    { videoId: 'v001', progress: 38, watchedAt: '2025-06-01T10:00:00Z' },
    { videoId: 'v002', progress: 22, watchedAt: '2025-06-02T11:30:00Z' },
    { videoId: 'v003', progress: 15, watchedAt: '2025-06-03T09:00:00Z' },
  ]));
  localStorage.setItem(`replays_${s1}_v001`, JSON.stringify({ totalReplays: 7 }));
  localStorage.setItem(`replays_${s1}_v002`, JSON.stringify({ totalReplays: 4 }));
  localStorage.setItem(`replays_${s1}_v003`, JSON.stringify({ totalReplays: 9 }));
  localStorage.setItem(`test_result_${s1}_t1`, JSON.stringify({
    score: '42', timeTaken: 180,
    calibration: { hasCalibrationData: true, confidentWrong: 5 }
  }));
  localStorage.setItem(`test_result_${s1}_t2`, JSON.stringify({
    score: '38', timeTaken: 210,
    calibration: { hasCalibrationData: true, confidentWrong: 3 }
  }));
  localStorage.setItem(`cp_attempt_${s1}_c1`, JSON.stringify({ bloomLevel: 1, score: 40 }));
  localStorage.setItem(`cp_attempt_${s1}_c2`, JSON.stringify({ bloomLevel: 2, score: 33 }));
  localStorage.setItem(`cp_attempt_${s1}_c3`, JSON.stringify({ bloomLevel: 3, score: 28 }));
  localStorage.setItem(`sessions_${s1}`, JSON.stringify([
    { timestamp: new Date(Date.now() - 14 * 86400000).toISOString(), duration: 12 },
    { timestamp: new Date(Date.now() - 12 * 86400000).toISOString(), duration: 8 },
  ]));
  localStorage.setItem(`flags_summary_${s1}`, JSON.stringify({
    v001: { flag1: true, flag2: false, flag3: true, flag4: true, flag5: false },
    v002: { flag1: false, flag2: true, flag3: false, flag4: false, flag5: true },
  }));

  // ---------- student2 ----------
  const s2 = 'student2@paathshala.com';
  localStorage.setItem(`watch_history_${s2}`, JSON.stringify([
    { videoId: 'v001', progress: 95, watchedAt: '2025-06-01T08:00:00Z' },
    { videoId: 'v002', progress: 100, watchedAt: '2025-06-02T09:00:00Z' },
    { videoId: 'v003', progress: 91, watchedAt: '2025-06-03T10:00:00Z' },
    { videoId: 'v004', progress: 88, watchedAt: '2025-06-04T11:00:00Z' },
  ]));
  localStorage.setItem(`replays_${s2}_v001`, JSON.stringify({ totalReplays: 0 }));
  localStorage.setItem(`replays_${s2}_v002`, JSON.stringify({ totalReplays: 1 }));
  localStorage.setItem(`test_result_${s2}_t1`, JSON.stringify({
    score: '58', timeTaken: 140,
    calibration: { hasCalibrationData: true, confidentWrong: 0 }
  }));
  localStorage.setItem(`test_result_${s2}_t2`, JSON.stringify({
    score: '54', timeTaken: 155,
    calibration: { hasCalibrationData: true, confidentWrong: 1 }
  }));
  localStorage.setItem(`cp_attempt_${s2}_c1`, JSON.stringify({ bloomLevel: 1, score: 55 }));
  localStorage.setItem(`cp_attempt_${s2}_c2`, JSON.stringify({ bloomLevel: 2, score: 48 }));
  localStorage.setItem(`cp_attempt_${s2}_c3`, JSON.stringify({ bloomLevel: 3, score: 42 }));
  localStorage.setItem(`cp_attempt_${s2}_c4`, JSON.stringify({ bloomLevel: 4, score: 38 }));
  localStorage.setItem(`sessions_${s2}`, JSON.stringify([
    { timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), duration: 55 },
    { timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), duration: 48 },
  ]));
  // flag2 = Passive Watcher (high progress, low CP scores)
  localStorage.setItem(`flags_summary_${s2}`, JSON.stringify({
    v001: { flag1: false, flag2: true, flag3: false, flag4: false, flag5: false },
    v002: { flag1: false, flag2: true, flag3: false, flag4: false, flag5: false },
  }));

  // ---------- student3 ----------
  const s3 = 'student3@paathshala.com';
  localStorage.setItem(`watch_history_${s3}`, JSON.stringify([
    { videoId: 'v001', progress: 72, watchedAt: '2025-05-28T07:00:00Z' },
    { videoId: 'v002', progress: 65, watchedAt: '2025-05-29T08:00:00Z' },
  ]));
  localStorage.setItem(`replays_${s3}_v001`, JSON.stringify({ totalReplays: 12 }));
  localStorage.setItem(`replays_${s3}_v002`, JSON.stringify({ totalReplays: 11 }));
  localStorage.setItem(`test_result_${s3}_t1`, JSON.stringify({
    score: '61', timeTaken: 300,
    calibration: { hasCalibrationData: true, confidentWrong: 2 }
  }));
  localStorage.setItem(`cp_attempt_${s3}_c1`, JSON.stringify({ bloomLevel: 1, score: 70 }));
  localStorage.setItem(`cp_attempt_${s3}_c2`, JSON.stringify({ bloomLevel: 2, score: 62 }));
  localStorage.setItem(`cp_attempt_${s3}_c3`, JSON.stringify({ bloomLevel: 3, score: 45 }));
  localStorage.setItem(`sessions_${s3}`, JSON.stringify([
    { timestamp: new Date(Date.now() - 20 * 86400000).toISOString(), duration: 90 },
    { timestamp: new Date(Date.now() - 18 * 86400000).toISOString(), duration: 85 },
  ]));
  // flag3 = Cognitive Overload (tons of replays), flag5 = Dropout Risk (20 days since)
  localStorage.setItem(`flags_summary_${s3}`, JSON.stringify({
    v001: { flag1: false, flag2: false, flag3: true, flag4: false, flag5: true },
    v002: { flag1: false, flag2: false, flag3: true, flag4: false, flag5: false },
  }));

  localStorage.setItem('__dummy_seeded_v1', '1');
};


const WeakLearnerReport = ({ lectures }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dimAnalysis, setDimAnalysis] = useState({});
  const [loadingAnalysis, setLoadingAnalysis] = useState({});
  const [filterFlag, setFilterFlag] = useState('all');

  // Seed dummy data once on mount (only for students 1–3, rest come from real LS)
  useEffect(() => {
    seedDummyData();
  }, []);

  const students = [
    'student1@paathshala.com','student2@paathshala.com','student3@paathshala.com',
    'student4@paathshala.com','student5@paathshala.com','student6@paathshala.com',
    'student7@paathshala.com','student8@paathshala.com','student9@paathshala.com',
    'student10@paathshala.com'
  ];

  const getStudentProfile = (email) => {
    const allKeys = Object.keys(localStorage);
    const watchHistory = JSON.parse(localStorage.getItem(`watch_history_${email}`) || '[]');
    const testResults = allKeys.filter(k => k.startsWith(`test_result_${email}_`)).map(k => JSON.parse(localStorage.getItem(k)));
    const cpAttempts = allKeys.filter(k => k.startsWith(`cp_attempt_${email}_`)).map(k => JSON.parse(localStorage.getItem(k)));
    const sessions = JSON.parse(localStorage.getItem(`sessions_${email}`) || '[]');
    const flagSummary = JSON.parse(localStorage.getItem(`flags_summary_${email}`) || '{}');

    const flags = {
      flag1: Object.values(flagSummary).some(f => f.flag1),
      flag2: Object.values(flagSummary).some(f => f.flag2),
      flag3: Object.values(flagSummary).some(f => f.flag3),
      flag4: Object.values(flagSummary).some(f => f.flag4),
      flag5: Object.values(flagSummary).some(f => f.flag5),
    };
    const flagCount = Object.values(flags).filter(Boolean).length;

    const avgScore = testResults.length > 0 ? (testResults.reduce((s,t) => s + parseFloat(t.score), 0) / testResults.length).toFixed(1) : null;
    const avgProgress = watchHistory.length > 0 ? (watchHistory.reduce((s,v) => s + v.progress, 0) / watchHistory.length).toFixed(1) : 0;

    // Calibration
    const calibTests = testResults.filter(t => t.calibration?.hasCalibrationData);
    const confidentWrong = calibTests.reduce((s,t) => s + (t.calibration.confidentWrong || 0), 0);

    // Bloom's avg per level
    const bloomByLevel = {};
    cpAttempts.forEach(a => { const l = `l${a.bloomLevel || 1}`; if (!bloomByLevel[l]) bloomByLevel[l] = []; bloomByLevel[l].push(a.score || 0); });
    const bloomAvg = {};
    Object.entries(bloomByLevel).forEach(([l, scores]) => { bloomAvg[l] = (scores.reduce((s,v) => s+v, 0) / scores.length).toFixed(0); });

    // Last activity
    const lastSession = sessions[sessions.length - 1];
    const daysSince = lastSession ? Math.floor((Date.now() - new Date(lastSession.timestamp)) / (24*60*60*1000)) : 999;

    return { email, name: email.split('@')[0], flags, flagCount, avgScore, avgProgress, cpAttempts: cpAttempts.length, testsTaken: testResults.length, confidentWrong, bloomAvg, daysSince, sessions: sessions.length };
  };

  const profiles = students.map(getStudentProfile);
  const filteredProfiles = filterFlag === 'all' ? profiles : profiles.filter(p => p.flags[filterFlag]);
  const atRiskCount = profiles.filter(p => p.flagCount >= 2).length;

  const runDeepAnalysis = async (profile) => {
    setLoadingAnalysis(prev => ({ ...prev, [profile.email]: true }));
    try {
      const allKeys = Object.keys(localStorage);
      const cpAttempts = allKeys.filter(k => k.startsWith(`cp_attempt_${profile.email}_`)).map(k => JSON.parse(localStorage.getItem(k)));
      const sessions = JSON.parse(localStorage.getItem(`sessions_${profile.email}`) || '[]');
      const watchHistory = JSON.parse(localStorage.getItem(`watch_history_${profile.email}`) || '[]');
      const avgProgress = watchHistory.length > 0 ? watchHistory.reduce((s,v) => s+v.progress, 0) / watchHistory.length : 0;
      const totalReplays = watchHistory.reduce((s,v) => { const rd = JSON.parse(localStorage.getItem(`replays_${profile.email}_${v.videoId}`) || '{"totalReplays":0}'); return s + (rd.totalReplays || 0); }, 0);

      const res = await fetch(`${API_BASE}/analyze-student-multidim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: profile.email, completionPct: avgProgress, replayCount: totalReplays, checkpointAttempts: cpAttempts, sessionHistory: sessions, classAvg: { score: 65, timeTaken: 120, replayCount: 2 } })
      });
      const data = await res.json();
      if (data.success) setDimAnalysis(prev => ({ ...prev, [profile.email]: data.analysis }));
    } catch (err) { console.error(err); }
    finally { setLoadingAnalysis(prev => ({ ...prev, [profile.email]: false })); }
  };

  const INTERVENTIONS = {
    flag1: { title: 'Content Gap', color: 'red', action: 'Assign prerequisite review material. Use the AI Chat gap analysis to identify which concepts are missing.' },
    flag2: { title: 'Passive Watcher', color: 'orange', action: 'Checkpoint tests are now enforced automatically. Suggest student takes notes while watching.' },
    flag3: { title: 'Cognitive Overload', color: 'purple', action: 'Check the replay heatmap — identify which segment they rewound most. Consider breaking that lecture section.' },
    flag4: { title: 'Metacognitive Gap', color: 'teal', action: 'Confidence tagging is active in Practice tests. Show student their calibration score and discuss the pattern.' },
    flag5: { title: 'Dropout Risk', color: 'blue', action: 'URGENT: Reach out personally. Offer a lower-stakes re-entry — suggest Practice tab in a lecture they already started.' },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weak Learner Dashboard</h1>
          <p className="text-gray-600 mt-1">Research-backed multi-dimensional student classification</p>
        </div>
        <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-3 text-center">
          <p className="text-3xl font-bold text-red-600">{atRiskCount}</p>
          <p className="text-xs text-red-700 font-semibold">At-Risk Students<br/>(2+ flags)</p>
        </div>
      </div>

      {/* Flag filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterFlag('all')} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${filterFlag === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300'}`}>All Students ({profiles.length})</button>
        {Object.entries(FLAG_META).map(([key, meta]) => {
          const count = profiles.filter(p => p.flags[key]).length;
          if (count === 0) return null;
          return (
            <button key={key} onClick={() => setFilterFlag(key)} className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${filterFlag === key ? meta.color + ' shadow' : 'bg-white text-gray-600 border-gray-300'}`}>
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Student grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProfiles.map(profile => (
          <div key={profile.email} className={`bg-white rounded-xl border-2 p-5 shadow transition-all cursor-pointer hover:shadow-md ${profile.flagCount >= 2 ? 'border-red-200' : profile.flagCount === 1 ? 'border-yellow-200' : 'border-gray-200'}`}
            onClick={() => setSelectedStudent(profile.email === selectedStudent ? null : profile.email)}>
            
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${profile.flagCount >= 2 ? 'bg-red-500' : profile.flagCount === 1 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {profile.name.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profile.name}</p>
                  <p className="text-xs text-gray-500">{profile.email}</p>
                </div>
              </div>
              <div className="text-right">
                {profile.avgScore !== null ? (
                  <span className={`text-lg font-bold ${parseFloat(profile.avgScore) >= 70 ? 'text-green-600' : parseFloat(profile.avgScore) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{profile.avgScore}%</span>
                ) : <span className="text-sm text-gray-400">No tests yet</span>}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
              {[
                { label: 'Progress', value: `${profile.avgProgress}%` },
                { label: 'Checkpoints', value: profile.cpAttempts },
                { label: 'Days since', value: profile.daysSince === 999 ? 'Never' : `${profile.daysSince}d` }
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg py-1.5 px-2">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Bloom's mini bars */}
            {Object.keys(profile.bloomAvg).length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Bloom's breakdown</p>
                <div className="flex gap-1">
                  {['l1','l2','l3','l4'].map(l => profile.bloomAvg[l] && (
                    <div key={l} className="flex-1 text-center">
                      <div className={`w-full rounded text-center text-xs font-bold py-0.5 ${parseInt(profile.bloomAvg[l]) >= 70 ? 'bg-green-400 text-white' : parseInt(profile.bloomAvg[l]) >= 50 ? 'bg-yellow-400 text-white' : 'bg-red-400 text-white'}`}>
                        {profile.bloomAvg[l]}%
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">L{l.slice(1)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flags */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(profile.flags).map(([key, active]) => active && (
                <span key={key} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${FLAG_META[key]?.color}`}>
                  {FLAG_META[key]?.label}
                </span>
              ))}
              {profile.flagCount === 0 && <span className="text-xs text-green-600 font-semibold">✓ No flags</span>}
            </div>

            {/* Expanded view */}
            {selectedStudent === profile.email && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4" onClick={e => e.stopPropagation()}>
                
                {/* Intervention playbook */}
                {Object.entries(profile.flags).filter(([,active]) => active).map(([key]) => (
                  <div key={key} className={`p-3 rounded-lg border-l-4 bg-gray-50 border-${INTERVENTIONS[key]?.color}-500`}>
                    <p className="text-xs font-bold text-gray-700 uppercase mb-1">🎯 {INTERVENTIONS[key]?.title} — Suggested Action</p>
                    <p className="text-sm text-gray-600">{INTERVENTIONS[key]?.action}</p>
                  </div>
                ))}

                {/* Metacognitive data */}
                {profile.confidentWrong > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-bold text-amber-800">⚠️ Calibration Alert</p>
                    <p className="text-sm text-amber-700">{profile.confidentWrong} confident-but-wrong responses detected. Student may be overconfident on specific concepts.</p>
                  </div>
                )}

                {/* Deep AI analysis */}
                {/* {dimAnalysis[profile.email] ? (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-indigo-800 mb-2">AI Deep Analysis</p>
                    <p className="text-sm text-indigo-700 mb-2"><strong>Primary weakness:</strong> {dimAnalysis[profile.email]?.primary_weakness?.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-indigo-700 mb-2"><strong>Recommended action:</strong> {dimAnalysis[profile.email]?.recommended_intervention}</p>
                  </div>
                ) : (
                  <button onClick={() => runDeepAnalysis(profile)} disabled={loadingAnalysis[profile.email]}
                    className="w-full py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                    {loadingAnalysis[profile.email] ? <><Loader className="animate-spin" size={14} />Running AI analysis...</> : <><Sparkles size={14} />Run Deep Analysis for {profile.name}</>}
                  </button>
                )} */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
// ==================== AUTOPROCTOR REPORT VIEWER ====================
// const ProctoringReportViewer = ({ studentEmail, videoId, onClose }) => {
//   const [sessions, setSessions] = useState([]);
//   const [activeSession, setActiveSession] = useState(null);
//   const [reportError, setReportError] = useState(null);

//   useEffect(() => {
//     // Collect all AP sessions for this student × video
//     const allKeys = Object.keys(localStorage);
//     const checkpoints = ['alpha', 'beta', 'omega'];
//     const found = [];

//     checkpoints.forEach(cp => {
//       const key = `ap_session_${studentEmail}_${videoId}_${cp}`;
//       const raw = localStorage.getItem(key);
//       if (raw) {
//         try {
//           const session = JSON.parse(raw);
//           found.push({ ...session, checkpoint: cp, key });
//         } catch (e) {}
//       }
//     });

//     // Also collect attempt data (violations count, score)
//     const cpAttempts = allKeys
//       .filter(k => k.startsWith(`cp_attempt_${studentEmail}_${videoId}_`))
//       .map(k => JSON.parse(localStorage.getItem(k)));

//     // Merge violations from attempts into sessions
//     const merged = found.map(s => {
//       const matchingAttempt = cpAttempts.find(a => a.checkpoint === s.checkpoint);
//       return {
//         ...s,
//         score: matchingAttempt?.score ?? s.score ?? null,
//         violationCount: matchingAttempt?.violations?.length ?? 0,
//         violations: matchingAttempt?.violations ?? [],
//         timeTaken: matchingAttempt?.timeTaken ?? null,
//       };
//     });

//     setSessions(merged);
//   }, [studentEmail, videoId]);

//   const openReport = async (session) => {
//     setActiveSession(session);
//     setReportError(null);

//     if (!window.AutoProctor) {
//       setReportError('AutoProctor script not loaded on this page. Add the script tag to index.html.');
//       return;
//     }
//     if (!session.testAttemptId || !session.clientId) {
//       setReportError('Missing testAttemptId or clientId — session was not proctored or credentials are missing.');
//       return;
//     }

//     try {
//       // Re-initialize AutoProctor with the same credentials used during the test
//       // CLIENT_SECRET is needed again to compute the hash for report viewing
//       const CLIENT_SECRET = process.env.REACT_APP_AP_CLIENT_SECRET || 'your-client-secret';
//       const enc = new TextEncoder();
//       const key = await crypto.subtle.importKey(
//         'raw', enc.encode(CLIENT_SECRET),
//         { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
//       );
//       const sig = await crypto.subtle.sign('HMAC', key, enc.encode(session.testAttemptId));
//       const hashedTestAttemptId = btoa(String.fromCharCode(...new Uint8Array(sig)));

//       const credentials = {
//         clientId: session.clientId,
//         testAttemptId: session.testAttemptId,
//         hashedTestAttemptId
//       };

//       const apInst = new window.AutoProctor(credentials);

//       // reportOptions controls what the teacher sees
//       const reportOptions = {
//         // Add any AutoProctor report display options here per their docs
//       };

//       apInst.showReport(reportOptions);
//     } catch (err) {
//       setReportError(`Could not open report: ${err.message}`);
//     }
//   };

//   const CP_LABELS = { alpha: 'Checkpoint 1 (25%)', beta: 'Checkpoint 2 (60%)', omega: 'Final Checkpoint' };
//   const CP_COLORS = { alpha: '#2563EB', beta: '#7C3AED', omega: '#0F172A' };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">

//         {/* Header */}
//         <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
//           <div>
//             <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Proctoring Report</p>
//             <h3 className="text-white font-bold">{studentEmail.split('@')[0]}</h3>
//           </div>
//           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
//             <X size={20} />
//           </button>
//         </div>

//         <div className="p-6">
//           {sessions.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-gray-500 text-sm">No proctored sessions found for this student on this lecture.</p>
//               <p className="text-gray-400 text-xs mt-2">Sessions are recorded when a student completes a checkpoint with AutoProctor active.</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <p className="text-xs text-gray-500 font-semibold uppercase mb-4">Select a checkpoint to view its proctoring report</p>

//               {sessions.map(session => (
//                 <div key={session.key} className="border border-gray-200 rounded-xl overflow-hidden">
//                   <div className="flex items-center justify-between px-5 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-2 h-10 rounded-full" style={{ backgroundColor: CP_COLORS[session.checkpoint] }}></div>
//                       <div>
//                         <p className="text-sm font-bold text-gray-800">{CP_LABELS[session.checkpoint]}</p>
//                         <p className="text-xs text-gray-400">
//                           {session.startedAt ? new Date(session.startedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unknown'}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       {/* Quick stats */}
//                       <div className="text-right">
//                         {session.score !== null && (
//                           <p className={`text-sm font-bold ${session.score >= 70 ? 'text-green-600' : session.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
//                             {session.score}%
//                           </p>
//                         )}
//                         {session.violationCount > 0 && (
//                           <p className="text-xs text-red-500 font-semibold">{session.violationCount} violation{session.violationCount > 1 ? 's' : ''}</p>
//                         )}
//                         {session.timeTaken && (
//                           <p className="text-xs text-gray-400">{session.timeTaken}s</p>
//                         )}
//                       </div>

//                       <button
//                         onClick={() => openReport(session)}
//                         className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors"
//                       >
//                         View Report
//                       </button>
//                     </div>
//                   </div>

//                   {/* Violations list */}
//                   {session.violations && session.violations.length > 0 && (
//                     <div className="px-5 pb-4 border-t border-gray-100">
//                       <p className="text-xs text-red-600 font-semibold mt-3 mb-2">Flagged events:</p>
//                       <div className="space-y-1">
//                         {session.violations.map((v, i) => (
//                           <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
//                             <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></span>
//                             <span className="font-mono text-gray-400">{v.time}</span>
//                             <span>{v.type || 'Monitoring event'}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Error state */}
//           {reportError && (
//             <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
//               <p className="text-sm font-semibold text-red-800 mb-1">Could not open report</p>
//               <p className="text-xs text-red-600">{reportError}</p>
//             </div>
//           )}

//           {activeSession && !reportError && (
//             <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
//               <p className="text-xs text-blue-700">
//                 Report for <strong>{CP_LABELS[activeSession.checkpoint]}</strong> opened in an AutoProctor popup window. If nothing appeared, check that popups are not blocked for this site.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// ==================== MAIN APP ====================
const App = () => {
const [isAuthenticated, setIsAuthenticated] = useState(() => {
  const saved = sessionStorage.getItem('isAuthenticated');
  return saved === 'true';
});
const [userType, setUserType] = useState(() => {
  return sessionStorage.getItem('userType');
});

const [userEmail, setUserEmail] = useState(() => {
  return sessionStorage.getItem('userEmail');
});

  const [currentView, setCurrentView] = useState('subjects');
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [showTranscript, setShowTranscript] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // const lectures = [
  //   {
  //     id: 1,
  //     title: "Turning Stories into Success: Handling Behaviour...",
  //     instructor: "Lochani GM",
  //     date: "7 Oct, 2025, 8:00 PM (IST)",
  //     tag: "Coding",
  //     isLive: true,
  //     duration: "1:14:24"
  //   },
  //   {
  //     id: 2,
  //     title: "Placement Session: CSBT - Mastering Screening ...",
  //     instructor: "Lochani GM",
  //     date: "4 Oct, 2025, 12:30 PM (IST)",
  //     tag: "Coding",
  //     isLive: true
  //   },
  //   {
  //     id: 3,
  //     title: "Interview Readiness CSBT Session",
  //     instructor: "Lochani GM",
  //     date: "20 Sep, 2025, 12:30 PM (IST)",
  //     tag: "Coding",
  //     isLive: true
  //   },
  //   {
  //     id: 4,
  //     title: "Git Session",
  //     instructor: "Ankush",
  //     date: "19 Sep, 2025, 8:00 PM (IST)",
  //     tag: "Coding",
  //     isLive: true
  //   },
  //   {
  //     id: 5,
  //     title: "Interview Readiness - CSBT Session",
  //     instructor: "Ravi Kumar",
  //     date: "13 Sep, 2025, 12:30 PM (IST)",
  //     tag: "Coding",
  //     isLive: true
  //   },
  //   {
  //     id: 6,
  //     title: "Working with OpenAI API - 1 - Placement",
  //     instructor: "Ankush",
  //     date: "9 Sep, 2025, 9:30 PM (IST)",
  //     tag: "Coding",
  //     isLive: true
  //   }
  // ];


const [lectures, setLectures] = useState([]);
const [loadingLectures, setLoadingLectures] = useState(true);

useEffect(() => {
  if (isAuthenticated) {
    fetchLectures();
  }
}, [isAuthenticated, userType]);

const fetchLectures = async () => {
  try {
    setLoadingLectures(true);
    const response = await fetch(`${API_BASE}/get-videos`);
    const data = await response.json();
    
    if (data.success) {
      setLectures(data.videos.map(video => ({
        id: video.id,
        title: video.title,
        instructor: video.instructor || 'Unknown',
        date: video.date,
        tag: video.subject,
        isLive: false,
        videoId: video.videoId,
        description: video.description
      })));
    }
  } catch (error) {
    console.error('Error fetching lectures:', error);
  } finally {
    setLoadingLectures(false);
  }
};

const handleLogin = (type, email) => {
  setUserType(type);
  setUserEmail(email);
  setIsAuthenticated(true);
  sessionStorage.setItem('userType', type);
  sessionStorage.setItem('userEmail', email);
  sessionStorage.setItem('isAuthenticated', 'true');
};
const handleLogout = () => {
  setIsAuthenticated(false);
  setUserType(null);
  setUserEmail(null);
  setSelectedLecture(null);
  setCurrentView('lectures');
  sessionStorage.removeItem('userType');
  sessionStorage.removeItem('userEmail');
  sessionStorage.removeItem('isAuthenticated');
};


  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

 return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userType={userType}
        onLogout={handleLogout}
      />
      <Header onLogout={handleLogout} userType={userType} />
      
      <div className="ml-52 pt-16">
        {selectedLecture ? (
          // 1. VIEW: Lecture Detail (Common for both)
          <LectureDetailWithVideo
            lecture={selectedLecture}
            onBack={() => setSelectedLecture(null)}
            userEmail={userEmail}
            userType={userType}
          />
        ) : userType === 'teacher' ? (
          // 2. VIEW: Teacher Logic
          currentView === 'subjects' ? (
            <SubjectsListView
              lectures={lectures}
              setSelectedSubject={setSelectedSubject}
              setCurrentView={setCurrentView}
            />
          ) : currentView === 'lectures' ? (
            <LecturesListView
              lectures={lectures}
              setSelectedLecture={setSelectedLecture}
              loadingLectures={loadingLectures}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          ) : currentView === 'analytics' ? (
  <TeacherAnalytics />
) : currentView === 'weaklearners' ? (
  <WeakLearnerReport lectures={lectures} />
) : (
  <TeacherUploadView />)
        ) : (
          // 3. VIEW: Student Logic (Updated)
          currentView === 'subjects' ? (
            <SubjectsListView
              lectures={lectures}
              setSelectedSubject={setSelectedSubject}
              setCurrentView={setCurrentView}
            />
          ) : currentView === 'scanner' ? (
            // This is the new part you needed!
            <StudentDocumentScanner />
          ) : (
            <LecturesListView
              lectures={lectures}
              setSelectedLecture={setSelectedLecture}
              loadingLectures={loadingLectures}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )
        )}
      </div>
    </div>
  );
};

export default App;