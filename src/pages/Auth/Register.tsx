import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { registerWithEmail } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Lock, Mail, User, ArrowRight, UserCircle } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Silakan lengkapi semua data.');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerWithEmail(email, password, name);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Registration Error Details:", error);
      let errorMsg = 'Terjadi kesalahan saat mendaftar.';
      if (error.code === 'auth/operation-not-allowed') {
        errorMsg = 'Metode pendaftaran Email/Password belum diaktifkan di Firebase Console. Silakan aktifkan di Authentication > Sign-in method.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'Email sudah terdaftar. Silakan gunakan email lain atau login.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Format email tidak valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password terlalu lemah.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-50 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-teal-50 rounded-full blur-xl"></div>

        <div className="relative z-10 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
            <UserCircle className="w-8 h-8 text-[#1e6b4d]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Akun Baru</h2>
          <p className="mt-2 text-sm text-slate-500">
            Lengkapi data di bawah untuk membuat akun SILAPU.
          </p>
        </div>

        <div className="relative z-10 mt-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-300 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-300 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-slate-300 focus:border-[#1e6b4d] focus:ring-[#1e6b4d]"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#1e6b4d] hover:bg-[#15523a] text-white text-base font-medium flex items-center justify-center"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-[#1e6b4d] font-semibold hover:underline">
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
