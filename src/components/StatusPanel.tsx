import { Process } from '@/data/mockProcesses';
import { StatusPill } from '@/components/StatusPill';
import { ProgressRing } from '@/components/ProgressRing';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusPanelProps {
  process: Process;
}

export function StatusPanel({ process }: StatusPanelProps) {
  const completedGates = process.gates.filter(g => g.status === 'completed').length;
  const blockedGates = process.gates.filter(g => g.status === 'blocked').length;
  const pendingGates = process.gates.filter(g => g.status === 'pending' || g.status === 'in_progress').length;

  const allChecklistItems = process.checklistSections.flatMap(s => s.items);
  const completedItems = allChecklistItems.filter(i => i.status === 'ok').length;
  const blockedItems = allChecklistItems.filter(i => i.status === 'blocked').length;
  const pendingItems = allChecklistItems.filter(i => i.status === 'pending').length;

  const totalImpediments = blockedGates + blockedItems + pendingGates + pendingItems;

  return (
    <Card className="glass overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Status Badge & Progress */}
          <div className="flex flex-col items-center gap-3">
            <ProgressRing value={process.progress} size={100} strokeWidth={8} />
            <StatusPill 
              variant={process.status === 'APTO' ? 'apto' : 'nao_apto'}
              size="lg"
              className="font-bold"
            >
              {process.status === 'APTO' ? 'APTO' : 'NÃO APTO'}
            </StatusPill>
          </div>

          {/* Stats */}
          <div className="flex-1 w-full">
            {/* Message */}
            <p className="text-sm text-muted-foreground mb-4 text-center sm:text-left">
              {totalImpediments === 0 ? (
                <span className="text-success">Processo pronto para despacho</span>
              ) : (
                <>
                  Faltam <span className="text-foreground font-medium">{totalImpediments}</span> item
                  {totalImpediments > 1 ? 's' : ''} para despacho
                </>
              )}
            </p>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className={cn(
                "rounded-lg p-3 text-center transition-colors",
                blockedGates + blockedItems > 0 ? "bg-destructive/10" : "bg-muted/50"
              )}>
                <div className={cn(
                  "text-xl font-bold",
                  blockedGates + blockedItems > 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {blockedGates + blockedItems}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Bloqueados
                </div>
              </div>

              <div className={cn(
                "rounded-lg p-3 text-center transition-colors",
                pendingGates + pendingItems > 0 ? "bg-warning/10" : "bg-muted/50"
              )}>
                <div className={cn(
                  "text-xl font-bold",
                  pendingGates + pendingItems > 0 ? "text-warning" : "text-muted-foreground"
                )}>
                  {pendingGates + pendingItems}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Pendentes
                </div>
              </div>

              <div className="rounded-lg p-3 text-center bg-success/10">
                <div className="text-xl font-bold text-success">
                  {completedGates + completedItems}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Conformes
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
