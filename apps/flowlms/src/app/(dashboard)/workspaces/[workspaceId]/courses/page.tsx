import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { BookOpen, Plus, Edit2, PlayCircle, Settings, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { courseService } from '@/lib/services/course.service';

export default async function CoursesPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  const courses = await courseService.getByWorkspace(workspaceId);
  const hasCourses = courses.length > 0;
  
  return (
    <div>
      <PageHeader title="Manajemen Kursus" description="Kelola materi, kurikulum, dan harga kursus">
        <Link href={`/workspaces/${workspaceId}/courses/new`}>
          <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" /> Buat Kursus
          </Button>
        </Link>
      </PageHeader>

      {!hasCourses ? (
        <EmptyState 
          icon={BookOpen} 
          title="Belum ada kursus" 
          description="Mulai bangun portal edukasi Anda dengan membuat kursus pertama."
          action={{ label: 'Buat Kursus', href: `/workspaces/${workspaceId}/courses/new` }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-sm overflow-hidden group">
              <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative">
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-md shadow-sm">
                  {course.status}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-heading font-semibold text-lg line-clamp-1 mb-1">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description || 'Tidak ada deskripsi'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-emerald-600">
                    {course.price > 0 ? `Rp ${course.price.toLocaleString('id-ID')}` : 'Gratis'}
                  </span>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4"/> 0</span>
                    <span className="flex items-center gap-1"><PlayCircle className="w-4 h-4"/> 0h</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-2">
                  <Link href={`/workspaces/${workspaceId}/courses/${course.id}/edit`} className="flex-1">
                    <Button variant="outline" className="w-full text-xs h-8"><Edit2 className="w-3 h-3 mr-2" /> Edit Materi</Button>
                  </Link>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}