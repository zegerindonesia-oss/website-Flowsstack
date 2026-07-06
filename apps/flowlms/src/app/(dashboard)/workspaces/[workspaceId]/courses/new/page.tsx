'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCourseAction } from '@/app/actions/course';
import { toast } from 'sonner';

export default function NewCoursePage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const router = useRouter();
  const { workspaceId } = use(params);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    // Generate a simple slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const res = await createCourseAction(workspaceId, { title, slug, description });
    if (res.success) {
      toast.success('Kursus berhasil dibuat!');
      router.push(`/workspaces/${workspaceId}/courses/${res.courseId}/edit`);
    } else {
      toast.error(res.error || 'Gagal membuat kursus');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Buat Kursus Baru" description="Mulai susun materi dan kurikulum kursus Anda." />
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kursus</Label>
              <Input id="title" name="title" placeholder="Misal: React JS Masterclass" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea id="description" name="description" placeholder="Apa yang akan dipelajari di kursus ini?" rows={4} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
              {loading ? 'Membuat...' : 'Buat Kursus'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
