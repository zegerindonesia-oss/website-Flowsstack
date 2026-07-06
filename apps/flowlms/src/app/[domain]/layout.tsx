import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default async function StorefrontLayout({ children, params }: { children: React.ReactNode, params: Promise<{ domain: string }> }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">Akademi Digital</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#" className="text-slate-600 hover:text-sky-600">Katalog</Link>
            <Link href="#" className="text-slate-600 hover:text-sky-600">Tentang Kami</Link>
            <Link href="#" className="text-slate-600 hover:text-sky-600">Kontak</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600">Masuk</Link>
            <Link href="/register" className="text-sm font-medium px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors">Daftar</Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        {children}
      </main>
      <footer className="bg-white border-t py-12 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-slate-500">
          <p>&copy; 2026 Akademi Digital. Powered by FlowLMS.</p>
        </div>
      </footer>
    </div>
  );
}