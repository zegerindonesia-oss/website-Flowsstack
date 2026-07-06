import { GraduationCap, Menu, CheckCircle2, Circle, PlayCircle, FileText, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function LearningPlayerPage({ params }: { params: Promise<{ domain: string, courseId: string }> }) {
  const { domain, courseId } = await params;
  
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href={`/${domain}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline font-medium text-sm">Kembali ke Dashboard</span>
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
          <h1 className="font-heading font-semibold line-clamp-1">Fundamental Digital Marketing</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-sm font-semibold text-emerald-400">12% Selesai</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <div className="aspect-video bg-black w-full relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-20 h-20 text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer" />
            </div>
            {/* Mock Player Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-4 pb-3">
              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-sky-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">1.1 Pengenalan Konsep Marketing Modern</h2>
                <p className="text-sm text-slate-500">Modul 1: Pengenalan Digital Marketing</p>
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors shrink-0">
                Selesai & Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3>Deskripsi Materi</h3>
              <p>Pada video ini, kita akan membahas dasar-dasar digital marketing dan mengapa hal ini sangat penting di era sekarang. Anda akan mempelajari perbedaan antara inbound dan outbound marketing.</p>
              
              <h3>Bahan Tambahan</h3>
              <div className="not-prose mt-4">
                <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Slide Presentasi (PDF)</p>
                    <p className="text-xs text-slate-500">2.4 MB</p>
                  </div>
                  <Download className="w-5 h-5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </main>

        <aside className="w-full lg:w-80 bg-white border-l border-slate-200 flex flex-col h-[calc(100vh-4rem)]">
          <div className="p-4 border-b border-slate-200 flex items-center gap-2 font-semibold text-slate-800 shrink-0">
            <Menu className="w-5 h-5" />
            Daftar Materi
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map(mod => (
              <div key={mod} className="border-b border-slate-100 last:border-0">
                <div className="p-4 bg-slate-50 font-medium text-sm text-slate-800 sticky top-0">
                  Modul {mod}: Pengenalan
                </div>
                <div className="divide-y divide-slate-100">
                  {[1, 2, 3].map(les => (
                    <div key={les} className={`p-4 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${mod === 1 && les === 1 ? 'bg-sky-50/50 relative' : ''}`}>
                      {mod === 1 && les === 1 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
                      )}
                      {(mod === 1 && les === 2) ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className={`w-5 h-5 shrink-0 ${mod === 1 && les === 1 ? 'text-sky-500 fill-sky-100' : 'text-slate-300'}`} />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm leading-tight ${mod === 1 && les === 1 ? 'font-medium text-sky-900' : 'text-slate-600'}`}>
                          {mod}.{les} Materi Pembelajaran
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <PlayCircle className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400">10:00</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}