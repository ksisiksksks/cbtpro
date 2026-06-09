import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, AlertCircle, Send, ChevronRight, ChevronLeft, Video } from 'lucide-react';

export default function CbtExam() {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  const navigate = useNavigate();

  // Screen recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Anti-cheat variables
  const [cheatWarnings, setCheatWarnings] = useState(0);

  useEffect(() => {
    // Disable right click
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener('contextmenu', disableRightClick);

    // Disable copy paste
    const disableCopyPaste = (e) => e.preventDefault();
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('paste', disableCopyPaste);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('copy', disableCopyPaste);
      document.removeEventListener('paste', disableCopyPaste);
    };
  }, []);

  useEffect(() => {
    if (!exam || result) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        alert('PERINGATAN: Anda dilarang meninggalkan halaman ujian! Aktivitas ini dicatat sebagai pelanggaran.');
        setCheatWarnings(prev => prev + 1);
        try {
          const token = localStorage.getItem('studentToken');
          await axios.post('http://localhost:5000/api/exams/cheat', { examId: exam.id }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {
          console.error(e);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [exam, result]);

  // Request fullscreen on start
  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log(err));
    }
  };

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: false
      });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // chunk every 1 second
      setIsRecording(true);
      
      // Stop stream if user tries to stop sharing manually
      stream.getVideoTracks()[0].onended = () => {
        setIsRecording(false);
        alert('PERINGATAN: Perekaman layar dihentikan! Anda melanggar aturan monitoring.');
      };

      return true;
    } catch (err) {
      console.error('Screen recording failed', err);
      alert('Anda HARUS mengizinkan perekaman layar (Screen Share) untuk memulai ujian CBT ini.');
      return false;
    }
  };

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        if (!token) return navigate('/login');

        const res = await axios.get('http://localhost:5000/api/exams/latest', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Ensure user grants screen recording permission first
        const hasRecordingStarted = await startScreenRecording();
        if (!hasRecordingStarted) {
          navigate('/dashboard');
          return;
        }

        setExam(res.data);
        setQuestions(res.data.questions || []);
        setTimeLeft(res.data.durationMinutes * 60);

        // Tell backend exam started
        await axios.post('http://localhost:5000/api/exams/start', { examId: res.data.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Prompt fullscreen
        requestFullscreen();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExam();
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !result && exam && !loading) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && exam && !result && !loading) {
      handleSubmit(); // Auto submit when time is up
    }
  }, [timeLeft, exam, result, loading]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    setAnswers({
      ...answers,
      [questionId]: letters[optionIndex]
    });
  };

  const uploadScreenRecording = async () => {
    if (recordedChunksRef.current.length === 0) return;
    
    try {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('video', blob, 'recording.webm');
      formData.append('examId', exam.id);
      
      const token = localStorage.getItem('studentToken');
      const payload = JSON.parse(atob(token.split('.')[1]));
      formData.append('studentId', payload.studentId || payload.id);

      await axios.post('http://localhost:5000/api/exams/upload-recording', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (e) {
      console.error('Failed to upload recording', e);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }

      await uploadScreenRecording();

      const token = localStorage.getItem('studentToken');
      const res = await axios.post('http://localhost:5000/api/exams/submit', {
        examId: exam.id,
        answers
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirim jawaban. Coba lagi.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Menyiapkan Ujian & Perekaman Layar...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-slate-50">
        <AlertCircle size={48} className="text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Belum Ada Ujian Aktif</h2>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-blue-600 font-bold hover:underline">Kembali ke Dashboard</button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl text-center max-w-lg w-full shadow-2xl border border-slate-100">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl font-black text-green-600">{result.score.toFixed(0)}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Ujian Selesai!</h2>
          <p className="text-slate-500 mb-8">Jawaban dan rekaman layar ujian Anda berhasil diunggah.</p>
          <div className="space-y-3">
            <button onClick={() => navigate(`/leaderboard/${exam.id}`)} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors">
              Lihat Papan Peringkat (Leaderboard)
            </button>
            <button onClick={() => navigate('/dashboard')} className="w-full bg-slate-100 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-200 transition-colors">
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Exam Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="font-black text-xl text-slate-800">{exam.title}</h1>
            <p className="text-sm font-medium text-slate-500">Soal {currentIndex + 1} dari {questions.length}</p>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100 animate-pulse">
              <Video size={14} /> Screen Recording Aktif
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold shadow-md">
          <Clock size={20} className="text-blue-400" />
          <span className="tracking-wider">{formatTime(timeLeft)}</span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Area */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex-1">
            <div className="flex gap-6">
              <span className="font-black text-4xl text-slate-200 mt-1">{currentIndex + 1}.</span>
              <div className="flex-1">
                <div className="text-xl text-slate-800 mb-8 leading-relaxed prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: currentQ?.text }} />
                
                <div className="space-y-4">
                  {currentQ?.options && (typeof currentQ.options === 'string' ? JSON.parse(currentQ.options) : currentQ.options).map((opt, idx) => {
                    const letter = ['A', 'B', 'C', 'D', 'E'][idx];
                    const isSelected = answers[currentQ.id] === letter;
                    return (
                      <button 
                        key={idx}
                        onClick={() => handleAnswerSelect(currentQ.id, idx)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-5 group ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md ring-4 ring-blue-50' 
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-black text-sm transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                          {letter}
                        </div>
                        <div className="mt-1 flex-1 prose prose-sm" dangerouslySetInnerHTML={{ __html: opt }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-4 font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} /> Sebelumnya
            </button>
            
            {currentIndex === questions.length - 1 ? (
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-10 py-4 font-black text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {submitting ? 'Mengirim...' : 'Selesai & Kirim'}
                {!submitting && <Send size={20} />}
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-8 py-4 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Selanjutnya <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-28">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
              Navigasi Soal
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = currentIndex === idx;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                      isCurrent ? 'ring-4 ring-blue-200' : ''
                    } ${
                      isAnswered 
                        ? 'bg-blue-600 border-none text-white shadow-md' 
                        : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-800">
                <span className="font-semibold text-sm">Sudah Dijawab</span>
                <span className="font-black text-lg">{Object.keys(answers).length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200">
                <span className="font-semibold text-sm">Belum Dijawab</span>
                <span className="font-black text-lg">{questions.length - Object.keys(answers).length}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
