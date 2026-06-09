import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, CheckCircle, GraduationCap, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-slate-800">CBT<span className="text-blue-600">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
            <a href="#beranda" className="hover:text-blue-600 transition-colors">Beranda</a>
            <a href="#alur" className="hover:text-blue-600 transition-colors">Alur Pendaftaran</a>
            <a href="#fasilitas" className="hover:text-blue-600 transition-colors">Fasilitas</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login-spmb" className="font-bold text-slate-600 hover:text-blue-600 transition-colors">Masuk Dasbor</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">Daftar Sekarang</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-20 right-0 w-[800px] h-[800px] bg-blue-100 rounded-full blur-[100px] opacity-60 -z-10 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-100 rounded-full blur-[100px] opacity-60 -z-10 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Pendaftaran Gelombang 1 Dibuka
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Langkah Awal Menuju <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Masa Depan</span> Gemilang.
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Sistem Penerimaan Murid Baru modern dengan fasilitas ujian Computer Based Test (CBT) terintegrasi Artificial Intelligence (AI).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 text-lg">
                <UserPlus size={22} /> Daftar Sekarang
              </Link>
              <Link to="/login-cbt" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-lg">
                <LogIn size={22} /> Masuk Ujian CBT
              </Link>
            </div>
            
            <div className="pt-8 flex items-center gap-6 border-t border-slate-200">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student 1" />
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Student 2" />
                <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Student 3" />
                <div className="w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">+500</div>
              </div>
              <p className="text-sm font-semibold text-slate-600">Telah bergabung <br/>di tahun ajaran lalu</p>
            </div>
          </div>
          
          <div className="relative fade-in">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80" alt="Students" className="w-full h-full object-cover" />
            </div>
            
            {/* Floating Badges */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <p className="font-black text-xl text-slate-800">Terakreditasi A</p>
                <p className="text-sm text-slate-500 font-medium">BAN-PT / BAN-SM</p>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow" style={{ animationDelay: '1s' }}>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <GraduationCap size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="font-black text-xl text-slate-800">Beasiswa Penuh</p>
                <p className="text-sm text-slate-500 font-medium">Tersedia 50+ Kuota</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section id="alur" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black mb-4">Alur Pendaftaran & Seleksi</h2>
            <p className="text-slate-400 text-lg">Proses transparan, cepat, dan sepenuhnya online.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 -z-0"></div>
            
            {[
              { step: "01", title: "Registrasi Online", desc: "Buat akun dengan email & NISN" },
              { step: "02", title: "Upload Berkas", desc: "Lengkapi data diri, Ijazah & KK" },
              { step: "03", title: "Ujian CBT AI", desc: "Kerjakan tes seleksi secara online" },
              { step: "04", title: "Pengumuman", desc: "Hasil keluar secara real-time" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-3xl text-blue-400 mb-6 shadow-xl shadow-blue-900/20">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas */}
      <section id="fasilitas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-slate-800 mb-4">Fasilitas Unggulan</h2>
            <p className="text-slate-500 text-lg">Mendukung penuh potensi akademik dan non-akademik siswa.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen />, title: "Perpustakaan Digital", desc: "Akses ribuan e-book dan jurnal internasional gratis." },
              { icon: <Award />, title: "Kurikulum Modern", desc: "Pendekatan belajar berbasis proyek dan teknologi terkini." },
              { icon: <Clock />, title: "Sistem Terintegrasi", desc: "Mulai dari pendaftaran hingga rapor bisa diakses online." }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">CBT<span className="text-blue-500">Pro</span></span>
            </div>
            <p className="max-w-sm mb-6">Sistem Penerimaan Murid Baru modern dengan fasilitas Computer Based Test (CBT) dan pemrosesan soal cerdas terintegrasi AI.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Kontak Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin size={20} className="text-blue-500 flex-shrink-0" /> <span>Jl. Pendidikan No. 123, Jakarta Pusat</span></li>
              <li className="flex items-center gap-3"><Phone size={20} className="text-blue-500 flex-shrink-0" /> <span>(021) 1234-5678</span></li>
              <li className="flex items-center gap-3"><Mail size={20} className="text-blue-500 flex-shrink-0" /> <span>info@cbtpro.edu</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Akses Cepat</h4>
            <ul className="space-y-3 font-medium">
              <li><Link to="/login-spmb" className="hover:text-blue-400 transition-colors">Masuk Dasbor Siswa</Link></li>
              <li><Link to="/login-cbt" className="hover:text-blue-400 transition-colors">Portal Ujian CBT</Link></li>
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Daftar Baru</Link></li>
              <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors">Portal Admin / Panitia</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; 2026 CBTPro Education Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
