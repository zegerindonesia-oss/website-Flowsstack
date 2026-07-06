'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createWorkspaceAction } from '@/app/actions/workspace';
import { toast } from 'sonner';

export default function NewWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;

    const res = await createWorkspaceAction({ name, slug });
    if (res.success) {
      toast.success('Workspace berhasil dibuat!');
      router.push(`/workspaces/${res.workspaceId}`);
    } else {
      toast.error(res.error || 'Gagal membuat workspace');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Buat Workspace Baru" description="Buat ruang kerja untuk perusahaan atau akademi Anda." />
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Perusahaan / Akademi</Label>
              <Input id="name" name="name" placeholder="Misal: Akademi Digital Cerdas" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" placeholder="akademi-digital-cerdas" required />
              <p className="text-xs text-muted-foreground">Ini akan menjadi URL unik untuk workspace Anda.</p>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
              {loading ? 'Membuat...' : 'Buat Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
