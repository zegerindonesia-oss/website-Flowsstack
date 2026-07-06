import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { courseService } from '@/lib/services/course.service';
import { workspaceService } from '@/lib/services/workspace.service';

export default async function WorkspaceOverviewPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  
  const courses = await courseService.getByWorkspace(workspaceId);
  const members = await workspaceService.getMembers(workspaceId);
  const workspace = await workspaceService.getById(workspaceId);

  const totalCourses = courses.length;
  const totalMembers = members.length;
  // Calculate total revenue from course price (mock logic: assuming everyone bought everything)
  // For now we'll just show 0
  const totalRevenue = 0;
  
  return (
    <div>
      <PageHeader title={workspace?.name ? `Workspace: ${workspace.name}` : "Workspace Overview"} description="Ringkasan aktivitas akademi Anda">
        <Link href={`/workspaces/${workspaceId}/courses/new`}>
          <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" /> Kursus Baru
          </Button>
        </Link>
      </PageHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: 'Total Pendapatan', value: `Rp ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: 'Kursus Aktif', value: totalCourses.toString(), icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50' },
          { title: 'Siswa Aktif', value: totalMembers.toString(), icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
          { title: 'Sertifikat Diterbitkan', value: '0', icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
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
          <CardHeader>
            <CardTitle className="text-lg font-heading">Siswa Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-sm text-muted-foreground">Belum ada siswa</div>
            ) : (
              <div className="space-y-4">
                {members.slice(0, 5).map((member, i) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 uppercase">
                      U{i+1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">User {member.userId.slice(0,5)}</p>
                      <p className="text-xs text-muted-foreground">Peran: {member.role}</p>
                    </div>
                    <div className="ml-auto text-xs text-sky-600 font-medium">Baru saja</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}