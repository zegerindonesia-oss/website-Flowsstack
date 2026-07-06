import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="font-heading font-semibold text-lg mb-1">Terjadi Kesalahan</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message ?? 'Silakan coba lagi nanti.'}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Coba Lagi</Button>}
    </div>
  );
}