import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, UploadCloud, CheckCircle2, AlertCircle, FileText, Clock, FileCheck } from 'lucide-react';

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState({ ijazah: false, kk: false });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProfile();
  }, [navigate]);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      if (!token) return navigate('/login');

      const res = await axios.get('http://localhost:5000/api/students/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudent(res.data);
    } catch (err) {
      console.error(err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/');
  };

  const simulateUpload = (type) => {
    // Simulate network upload
    setTimeout(() => {
      setUploads(prev => ({ ...prev, [type]: true }));
    }, 1000);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Memuat profil...</div>;
  if (!student) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">Portal CBT</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-medium hidden sm:block">Halo, {student.fullName}</span>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        
        {/* Left Column: Status & Profile */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Status Pendaftaran</h3>
            
            {student.status === 'PENDING' && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-amber-800 font-semibold text-sm">Menunggu Verifikasi</h4>
                  <p className="text-amber-700 text-xs mt-1">Silakan lengkapi berkas persyaratan. Admin sedang memproses data Anda.</p>
                </div>
              </div>
            )}
            
            {student.status === 'VERIFIED' && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-green-800 font-semibold text-sm">Berkas Diverifikasi</h4>
                  <p className="text-green-700 text-xs mt-1">Pendaftaran disetujui. Anda sudah dapat mengakses halaman ujian CBT sekarang.</p>
                </div>
              </div>
            )}

            {student.status === 'REJECTED' && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-red-800 font-semibold text-sm">Pendaftaran Ditolak</h4>
                  <p className="text-red-700 text-xs mt-1">Mohon maaf, berkas Anda tidak memenuhi syarat atau tidak valid.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">NISN</span>
                  <span className="font-medium text-slate-800">{student.nisn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telepon</span>
                  <span className="font-medium text-slate-800">{student.phone || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat</span>
                  <span className="font-medium text-slate-800 text-right max-w-[150px]">{student.address || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Uploads & CBT Action */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Kelengkapan Berkas (Syarat Ujian)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="border border-dashed border-slate-300 bg-slate-50 p-6 rounded-xl text-center hover:bg-slate-100 transition-colors cursor-pointer group relative">
                <input type="file" className="hidden" onChange={() => simulateUpload('ijazah')} />
                {uploads.ijazah ? (
                  <>
                    <FileCheck className="mx-auto text-green-500 mb-2" size={32} />
                    <p className="font-bold text-green-700 text-sm">Ijazah Diunggah</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors mb-2" size={32} />
                    <p className="font-semibold text-slate-700 text-sm">Upload Ijazah / SKL</p>
                    <p className="text-xs text-slate-500 mt-1">Format PDF/JPG (Maks 2MB)</p>
                  </>
                )}
              </label>

              <label className="border border-dashed border-slate-300 bg-slate-50 p-6 rounded-xl text-center hover:bg-slate-100 transition-colors cursor-pointer group relative">
                <input type="file" className="hidden" onChange={() => simulateUpload('kk')} />
                {uploads.kk ? (
                  <>
                    <FileCheck className="mx-auto text-green-500 mb-2" size={32} />
                    <p className="font-bold text-green-700 text-sm">KK Diunggah</p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors mb-2" size={32} />
                    <p className="font-semibold text-slate-700 text-sm">Upload Kartu Keluarga</p>
                    <p className="text-xs text-slate-500 mt-1">Format PDF/JPG (Maks 2MB)</p>
                  </>
                )}
              </label>
            </div>
            {(!uploads.ijazah || !uploads.kk) && <p className="text-amber-600 text-xs font-semibold mt-4 text-center">Pastikan semua berkas telah diunggah untuk mempercepat proses verifikasi.</p>}
          </div>

          {student.results && student.results.length > 0 ? (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Pengumuman Kelulusan</h3>
                <p className="text-emerald-100 mb-6 max-w-md">Anda telah menyelesaikan Ujian Seleksi CBT. Berikut adalah hasil ujian Anda.</p>
                <div className="bg-white/20 p-4 rounded-xl border border-white/30 backdrop-blur-sm max-w-sm">
                  <p className="text-sm font-medium text-emerald-50 mb-1">Skor Akhir ({student.results[0].exam.title})</p>
                  <p className="text-4xl font-black">{student.results[0].score.toFixed(0)}</p>
                  {student.results[0].score >= 70 ? (
                     <div className="mt-3 bg-green-500 text-white font-bold py-2 px-4 rounded-lg text-sm inline-block">SELAMAT! ANDA LULUS</div>
                  ) : (
                     <div className="mt-3 bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-sm inline-block">MOHON MAAF, ANDA TIDAK LULUS</div>
                  )}
                </div>
              </div>
              <CheckCircle2 size={160} className="absolute -bottom-10 -right-10 text-white/10" />
            </div>
          ) : (
            <div className={`p-8 rounded-2xl shadow-lg relative overflow-hidden transition-all ${student.status === 'VERIFIED' ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' : 'bg-slate-200 text-slate-500 opacity-80'}`}>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Ujian Seleksi (CBT)</h3>
                <p className={`mb-6 max-w-md ${student.status === 'VERIFIED' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {student.status === 'VERIFIED' 
                    ? "Berkas diverifikasi! Gunakan Token yang diberikan oleh Admin untuk login di Portal CBT."
                    : "Ujian CBT terkunci. Anda harus melengkapi berkas dan menunggu panitia melakukan verifikasi pendaftaran."}
                </p>
                
                <button 
                  onClick={() => navigate('/login-cbt')}
                  disabled={student.status !== 'VERIFIED'}
                  className={`font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all ${
                    student.status === 'VERIFIED' 
                      ? 'bg-white text-blue-700 hover:bg-blue-50 hover-lift' 
                      : 'bg-slate-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <FileText size={20} />
                  {student.status === 'VERIFIED' ? 'Ke Portal CBT' : 'Terkunci'}
                </button>
              </div>
              <FileText size={160} className={`absolute -bottom-10 -right-10 ${student.status === 'VERIFIED' ? 'text-white/10' : 'text-slate-300/50'}`} />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
