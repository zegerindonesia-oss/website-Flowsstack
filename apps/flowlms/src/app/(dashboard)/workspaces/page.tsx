import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Building2, Plus, Users, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { workspaceService } from '@/lib/services/workspace.service';
import { redirect } from 'next/navigation';

export default async function WorkspacesPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  const userWorkspaces = await workspaceService.getByUserId(session.user.id);

  return (
    <div>
      <PageHeader title="Workspace" description="Kelola semua workspace Anda">
        <Link href="/workspaces/new">
          <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" /> Buat Workspace
          </Button>
        </Link>
      </PageHeader>
      {userWorkspaces.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Belum ada workspace"
          description="Buat workspace pertama Anda untuk mulai membuat kursus."
          action={{ label: 'Buat Workspace', href: '/workspaces/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userWorkspaces.map((member) => {
            const ws = member.workspace;
            return (
              <Link key={ws.id} href={`/workspaces/${ws.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${ws.themeColor}15` }}>
                        <Building2 className="w-6 h-6" style={{ color: ws.themeColor || '#0EA5E9' }} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-1">{ws.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">/{ws.slug}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {/* TODO: Add real stats */}
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> 0 kursus
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> 1 siswa
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}