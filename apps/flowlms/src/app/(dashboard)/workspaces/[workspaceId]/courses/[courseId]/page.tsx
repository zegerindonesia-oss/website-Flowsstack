import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, GripVertical, Plus } from 'lucide-react';
import { courseService } from '@/lib/services/course.service';
import { updateCourseAction, createModuleAction, createLessonAction } from '@/app/actions/course';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function CourseBuilderPage({ params }: { params: Promise<{ workspaceId: string, courseId: string }> }) {
  const { workspaceId, courseId } = await params;
  
  const course = await courseService.getFullCourse(courseId);
  if (!course) {
    return notFound();
  }

  // Server actions for this specific page
  const updateCourse = async (formData: FormData) => {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseInt(formData.get('price') as string || '0', 10);
    await updateCourseAction(workspaceId, courseId, { title, description, price });
  };

  const addModule = async (formData: FormData) => {
    'use server';
    const title = formData.get('title') as string;
    await createModuleAction(courseId, { title, position: course.modules.length });
    revalidatePath(`/workspaces/${workspaceId}/courses/${courseId}/edit`);
    redirect(`/workspaces/${workspaceId}/courses/${courseId}/edit`);
  };

  const addLesson = async (formData: FormData) => {
    'use server';
    const title = formData.get('title') as string;
    const moduleId = formData.get('moduleId') as string;
    const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    const position = course.modules[moduleIndex].lessons.length;
    
    await createLessonAction(moduleId, { title, position, type: 'video' });
    revalidatePath(`/workspaces/${workspaceId}/courses/${courseId}/edit`);
    redirect(`/workspaces/${workspaceId}/courses/${courseId}/edit`);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <PageHeader title="Course Builder" description="Susun kurikulum dan materi kursus Anda">
        <Button variant="outline">Preview</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form action={updateCourse}>
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                <Button type="submit" className="bg-gradient-to-r from-sky-500 to-cyan-500 h-8 text-xs"><Save className="w-3 h-3 mr-2" /> Simpan</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Kursus</Label>
                  <Input id="title" name="title" defaultValue={course.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Singkat</Label>
                  <textarea id="description" name="description" className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" defaultValue={course.description || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" name="price" type="number" defaultValue={course.price} />
                </div>
              </CardContent>
            </Card>
          </form>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Kurikulum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    Belum ada modul. Buat modul pertama Anda.
                  </div>
                ) : (
                  course.modules.map((mod, modIdx) => (
                    <div key={mod.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-slate-50 p-3 flex items-center gap-3 border-b">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />
                        <span className="font-medium text-sm">Modul {modIdx + 1}: {mod.title}</span>
                      </div>
                      <div className="p-2 space-y-2">
                        {mod.lessons.map((les, lesIdx) => (
                          <div key={les.id} className="flex items-center gap-3 p-2 bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-md transition-colors group">
                            <GripVertical className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 cursor-move" />
                            <span className="text-sm flex-1">{les.title}</span>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-sky-600">Edit</Button>
                          </div>
                        ))}
                        
                        {/* Add Lesson Form */}
                        <form action={addLesson} className="flex items-center gap-2 mt-2">
                          <input type="hidden" name="moduleId" value={mod.id} />
                          <Input name="title" placeholder="Nama pelajaran baru..." className="h-8 text-xs" required />
                          <Button type="submit" variant="secondary" size="sm" className="h-8 text-xs shrink-0"><Plus className="w-3 h-3 mr-1"/> Lesson</Button>
                        </form>
                      </div>
                    </div>
                  ))
                )}

                {/* Add Module Form */}
                <form action={addModule} className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Input name="title" placeholder="Nama modul baru..." className="h-9" required />
                  <Button type="submit" variant="outline" className="h-9 shrink-0"><Plus className="w-4 h-4 mr-2"/> Tambah Modul</Button>
                </form>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-slate-100 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-sm text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
                <Plus className="w-8 h-8 mb-2 opacity-50" />
                Upload Cover
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}