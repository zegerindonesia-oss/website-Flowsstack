'use client';
import { Button } from '@/components/ui/button';
import { Building2, ChevronsUpDown } from 'lucide-react';

export function WorkspaceSwitcher({ currentWorkspaceId }: { currentWorkspaceId: string }) {
  return (
    <Button variant="outline" className="w-full justify-between text-left font-normal h-10">
      <div className="flex items-center gap-2 truncate">
        <div className="w-6 h-6 bg-gradient-to-br from-sky-500 to-cyan-500 rounded flex items-center justify-center">
          <Building2 className="w-3 h-3 text-white" />
        </div>
        <span className="truncate text-sm">Workspace</span>
      </div>
      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
}