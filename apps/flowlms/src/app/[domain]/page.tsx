import { BookOpen, Users, Star } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default async function StorefrontPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  
  return (
    <div className="space-y-16">
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-slate-900">
          Kuasai Keahlian Baru Bersama Kami
        </h1>
        <p className="text-lg text-slate-600">
          Platform pembelajaran terpercaya untuk meningkatkan karir Anda di era digital. Belajar langsung dari praktisi ahli.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold">Katalog Kursus</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'c1', title: 'Fundamental Digital Marketing', price: 'Rp 499.000', students: 1250, rating: 4.8 },
            { id: 'c2', title: 'UI/UX Design Masterclass', price: 'Rp 799.000', students: 850, rating: 4.9 },
            { id: 'c3', title: 'Data Analytics untuk Pemula', price: 'Rp 599.000', students: 640, rating: 4.7 }
          ].map((course) => (
            <Link href={`/${domain}/courses/${course.id}`} key={course.id}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 h-full flex flex-col group">
                <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-sky-900/0 group-hover:bg-sky-900/10 transition-colors" />
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 mt-auto">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.students}</span>
                    <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /> {course.rating}</span>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="font-bold text-emerald-600">{course.price}</span>
                    <span className="text-sm font-medium text-sky-600">Lihat Detail &rarr;</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}