import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { loginWithGoogle, loginWithEmail } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCircle, Shield } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Silakan masukkan email dan password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      let errorMsg = 'Email atau password salah, atau akun tidak ditemukan.';
      if (error.code === 'auth/operation-not-allowed') {
        errorMsg = 'Metode login Email/Password belum diaktifkan di Firebase Console. Silakan aktifkan di Authentication > Sign-in method.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Format email tidak valid.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      let errorMsg = error.message || 'Terjadi kesalahan saat login';
      
      if (error.code === 'auth/popup-blocked') {
        errorMsg = 'Browser Anda memblokir popup login. Silakan izinkan popup untuk situs ini atau buka aplikasi di tab baru.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMsg = 'Domain ini belum diizinkan di Firebase Console. Pastikan URL aplikasi sudah ditambahkan di menu Authentication > Settings > Authorized domains.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Jendela login ditutup sebelum proses selesai. Silakan coba lagi.';
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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk ke Akun Anda</h2>
          <p className="mt-2 text-sm text-slate-500">
            Silakan masuk untuk mengajukan layanan atau mengakses dashboard admin.
          </p>
        </div>

        <div className="relative z-10 mt-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="admin@kemenag.go.id" 
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
              {loading ? 'Memproses...' : 'Masuk dengan Email'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Atau</span>
            </div>
          </div>

          <div>
            <Button 
              type="button"
              onClick={handleGoogleLogin} 
              disabled={loading}
              variant="outline"
              className="w-full h-11 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 text-base font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Masuk dengan Google
            </Button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Masyarakat umum disarankan menggunakan akun Google untuk kemudahan akses.
            </p>
            <div className="text-center mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-4">
                Belum punya akun?{' '}
                <Link to="/register" className="text-[#1e6b4d] font-semibold hover:underline">
                  Daftar di sini
                </Link>
              </p>
              
              {/* Admin Bypass Helper */}
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-left">
                <p className="text-xs text-emerald-800 font-medium mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Akses Admin (SuperAdmin):
                </p>
                <div className="flex flex-col gap-2">
                  <button 
                    type="button"
                    onClick={() => setEmail('afifsmikal@gmail.com')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    • afifsmikal@gmail.com
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEmail('hdikemenagjember@gmail.com')}
                    className="text-xs text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    • hdikemenagjember@gmail.com
                  </button>
                </div>
                <p className="text-[10px] text-emerald-600 mt-2 italic">
                  * Gunakan email di atas dan password yang Anda buat saat registrasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
