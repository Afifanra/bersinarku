import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, ArrowRight, Clock, CheckSquare, Phone, FileText, CheckCircle2,
  GraduationCap, Users, Heart, Building2, MapPin, Briefcase, Info, ShieldCheck,
  ClipboardList, BookOpen, UserCheck, Languages, Landmark, Globe, Mail,
  Calendar, CreditCard, Award, Star, Activity, Settings, HelpCircle, Search,
  Menu, X, ChevronRight, LayoutDashboard, LogOut, User, Bell, Home,
  MessageSquare, Share2, Download, Printer, Trash2, Edit, Plus, Save,
  Eye, EyeOff, Lock, Unlock, Key, Shield, AlertCircle, CheckCircle,
  XCircle, Clock3, History, BarChart3, PieChart, TrendingUp, Filter,
  SortAsc, SortDesc, MoreHorizontal, MoreVertical, ExternalLink,
  Github, Twitter, Facebook, Instagram, Linkedin, Youtube,
  Stethoscope, HeartPulse, Pill, Syringe, Microscope, Thermometer,
  Dna, Brain, Bone, Eye as EyeIcon, Ear, Baby, Accessibility,
  Ambulance, Hospital, Building, Warehouse, Factory, Store,
  ShoppingBag, ShoppingCart, CreditCard as CardIcon, Wallet,
  Banknote, Coins, Landmark as Bank, Receipt, Calculator,
  Smartphone, Laptop, Monitor, Tablet, Speaker, Headphones,
  Camera, Video, Mic, Music, Radio, Tv, Cast, Wifi, Bluetooth,
  Cloud, Server, Database, Code, Terminal, Cpu, HardDrive,
  Mouse, Keyboard, Printer as PrintIcon, Joystick,
  Gamepad, Rocket, Plane, Train, Bus, Car, Bike, Ship, Anchor,
  Compass, Map, Navigation, Flag, Target, Trophy, Medal,
  Dumbbell, Footprints, Mountain, Tent, Flower, Leaf,
  Sun, Moon, CloudRain, CloudLightning, Snowflake, Wind,
  Droplets, Flame, Zap, Ghost, Skull, Smile, Frown, Meh,
  Laugh, Heart as HeartIcon, ThumbsUp, ThumbsDown,
  Star as StarIcon, Bookmark, Tag, Hash, Link as LinkIcon,
  Paperclip, Scissors, Pen, Eraser, Brush, Palette,
  Image, Film, Play, Pause, Square, Circle, Triangle,
  Hexagon, Star as StarShape, Heart as HeartShape
} from 'lucide-react';

const LucideIcons: Record<string, any> = {
  ArrowLeft, ArrowRight, Clock, CheckSquare, Phone, FileText, CheckCircle2,
  GraduationCap, Users, Heart, Building2, MapPin, Briefcase, Info, ShieldCheck,
  ClipboardList, BookOpen, UserCheck, Languages, Landmark, Globe, Mail,
  Calendar, CreditCard, Award, Star, Activity, Settings, HelpCircle, Search,
  Menu, X, ChevronRight, LayoutDashboard, LogOut, User, Bell, Home,
  MessageSquare, Share2, Download, Printer, Trash2, Edit, Plus, Save,
  Eye, EyeOff, Lock, Unlock, Key, Shield, AlertCircle, CheckCircle,
  XCircle, Clock3, History, BarChart3, PieChart, TrendingUp, Filter,
  SortAsc, SortDesc, MoreHorizontal, MoreVertical, ExternalLink,
  Github, Twitter, Facebook, Instagram, Linkedin, Youtube,
  Stethoscope, HeartPulse, Pill, Syringe, Microscope, Thermometer,
  Dna, Brain, Bone, EyeIcon, Ear, Baby, Accessibility,
  Ambulance, Hospital, Building, Warehouse, Factory, Store,
  ShoppingBag, ShoppingCart, CardIcon, Wallet,
  Banknote, Coins, Bank, Receipt, Calculator,
  Smartphone, Laptop, Monitor, Tablet, Speaker, Headphones,
  Camera, Video, Mic, Music, Radio, Tv, Cast, Wifi, Bluetooth,
  Cloud, Server, Database, Code, Terminal, Cpu, HardDrive,
  Mouse, Keyboard, PrintIcon, Joystick,
  Gamepad, Rocket, Plane, Train, Bus, Car, Bike, Ship, Anchor,
  Compass, Map, Navigation, Flag, Target, Trophy, Medal,
  Dumbbell, Footprints, Mountain, Tent, Flower, Leaf,
  Sun, Moon, CloudRain, CloudLightning, Snowflake, Wind,
  Droplets, Flame, Zap, Ghost, Skull, Smile, Frown, Meh,
  Laugh, HeartIcon, ThumbsUp, ThumbsDown,
  StarIcon, Bookmark, Tag, Hash, LinkIcon,
  Paperclip, Scissors, Pen, Eraser, Brush, Palette,
  Image, Film, Play, Pause, Square, Circle, Triangle,
  Hexagon, StarShape, HeartShape
};

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  category?: string;
  icon?: string;
  fields?: any[];
}

