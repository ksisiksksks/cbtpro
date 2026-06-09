import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function LoginCbt() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/student/login-cbt', {
        loginToken: token
      });
      
      // Simpan data CBT session
      localStorage.setItem('cbtToken', response.data.token);
      localStorage.setItem('cbtStudent', JSON.stringify(response.data.student));
      
      // Langsung arahkan ke halaman ujian
      navigate('/exam');
    } catch (err) {
      setError(err.response?.data?.message || 'Token tidak valid atau sudah kadaluarsa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center relative overflow-hidden px-4">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20">
        <ArrowLeft size={20} /> Kembali
      </Link>

      <div className="glass-dark p-10 rounded-3xl max-w-md w-full relative z-10 border border-slate-700 shadow-2xl fade-in text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-slate-700 relative">
            <KeyRound size={40} />
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight uppercase">Gerbang CBT</h2>
        <p className="text-slate-400 text-sm mt-2 mb-8">Ujian Berbasis Komputer Anti-Kecurangan</p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-6 border border-red-500/20 flex items-start justify-center gap-2 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-widest text-left">Token Ujian</label>
            <input 
              type="text" 
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              maxLength={6}
              className="w-full px-6 py-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 focus:bg-slate-900 outline-none transition-all text-center text-4xl font-black tracking-widest text-white placeholder-slate-600"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || token.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2 text-lg uppercase tracking-wide"
          >
            {loading ? 'Memverifikasi...' : 'Mulai Ujian'}
            {!loading && <ArrowRight size={24} />}
          </button>
        </form>
      </div>
    </div>
  );
}
