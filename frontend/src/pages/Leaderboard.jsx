import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';

export default function Leaderboard() {
  const { id } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/exams/${id}/leaderboard`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold">
          <ArrowLeft size={20} /> Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 fade-in">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <Trophy size={64} className="mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-3xl font-black tracking-tight mb-2">Papan Peringkat (Leaderboard)</h1>
          <p className="text-amber-100 font-medium">Top 10 Nilai Tertinggi Tes CBT</p>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-12 text-center text-slate-500 font-medium">Memuat data peringkat...</div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">Belum ada peserta yang menyelesaikan ujian ini.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leaderboard.map((result, index) => (
                <div key={result.id} className={`flex items-center gap-6 p-6 transition-colors hover:bg-slate-50 ${index < 3 ? 'bg-amber-50/30' : ''}`}>
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center font-black text-xl rounded-2xl shadow-sm">
                    {index === 0 ? <Medal className="text-amber-500 w-8 h-8" /> : 
                     index === 1 ? <Medal className="text-slate-400 w-8 h-8" /> : 
                     index === 2 ? <Medal className="text-amber-700 w-8 h-8" /> : 
                     <span className="text-slate-400">{index + 1}</span>}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{result.student.fullName}</h3>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">NISN: {result.student.nisn}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black text-slate-800 tracking-tighter">
                      {result.score.toFixed(0)}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Poin</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
