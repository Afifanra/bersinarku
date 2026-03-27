import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/firebase';
import { Button } from './ui/button';
import { 
  LogOut, UserCircle, MapPin, Phone, Mail, Clock, Lock, ShieldCheck,
  Menu, X, Home, Search, LayoutDashboard, Settings, ChevronDown, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Lacak Layanan', path: '/lacak', icon: Search },
  ];

  const authLinks = user ? [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['public', 'admin', 'leader', 'superadmin'] },
    { name: 'Admin Panel', path: '/admin', icon: Settings, roles: ['admin', 'superadmin'] },
    { name: 'Pimpinan', path: '/leader', icon: ShieldCheck, roles: ['leader', 'superadmin'] },
    { name: 'Super Admin', path: '/superadmin', icon: ShieldCheck, roles: ['superadmin'] },
  ] : [];

  const filteredAuthLinks = authLinks.filter(link => 
    !link.roles || (profile && link.roles.includes(profile.role))
  );

  const logoUrl = "https://lh3.googleusercontent.com/d/1AMR19XIsvLkdPXclGZfxolaQt2YYs_aO";

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 selection:bg-emerald-200 selection:text-emerald-900">
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={logoUrl} 
                  alt="SILAPU Logo" 
                  className="w-7 h-7 object-contain brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">SILAPU</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Kemenag Jember</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
              
              {filteredAuthLinks.length > 0 && (
                <div className="h-6 w-px bg-slate-200 mx-2" />
              )}

              {filteredAuthLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-slate-900">{profile?.name || user.displayName}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{profile?.role || 'User'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path) ? 'bg-emerald-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}
                
                <div className="py-2">
                  <div className="h-px bg-slate-100 mx-4" />
                </div>

                {filteredAuthLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive(link.path) ? 'bg-emerald-50 text-primary' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 px-4">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                          <UserCircle className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{profile?.name || user.displayName}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{profile?.role || 'User'}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="w-full justify-center rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Keluar
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full btn-primary"
                    >
                      <LogIn className="w-4 h-4 mr-2" /> Masuk
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <img 
                    src={logoUrl} 
                    alt="SILAPU Logo" 
                    className="w-8 h-8 object-contain brightness-0 invert"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">SILAPU</h3>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Kemenag Jember</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                Sistem Informasi Layanan Publik Terpadu Kantor Kementerian Agama Kabupaten Jember. Memberikan kemudahan akses layanan bagi seluruh elemen masyarakat.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-lg mb-8">Tautan Cepat</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronDown className="w-3 h-3 -rotate-90" /> Beranda</Link></li>
                <li><Link to="/lacak" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronDown className="w-3 h-3 -rotate-90" /> Lacak Layanan</Link></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-2"><ChevronDown className="w-3 h-3 -rotate-90" /> Masuk Petugas</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-8">Kontak Kami</h4>
              <ul className="space-y-5 text-sm text-slate-400">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Jl. Wahid Hasyim No. 6, Jember, Jawa Timur</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>kemenagjember@gmail.com</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span>Senin - Jumat: 08:00 - 15:00 WIB</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} SILAPU Kemenag Jember. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
