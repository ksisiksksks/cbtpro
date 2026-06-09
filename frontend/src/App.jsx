import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import LoginSpmb from './pages/LoginSpmb';
import LoginCbt from './pages/LoginCbt';
import Dashboard from './pages/Dashboard';
import CbtExam from './pages/CbtExam';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login-spmb" element={<LoginSpmb />} />
          <Route path="/login-cbt" element={<LoginCbt />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam" element={<CbtExam />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/leaderboard/:id" element={<Leaderboard />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
