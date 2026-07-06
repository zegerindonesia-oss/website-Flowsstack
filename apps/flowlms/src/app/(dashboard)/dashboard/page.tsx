import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { BookOpen, Users, Award, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { title: 'Total Kursus', value: '12', change: '+2 bulan ini', icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50' },
  { title: 'Total Siswa', value: '847', change: '+124 bulan ini', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { title: 'Sertifikat Terbit', value: '234', change: '+45 bulan ini', icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
  { title: 'Completion Rate', value: '78%', change: '+5% dari bulan lalu', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' },
];

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description="Selamat datang kembali! Ini ringkasan aktivitas Anda.">
        <Link href="/workspaces">
          <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" /> Workspace Baru
          </Button>
        </Link>
      </PageHeader>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-heading font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-heading">Kursus Terbaru</CardTitle>
            <Link href="/workspaces" className="text-sm text-sky-600 hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Fundamental Digital Marketing', 'UI/UX Design Masterclass', 'Data Analytics untuk Pemula'].map((course, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{course}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 200 + 50)} siswa</p>
                  </div>
                  <div className="text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                    {['Published', 'Draft', 'Published'][i]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-heading">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { text: 'Ahmad Fauzi menyelesaikan kursus Digital Marketing', time: '2 jam lalu' },
                { text: 'Siti Rahma mendaftar di UI/UX Masterclass', time: '4 jam lalu' },
                { text: 'Sertifikat baru diterbitkan untuk Dian Pratama', time: '6 jam lalu' },
                { text: 'Modul baru ditambahkan ke Data Analytics', time: '1 hari lalu' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}