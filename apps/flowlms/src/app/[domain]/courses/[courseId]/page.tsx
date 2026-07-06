import { BookOpen, Users, Star, Clock, CheckCircle2, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function CourseDetailPage({ params }: { params: Promise<{ domain: string, courseId: string }> }) {
  const { domain, courseId } = await params;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-slate-900">
            Fundamental Digital Marketing
          </h1>
          <p className="text-lg text-slate-600">
            Pelajari strategi pemasaran digital terbukti untuk meningkatkan penjualan bisnis Anda dari nol hingga profit.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 pt-2">
            <span className="flex items-center gap-1 text-amber-500 font-medium"><Star className="w-4 h-4 fill-current" /> 4.8 (240 ulasan)</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 1,250 siswa</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 Jam</span>
          </div>
        </div>

        <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
          <PlayCircle className="w-16 h-16 text-white absolute z-10 opacity-90 group-hover:scale-110 transition-transform" />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold">Apa yang Akan Anda Pelajari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Strategi Social Media Marketing yang efektif',
              'Membuat iklan Facebook & Instagram Ads yang menguntungkan',
              'Dasar-dasar SEO untuk peringkat Google',
              'Email marketing automation',
              'Membaca Google Analytics',
              'Conversion Rate Optimization (CRO)'
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-heading font-bold">Kurikulum Kursus</h2>
          <div className="space-y-3">
            {[1, 2, 3].map(mod => (
              <div key={mod} className="border rounded-xl overflow-hidden">
                <div className="bg-slate-50 p-4 font-semibold border-b">Modul {mod}: Pengenalan Digital Marketing</div>
                <div className="divide-y">
                  {[1, 2, 3].map(les => (
                    <div key={les} className="p-4 flex items-center justify-between text-slate-600 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">Video Pembelajaran {mod}.{les}</span>
                      </div>
                      <span className="text-xs">10:00</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-0 shadow-lg sticky top-24">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold font-heading text-emerald-600 mb-2">Rp 499.000</div>
              <p className="text-sm text-slate-500 line-through">Rp 999.000</p>
            </div>
            <Link href={`/${domain}/learn/${courseId}`}>
              <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
                Beli Sekarang
              </Button>
            </Link>
            <p className="text-xs text-center text-slate-500">Akses seumur hidup. Garansi uang kembali 7 hari.</p>
            
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Level</span>
                <span className="font-medium text-slate-900">Pemula</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Akses Akses</span>
                <span className="font-medium text-slate-900">Seumur Hidup</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Sertifikat</span>
                <span className="font-medium text-slate-900">Ya, PDF Otomatis</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}