export const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return;
      try {
        const docRef = doc(db, 'services', serviceId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() } as Service);
        }
      } catch (error) {
        console.error("Error fetching service details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-4">
          <FileText size={24} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Layanan Tidak Ditemukan</h3>
        <p className="text-slate-500 mb-6">Maaf, layanan yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Button asChild className="bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-full px-6">
          <Link to="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  const ServiceIcon = service.icon && LucideIcons[service.icon] ? LucideIcons[service.icon] : FileText;

  // Helper to format the description text into a nice list if it contains numbered items
  const formatDescription = (text: string) => {
    if (!text) return null;

    // Split text into sections based on common headers
    const sections = text.split(/(?=Alur Layanan :|Syarat untuk Layanan|Syarat layanan|Biaya\s*:|Waktu\s*:|Persyaratan lain yg Harus Terpenuhi:)/i);

    return (
      <div className="space-y-8">
        {sections.map((section, sIdx) => {
          const lines = section.split('\n').map(l => l.trim()).filter(l => l !== '');
          if (lines.length === 0) return null;

          const title = lines[0].endsWith(':') ? lines[0].slice(0, -1) : lines[0];
          const items = lines.slice(1);

          // If it's a simple line (like Biaya or Waktu), render it differently
          if (items.length === 0 && (title.toLowerCase().includes('biaya') || title.toLowerCase().includes('waktu'))) {
            return (
              <div key={sIdx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                <Info className="w-5 h-5 text-[#1e6b4d]" />
                <span className="font-semibold text-slate-700">{title}</span>
              </div>
            );
          }

          return (
            <div key={sIdx} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#1e6b4d] rounded-full" />
                {title}
              </h3>
              <ul className="space-y-3 pl-2">
                {items.map((item, index) => {
                  const isSubItem = /^[a-z]\./.test(item);
                  return (
                    <li key={index} className={`flex items-start gap-3 text-slate-700 ${isSubItem ? 'ml-8' : ''}`}>
                      {!isSubItem && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
                      {isSubItem && <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0 mt-2 ml-1" />}
                      <span className="leading-relaxed text-sm md:text-base">{item.replace(/^[0-9a-zA-Z-]+\.\s*/, '')}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container py-10 max-w-4xl mx-auto px-4">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#1e6b4d] font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Layanan
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-emerald-50 to-white p-8 md:p-10 border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-emerald-100 shrink-0">
              <ServiceIcon className="w-8 h-8 text-[#1e6b4d]" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-[#1e6b4d] text-xs font-bold rounded-full uppercase tracking-wider">
                  {service.category || "Umum"}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <p className="text-slate-500 flex items-center gap-1.5 text-xs font-medium">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Layanan Aktif
                </p>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {service.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Requirements List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                {formatDescription(service.description)}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#1e6b4d]" /> Informasi Proses
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Estimasi Waktu</p>
                    <p className="text-sm text-slate-800 font-medium">1-3 Hari Kerja</p>
                    <p className="text-xs text-slate-500 mt-1">Tergantung kelengkapan dokumen</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Biaya Layanan</p>
                    <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 inline-block px-2 py-1 rounded">Gratis (Rp 0)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  className="w-full rounded-xl h-12 bg-[#1e6b4d] hover:bg-[#15523a] text-white font-medium shadow-sm group"
                  onClick={() => navigate(`/apply/${service.id}`)}
                >
                  Ajukan Permohonan <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
                  onClick={() => window.open('https://wa.me/628113656262?text=Halo%20Admin%20Kemenag%20Jember,%20saya%20ingin%20bertanya%20tentang%20layanan%20' + encodeURIComponent(service.name), '_blank')}
                >
                  <Phone className="mr-2 w-4 h-4 text-emerald-600" /> Tanya via WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
