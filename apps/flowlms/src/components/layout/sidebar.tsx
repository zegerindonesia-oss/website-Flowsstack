'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Users, Award, BarChart3, Settings, Building2, GraduationCap, ChevronLeft, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { WorkspaceSwitcher } from './workspace-switcher';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Workspace', href: '/workspaces', icon: Building2 },
];

const workspaceNav = [
  { name: 'Overview', href: '', icon: LayoutDashboard },
  { name: 'Kursus', href: '/courses', icon: BookOpen },
  { name: 'Siswa', href: '/students', icon: Users },
  { name: 'Sertifikat', href: '/certificates', icon: Award },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Tim', href: '/team', icon: Users },
  { name: 'Pengaturan', href: '/settings', icon: Settings },
];

export function Sidebar({ workspaceId }: { workspaceId?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = workspaceId ? workspaceNav.map(item => ({ ...item, href: `/workspaces/${workspaceId}${item.href}` })) : navigation;

  return (
    <aside className={cn('fixed left-0 top-0 z-40 h-screen bg-sidebar-background border-r border-sidebar-border transition-all duration-300 flex flex-col', collapsed ? 'w-16' : 'w-64')}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">FlowLMS</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
        )}
        <Button variant="ghost" size="icon" className="hidden lg:flex h-8 w-8" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>
      {!collapsed && workspaceId && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <WorkspaceSwitcher currentWorkspaceId={workspaceId} />
        </div>
      )}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href.length > 1);
          return (
            <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground')}>
              <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      {workspaceId && !collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <Link href="/workspaces" className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" /> Semua Workspace
          </Link>
        </div>
      )}
    </aside>
  );
}