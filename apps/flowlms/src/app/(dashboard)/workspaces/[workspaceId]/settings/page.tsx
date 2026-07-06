import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default async function WorkspaceSettingsPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Pengaturan Workspace" description="Konfigurasi branding, domain, dan integrasi" />

      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Profil Workspace</CardTitle>
            <CardDescription>Ubah nama dan slug workspace Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Workspace</Label>
              <Input defaultValue="Akademi Digital Indonesia" />
            </div>
            <div className="space-y-2">
              <Label>Slug / URL</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  flowlms.com/
                </span>
                <Input defaultValue="akademi-digital" className="rounded-l-none" />
              </div>
            </div>
            <Button className="bg-sky-500 hover:bg-sky-600">Simpan Perubahan</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Branding & Tema</CardTitle>
            <CardDescription>Sesuaikan tampilan portal siswa Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Warna Utama</Label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[#0EA5E9] shadow-inner"></div>
                <Input defaultValue="#0EA5E9" className="w-32" />
              </div>
            </div>
            <Button variant="outline">Update Tema</Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Zona Berbahaya</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Menghapus workspace akan menghapus seluruh data secara permanen.</p>
            <Button variant="destructive">Hapus Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}