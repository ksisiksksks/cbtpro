import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ExamsTab() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [expandedExam, setExpandedExam] = useState(null);
  const [questions, setQuestions] = useState({}); // map examId to questions array

  // Exam Form
  const [examForm, setExamForm] = useState({ title: '', description: '', durationMinutes: 60, startTime: '', endTime: '', cloneFromId: '' });
  
  // Question Form
  const [questionForm, setQuestionForm] = useState({ text: '', options: [''], correctOption: '' });

  useEffect(() => {
    fetchExams();
  }, []);

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('adminToken')}` });

  const fetchExams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/exams', { headers: getHeaders() });
      setExams(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/exams/${examId}/questions`, { headers: getHeaders() });
      setQuestions(prev => ({ ...prev, [examId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleExam = (examId) => {
    if (expandedExam === examId) {
      setExpandedExam(null);
    } else {
      setExpandedExam(examId);
      fetchQuestions(examId);
    }
  };

  // --- EXAM CRUD ---
  const handleSaveExam = async (e) => {
    e.preventDefault();
    try {
      if (currentExam) {
        await axios.put(`http://localhost:5000/api/admin/exams/${currentExam.id}`, examForm, { headers: getHeaders() });
      } else {
        if (examForm.cloneFromId) {
          await axios.post(`http://localhost:5000/api/admin/exams/clone/${examForm.cloneFromId}`, examForm, { headers: getHeaders() });
        } else {
          await axios.post('http://localhost:5000/api/admin/exams', examForm, { headers: getHeaders() });
        }
      }
      setShowExamModal(false);
      fetchExams();
    } catch (err) {
      alert('Error saving exam');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/exams/${id}`, { headers: getHeaders() });
      fetchExams();
    } catch (err) {
      alert('Error deleting exam');
    }
  };

  // --- QUESTION CRUD ---
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...questionForm, options: JSON.stringify(questionForm.options) };
      if (currentQuestion) {
        await axios.put(`http://localhost:5000/api/admin/questions/${currentQuestion.id}`, payload, { headers: getHeaders() });
      } else {
        await axios.post(`http://localhost:5000/api/admin/exams/${currentExam.id}/questions`, payload, { headers: getHeaders() });
      }
      setShowQuestionModal(false);
      fetchQuestions(currentExam.id);
    } catch (err) {
      alert('Error saving question');
    }
  };

  const handleDeleteQuestion = async (examId, qId) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/questions/${qId}`, { headers: getHeaders() });
      fetchQuestions(examId);
    } catch (err) {
      alert('Error deleting question');
    }
  };

  if (loading) return <div>Loading exams...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Exam Management</h2>
        <button 
          onClick={() => { setCurrentExam(null); setExamForm({ title: '', description: '', durationMinutes: 60, startTime: '', endTime: '', cloneFromId: '' }); setShowExamModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Exam
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {exams.map(exam => (
          <div key={exam.id} className="border-b border-gray-100 last:border-0">
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleToggleExam(exam.id)}>
              <div className="flex items-center space-x-4">
                {expandedExam === exam.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                <div>
                  <h3 className="font-semibold text-gray-800">{exam.title}</h3>
                  <p className="text-sm text-gray-500">{exam._count?.questions || 0} Questions • {exam.durationMinutes} Minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentExam(exam); setExamForm({ title: exam.title, description: exam.description || '', durationMinutes: exam.durationMinutes, startTime: exam.startTime ? exam.startTime.slice(0,16) : '', endTime: exam.endTime ? exam.endTime.slice(0,16) : '' }); setShowExamModal(true); }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteExam(exam.id); }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {expandedExam === exam.id && (
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-gray-700">Questions</h4>
                  <button 
                    onClick={() => { setCurrentExam(exam); setCurrentQuestion(null); setQuestionForm({ text: '', options: ['A. ', 'B. ', 'C. ', 'D. ', 'E. '], correctOption: 'A' }); setShowQuestionModal(true); }}
                    className="text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Add Question
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(questions[exam.id] || []).length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No questions added yet.</p>
                  ) : (
                    questions[exam.id].map((q, i) => {
                      let opts = [];
                      try { opts = JSON.parse(q.options); } catch(e) { opts = q.options; }
                      return (
                        <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <span className="font-bold text-gray-500 mr-2">{i+1}.</span>
                              <span dangerouslySetInnerHTML={{ __html: q.text }} />
                              <div className="mt-2 pl-6 grid grid-cols-2 gap-2">
                                {opts.map((opt, idx) => (
                                  <div key={idx} className={`text-sm p-2 rounded ${String.fromCharCode(65+idx) === q.correctOption ? 'bg-green-50 text-green-700 font-medium' : 'bg-gray-50 text-gray-600'}`}>
                                    {String.fromCharCode(65+idx)}. <span dangerouslySetInnerHTML={{ __html: opt }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button onClick={() => { setCurrentExam(exam); setCurrentQuestion(q); setQuestionForm({ text: q.text, options: opts, correctOption: q.correctOption }); setShowQuestionModal(true); }} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteQuestion(exam.id, q.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{currentExam ? 'Edit Exam' : 'Create Exam'}</h3>
              <button onClick={() => setShowExamModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleSaveExam} className="p-6 space-y-4">
              {!currentExam && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gunakan Template Ujian (Opsional)</label>
                  <select 
                    value={examForm.cloneFromId} 
                    onChange={e => setExamForm({...examForm, cloneFromId: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 border-blue-200"
                  >
                    <option value="">-- Buat Ujian Kosong Baru --</option>
                    {exams.map(ex => (
                      <option key={ex.id} value={ex.id}>Duplikasi: {ex.title} ({ex._count?.questions || 0} Soal)</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Jika dipilih, seluruh soal dari ujian tersebut akan disalin ke ujian baru ini.</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" required value={examForm.title} onChange={e => setExamForm({...examForm, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={examForm.description} onChange={e => setExamForm({...examForm, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="datetime-local" value={examForm.startTime} onChange={e => setExamForm({...examForm, startTime: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="datetime-local" value={examForm.endTime} onChange={e => setExamForm({...examForm, endTime: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input type="number" required value={examForm.durationMinutes} onChange={e => setExamForm({...examForm, durationMinutes: parseInt(e.target.value)})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
                <button type="button" onClick={() => setShowExamModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal with RTE */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{currentQuestion ? 'Edit Question' : 'Add Question'}</h3>
              <button onClick={() => setShowQuestionModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="questionForm" onSubmit={handleSaveQuestion} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <ReactQuill theme="snow" value={questionForm.text} onChange={val => setQuestionForm({...questionForm, text: val})} className="h-40 mb-12" />
                </div>
                
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  {questionForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="pt-2 font-bold text-gray-500">{String.fromCharCode(65+idx)}.</div>
                      <div className="flex-1">
                        <ReactQuill theme="snow" value={opt} onChange={val => {
                          const newOpts = [...questionForm.options];
                          newOpts[idx] = val;
                          setQuestionForm({...questionForm, options: newOpts});
                        }} className="h-16 mb-10" />
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => setQuestionForm({...questionForm, options: [...questionForm.options, '']})} className="text-blue-600 text-sm font-medium hover:underline">+ Add Option</button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Option</label>
                  <select required value={questionForm.correctOption} onChange={e => setQuestionForm({...questionForm, correctOption: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select correct option...</option>
                    {questionForm.options.map((_, idx) => (
                      <option key={idx} value={String.fromCharCode(65+idx)}>{String.fromCharCode(65+idx)}</option>
                    ))}
                  </select>
                </div>
              </form>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button type="button" onClick={() => setShowQuestionModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" form="questionForm" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Question</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
