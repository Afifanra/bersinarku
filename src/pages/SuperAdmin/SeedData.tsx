import React, { useState } from 'react';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { INITIAL_SERVICES } from '../../data/services';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Database, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleSeedServices = async () => {
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      // Optional: Clear existing services first if needed
      // const querySnapshot = await getDocs(collection(db, 'services'));
      // for (const document of querySnapshot.docs) {
      //   await deleteDoc(doc(db, 'services', document.id));
      // }

      for (const service of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', service.id), {
          name: service.name,
          category: service.category,
          icon: service.icon,
          description: service.description,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      setStatus({ type: 'success', message: `Berhasil menambahkan ${INITIAL_SERVICES.length} layanan ke database.` });
    } catch (error: any) {
      console.error("Error seeding services:", error);
      setStatus({ type: 'error', message: `Gagal menambahkan layanan: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl mx-auto px-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Database className="w-5 h-5 text-[#1e6b4d]" />
            </div>
            <CardTitle>Inisialisasi Data Layanan</CardTitle>
          </div>
          <CardDescription>
            Gunakan fitur ini untuk mengisi database dengan daftar 40 layanan standar Kemenag Jember beserta persyaratannya.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                Tindakan ini akan menambahkan atau memperbarui data layanan yang sudah ada berdasarkan ID layanan (1-40). Pastikan Anda memiliki koneksi internet yang stabil.
              </p>
            </div>

            {status.type && (
              <div className={`p-4 rounded-xl flex gap-3 ${status.type === 'success' ? 'bg-emerald-50 border border-emerald-100 text-emerald-800' : 'bg-red-50 border border-red-100 text-red-800'}`}>
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <Button 
              onClick={handleSeedServices} 
              disabled={loading}
              className="w-full h-12 bg-[#1e6b4d] hover:bg-[#15523a] text-white rounded-xl font-medium shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Memproses Data...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" /> Inisialisasi 40 Layanan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
