import { Process } from '@/data/mockProcesses';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPill } from '@/components/StatusPill';
import { ProgressRing } from '@/components/ProgressRing';
import { Calendar, User, FileText, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProcessCardProps {
  process: Process;
  onClick: () => void;
}

export function ProcessCard({ process, onClick }: ProcessCardProps) {
  const blockedCount = process.gates.filter(g => g.status === 'blocked').length;
  const pendingCount = process.gates.filter(g => g.status === 'pending' || g.status === 'in_progress').length;

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200",
        "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
        "hover:-translate-y-0.5 active:translate-y-0",
        "glass"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Progress Ring */}
          <div className="hidden sm:block shrink-0">
            <ProgressRing value={process.progress} size={64} strokeWidth={5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {process.numero}
                  </h3>
                  <StatusPill 
                    variant={process.status === 'APTO' ? 'apto' : 'nao_apto'}
                    size="sm"
                  >
                    {process.status === 'APTO' ? 'APTO' : 'NÃO APTO'}
                  </StatusPill>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {process.protocolo}
                </p>
              </div>

              {/* Mobile progress */}
              <div className="sm:hidden">
                <ProgressRing value={process.progress} size={48} strokeWidth={4} />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{process.requerente}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Mat. {process.matricula}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-3 text-xs">
                {blockedCount > 0 && (
                  <span className="text-destructive font-medium">
                    {blockedCount} bloqueado{blockedCount > 1 ? 's' : ''}
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="text-warning">
                    {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(process.lastUpdate), { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
