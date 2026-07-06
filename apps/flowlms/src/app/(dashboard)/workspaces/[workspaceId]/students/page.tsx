import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';

export default async function StudentsPage() {
  return (
    <div>
      <PageHeader title="Manajemen Siswa" description="Kelola akses dan kemajuan belajar siswa Anda">
        <Button className="bg-gradient-to-r from-sky-500 to-cyan-500">
          <UserPlus className="w-4 h-4 mr-2" /> Undang Siswa
        </Button>
      </PageHeader>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau email..." className="pl-9" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b font-medium">
                <tr>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4">Kursus Aktif</th>
                  <th className="px-6 py-4">Progress Rata-rata</th>
                  <th className="px-6 py-4">Bergabung Sejak</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">A</div>
                        <div>
                          <div className="font-medium text-slate-900">Ahmad Siswa {i}</div>
                          <div className="text-xs text-slate-500">ahmad{i}@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">2 Kursus</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500">{(Math.random() * 60 + 20).toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">12 Agt 2026</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-sky-600">Detail</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}