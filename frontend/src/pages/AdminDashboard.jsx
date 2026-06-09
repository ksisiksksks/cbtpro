import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Users, FileUp, KeyRound, CheckCircle2, Activity, AlertTriangle, LayoutDashboard, FileCheck, Award, Download, Clock, XCircle, Search, BookOpen, Database, Video } from 'lucide-react';
import ExamsTab from '../components/admin/ExamsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // States
  const [stats, setStats] = useState({ totalStudents: 0, verifiedStudents: 0, pendingStudents: 0, totalExams: 0, activeSessions: 0 });
  const [students, setStudents] = useState([]);
  const [monitoring, setMonitoring] = useState([]);
  const [results, setResults] = useState([]);
  
  // Upload States
  const [file, setFile] = useState(null);
  const [examTitle, setExamTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Filters
  const [studentFilter, setStudentFilter] = useState('ALL'); // ALL, PENDING, VERIFIED, REJECTED
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData(activeTab);
  }, [activeTab, navigate]);

  // Polling for monitoring
  useEffect(() => {
    if (activeTab !== 'monitoring') return;
    const interval = setInterval(() => fetchData('monitoring'), 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      if (tab === 'dashboard') {
        const res = await axios.get('http://localhost:5000/api/admin/stats', { headers });
        setStats(res.data);
      } else if (tab === 'verification') {
        const res = await axios.get('http://localhost:5000/api/students', { headers });
        setStudents(res.data);
      } else if (tab === 'monitoring') {
        const res = await axios.get('http://localhost:5000/api/exams/monitoring', { headers });
        setMonitoring(res.data);
      } else if (tab === 'results') {
        const res = await axios.get('http://localhost:5000/api/exams/all-results', { headers });
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const updateStudentStatus = async (studentId, status) => {
    if (!window.confirm(`Yakin ingin mengubah status menjadi ${status}?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:5000/api/students/${studentId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData('verification');
    } catch (err) {
      alert('Gagal update status: ' + (err.response?.data?.message || err.message));
    }
  };

  const generateToken = async (studentId) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const res = await axios.post(`http://localhost:5000/api/students/${studentId}/token`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setStudents(students.map(s => s.id === studentId ? { ...s, user: { ...s.user, loginToken: res.data.token } } : s));
    } catch (err) {
      alert('Gagal membuat token: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUploadExam = async (e) => {
    e.preventDefault();
    if (!file) return alert('Pilih file PDF terlebih dahulu');

    setUploading(true);
    setUploadMsg('Mengekstrak teks & memproses dengan AI (Groq)... mohon tunggu.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', examTitle || 'Ujian Seleksi Baru');
    formData.append('durationMinutes', '120');

    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.post('http://localhost:5000/api/exams/upload-pdf', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadMsg(`Berhasil! Ujian dibuat dengan ${res.data.questionsCount} soal.`);
      setFile(null);
      setExamTitle('');
    } catch (err) {
      setUploadMsg('Gagal: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const downloadCSV = () => {
    if (results.length === 0) return alert('Belum ada data untuk didownload');
    const header = "Nama Siswa,NISN,Ujian,Skor,Waktu Selesai,Pelanggaran\n";
    const rows = results.map(r => `"${r.student.fullName}","${r.student.nisn}","${r.exam.title}",${r.score.toFixed(0)},"${new Date(r.updatedAt).toLocaleString()}","${r.cheatWarnings}"`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hasil_ujian_cbt.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => {
    if (studentFilter !== 'ALL' && s.status !== studentFilter) return false;
    if (searchQuery && !s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && !s.nisn.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white">A</div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">Super Admin</h1>
              <p className="text-xs text-slate-500">Portal CBTPro</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => setActiveTab('verification')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'verification' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileCheck size={20} /> Verifikasi Pendaftar
          </button>
          <button onClick={() => setActiveTab('exams')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'exams' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <BookOpen size={20} /> Bank Soal & Ujian
          </button>
          <button onClick={() => setActiveTab('exams_ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'exams_ai' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <FileUp size={20} /> Generate AI (PDF)
          </button>
          <button onClick={() => setActiveTab('monitoring')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'monitoring' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Activity size={20} /> Live Monitoring
          </button>
          <button onClick={() => setActiveTab('results')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'results' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Award size={20} /> Hasil Ujian CBT
          </button>
          <div className="pt-4 mt-4 border-t border-slate-800">
            <button onClick={() => setActiveTab('db_manager')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'db_manager' ? 'bg-red-600 text-white' : 'hover:bg-slate-800 text-red-400 hover:text-red-300'}`}>
              <Database size={20} /> Manajer Database
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white px-4 py-3 rounded-xl transition-colors font-medium bg-slate-800 hover:bg-red-600">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 flex-1 p-8">
        
        {/* Tab Content: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="fade-in space-y-6">
            <div>
              <h2 className="text-3xl font-black text-slate-800">Overview Dashboard</h2>
              <p className="text-slate-500 mt-1">Ringkasan statistik sistem penerimaan murid baru.</p>
            </div>

            {loading ? <div className="text-slate-500">Memuat statistik...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Users size={28}/></div>
                  <div><p className="text-sm font-semibold text-slate-500">Total Pendaftar</p><p className="text-3xl font-black text-slate-800">{stats.totalStudents}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 size={28}/></div>
                  <div><p className="text-sm font-semibold text-slate-500">Diverifikasi</p><p className="text-3xl font-black text-slate-800">{stats.verifiedStudents}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Clock size={28}/></div>
                  <div><p className="text-sm font-semibold text-slate-500">Menunggu</p><p className="text-3xl font-black text-slate-800">{stats.pendingStudents}</p></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Activity size={28}/></div>
                  <div><p className="text-sm font-semibold text-slate-500">Peserta Aktif CBT</p><p className="text-3xl font-black text-slate-800">{stats.activeSessions}</p></div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-8">
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-bold mb-2">Selamat Datang di Portal Admin!</h3>
                <p className="text-slate-300 leading-relaxed">
                  Anda memiliki kendali penuh atas sistem. Mulai dari meninjau berkas pendaftaran, membuat soal ujian CBT secara instan dengan kecerdasan buatan, hingga memonitor peserta ujian secara langsung tanpa harus berada di ruangan yang sama.
                </p>
                <button onClick={() => setActiveTab('verification')} className="mt-6 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">Cek Pendaftar Baru</button>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20">
                <BookOpen size={250} />
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Verification */}
        {activeTab === 'verification' && (
          <div className="fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Verifikasi Berkas Pendaftar</h2>
                <p className="text-slate-500 text-sm mt-1">Tinjau kelengkapan berkas (Ijazah, KK) dan tentukan kelayakan peserta.</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Cari nama/NISN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <select value={studentFilter} onChange={e => setStudentFilter(e.target.value)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none">
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING">Menunggu (Pending)</option>
                  <option value="VERIFIED">Diterima (Verified)</option>
                  <option value="REJECTED">Ditolak (Rejected)</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                  <tr className="text-slate-500 text-sm">
                    <th className="p-4 font-semibold">Nama / NISN</th>
                    <th className="p-4 font-semibold">Kontak & Alamat</th>
                    <th className="p-4 font-semibold text-center">Status Verifikasi</th>
                    <th className="p-4 font-semibold text-right">Aksi & Token CBT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? <tr><td colSpan="4" className="p-8 text-center text-slate-500">Memuat data...</td></tr> : filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{student.fullName}</p>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">{student.nisn}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <p>{student.email} | {student.phone || '-'}</p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-[250px]">{student.address || 'Alamat belum diisi'}</p>
                      </td>
                      <td className="p-4 text-center">
                        {student.status === 'VERIFIED' && <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold border border-green-200"><CheckCircle2 size={14}/> DITERIMA</span>}
                        {student.status === 'PENDING' && <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-200"><Clock size={14}/> MENUNGGU</span>}
                        {student.status === 'REJECTED' && <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs font-bold border border-red-200"><XCircle size={14}/> DITOLAK</span>}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          {student.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button onClick={() => updateStudentStatus(student.id, 'VERIFIED')} className="text-xs bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">Terima</button>
                              <button onClick={() => updateStudentStatus(student.id, 'REJECTED')} className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded-lg transition-colors">Tolak</button>
                            </div>
                          )}
                          
                          {student.status === 'VERIFIED' && (
                            student.user?.loginToken ? (
                              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-black font-mono border border-blue-200 shadow-sm"><KeyRound size={14} /> {student.user.loginToken}</span>
                            ) : (
                              <button onClick={() => generateToken(student.id)} className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"><KeyRound size={14} /> Generate Token</button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredStudents.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-medium">Tidak ada data yang cocok dengan filter.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Exams CRUD */}
        {activeTab === 'exams' && (
          <div className="fade-in max-w-7xl">
            <ExamsTab />
          </div>
        )}

        {/* Tab Content: Exams (Upload AI) */}
        {activeTab === 'exams_ai' && (
          <div className="fade-in max-w-3xl">
            <h2 className="text-3xl font-black text-slate-800 mb-6">Manajemen Bank Soal (AI)</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Ekstrak Soal dari PDF</h3>
                <p className="text-slate-500 text-sm mt-1">Upload berkas PDF berisi soal pilihan ganda. Sistem AI akan otomatis membaca, mengekstrak, dan menyimpannya menjadi ujian CBT interaktif.</p>
              </div>
              <form onSubmit={handleUploadExam} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Judul Ujian Baru</label>
                  <input type="text" value={examTitle} onChange={(e) => setExamTitle(e.target.value)} placeholder="Contoh: Tes Seleksi Akademik Gelombang 2" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Pilih File PDF</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 hover:border-blue-400 transition-colors relative cursor-pointer group">
                    <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                    <FileUp size={48} className="mx-auto text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                    {file ? <p className="font-bold text-blue-600 text-lg">{file.name}</p> : <><p className="font-bold text-slate-700 text-lg">Klik atau seret file PDF Anda ke sini</p><p className="text-sm text-slate-500 mt-2">Pastikan teks bisa diblok, bukan hasil jepretan kamera.</p></>}
                  </div>
                </div>
                {uploadMsg && <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${uploading ? 'bg-blue-50 text-blue-700' : uploadMsg.includes('Gagal') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {uploading && <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>}
                  {uploadMsg}
                </div>}
                <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2 text-lg">
                  {uploading ? 'Sedang Diproses AI...' : 'Generate Ujian CBT'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab Content: Monitoring */}
        {activeTab === 'monitoring' && (
          <div className="fade-in h-[calc(100vh-4rem)] flex flex-col">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3"><Activity className="text-amber-500" size={32}/> Live Monitoring CCTV</h2>
              <p className="text-slate-500 mt-1">Data *Anti-Cheat* terhubung langsung. Diperbarui otomatis setiap 5 detik secara *real-time*.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {monitoring.length === 0 ? (
                  <div className="col-span-full p-16 text-center text-slate-400 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">Tidak ada aktivitas ujian saat ini.</p>
                  </div>
                ) : monitoring.map(session => (
                  <div key={session.id} className={`p-6 rounded-3xl border-2 transition-all ${session.status === 'ONGOING' ? (session.cheatWarnings > 0 ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md' : 'border-blue-400 bg-white shadow-lg') : 'border-slate-200 bg-slate-50 opacity-70'}`}>
                    <div className="flex justify-between items-center mb-6">
                      <div className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${session.status === 'ONGOING' ? 'bg-blue-600 text-white shadow-sm animate-pulse' : 'bg-slate-300 text-slate-700'}`}>
                        {session.status === 'ONGOING' ? 'LIVE' : 'SELESAI'}
                      </div>
                      {session.cheatWarnings > 0 && (
                        <div className="flex items-center gap-1.5 text-xs font-black text-red-600 bg-red-100 border border-red-200 px-3 py-1.5 rounded-full shadow-sm animate-bounce-slow">
                          <AlertTriangle size={14}/> {session.cheatWarnings} PERINGATAN
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 mb-6">
                      <h3 className="font-black text-xl text-slate-800 line-clamp-1">{session.student.fullName}</h3>
                      <p className="text-sm font-bold text-slate-500 font-mono">{session.student.nisn}</p>
                    </div>
                    <div className="text-xs font-medium text-slate-600 bg-white/60 p-4 rounded-2xl border border-slate-200">
                      <p className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2">
                        <span className="text-slate-400">Modul</span> 
                        <span className="font-bold text-slate-800 text-right">{session.exam.title}</span>
                      </p>
                      <p className="flex justify-between items-center">
                        <span className="text-slate-400">Dimulai</span> 
                        <span className="font-bold text-slate-800 text-right">{new Date(session.startTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </p>
                    </div>
                    {session.recordingUrl && (
                      <a 
                        href={`http://localhost:5000${session.recordingUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 rounded-2xl text-xs transition-colors border border-blue-200"
                      >
                        <Video size={14} /> Lihat Rekaman Layar
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Results */}
        {activeTab === 'results' && (
          <div className="fade-in bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Hasil & Papan Peringkat</h2>
                <p className="text-slate-500 text-sm mt-1">Daftar nilai akhir dari semua peserta yang telah menyelesaikan tes CBT.</p>
              </div>
              <button onClick={downloadCSV} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg self-start sm:self-auto">
                <Download size={18} /> Export ke CSV
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10">
                  <tr className="text-slate-500 text-sm">
                    <th className="p-4 font-semibold w-16 text-center">Rank</th>
                    <th className="p-4 font-semibold">Identitas Peserta</th>
                    <th className="p-4 font-semibold">Modul Ujian</th>
                    <th className="p-4 font-semibold text-center">Integritas</th>
                    <th className="p-4 font-semibold text-right text-lg">Skor Akhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? <tr><td colSpan="5" className="p-8 text-center text-slate-500">Memuat data nilai...</td></tr> : results.length === 0 ? <tr><td colSpan="5" className="p-16 text-center text-slate-500 font-medium">Belum ada peserta yang menyelesaikan ujian.</td></tr> : results.map((r, idx) => (
                    <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${idx < 3 ? 'bg-amber-50/20' : ''}`}>
                      <td className="p-4 text-center">
                        {idx === 0 ? <span className="inline-block w-8 h-8 bg-amber-400 text-white font-black rounded-full leading-8 shadow-md shadow-amber-200">1</span> : 
                         idx === 1 ? <span className="inline-block w-8 h-8 bg-slate-300 text-slate-700 font-black rounded-full leading-8 shadow-md">2</span> : 
                         idx === 2 ? <span className="inline-block w-8 h-8 bg-amber-700 text-white font-black rounded-full leading-8 shadow-md">3</span> : 
                         <span className="font-bold text-slate-400">{idx + 1}</span>}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-lg">{r.student.fullName}</p>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">{r.student.nisn}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-medium">
                        {r.exam.title}
                        <p className="text-xs text-slate-400 font-normal mt-1">{new Date(r.updatedAt).toLocaleDateString('id-ID')} {new Date(r.updatedAt).toLocaleTimeString('id-ID')}</p>
                      </td>
                      <td className="p-4 text-center">
                        <div>
                          {r.cheatWarnings === 0 ? 
                            <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded"><CheckCircle2 size={14}/> Murni</span> : 
                            <span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded border border-red-100"><AlertTriangle size={14}/> {r.cheatWarnings} Pelanggaran</span>
                          }
                        </div>
                        {r.recordingUrl && (
                          <div className="mt-2">
                            <a 
                              href={`http://localhost:5000${r.recordingUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                            >
                              <Video size={12}/> Putar Rekaman
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-3xl font-black tracking-tighter text-slate-800">{r.score.toFixed(0)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Database Manager */}
        {activeTab === 'db_manager' && (
          <div className="fade-in max-w-4xl">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3"><Database className="text-red-500" size={32} /> Manajer Database Terpusat</h2>
              <p className="text-slate-500 mt-2">DANGER ZONE: Halaman ini memanipulasi *raw data* dari sistem. Harap berhati-hati sebelum menekan tombol hapus/reset.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-red-200 shadow-[0_10px_40px_-15px_rgba(239,68,68,0.2)]">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Pembersihan Massal (Hard Reset)</h3>
                <p className="text-slate-600 mb-6 text-sm">Fitur ini digunakan saat pergantian tahun ajaran atau pembersihan pasca uji coba.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 p-5 rounded-2xl bg-slate-50">
                    <h4 className="font-bold text-slate-700 mb-1">Reset Data Ujian (Peserta & Nilai)</h4>
                    <p className="text-xs text-slate-500 mb-4">Menghapus semua Sesi Ujian dan Nilai Ujian dari database. Siswa dan Soal tetap utuh.</p>
                    <button onClick={async () => {
                      if(prompt('Ketik "RESET" untuk menghapus semua data ujian & nilai:') === 'RESET') {
                        const token = localStorage.getItem('adminToken');
                        await axios.delete('http://localhost:5000/api/admin/database/clear/results', { headers: { Authorization: `Bearer ${token}` }});
                        alert('Semua data ujian berhasil direset!');
                        fetchData('dashboard');
                      }
                    }} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm">Reset Nilai & Ujian</button>
                  </div>

                  <div className="border border-red-200 p-5 rounded-2xl bg-red-50">
                    <h4 className="font-bold text-red-700 mb-1">Hapus Seluruh Data Siswa</h4>
                    <p className="text-xs text-red-600/80 mb-4">Menghapus *SEMUA* data siswa, pendaftar, dan nilainya. Data tidak dapat dipulihkan.</p>
                    <button onClick={async () => {
                      if(prompt('Ketik "HAPUS SISWA" untuk menghapus permanen semua pendaftar:') === 'HAPUS SISWA') {
                        const token = localStorage.getItem('adminToken');
                        await axios.delete('http://localhost:5000/api/admin/database/clear/students', { headers: { Authorization: `Bearer ${token}` }});
                        alert('Seluruh data siswa berhasil dihapus!');
                        fetchData('dashboard');
                      }
                    }} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm">Kosongkan Tabel Siswa</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
