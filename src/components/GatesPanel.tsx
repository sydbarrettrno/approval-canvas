import { Gate, GateStatus } from '@/data/mockProcesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPill, getStatusLabel } from '@/components/StatusPill';
import { CheckCircle2, Circle, Loader2, XCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GatesPanelProps {
  gates: Gate[];
  onGateClick: (gate: Gate) => void;
  onGateLongPress: (gate: Gate) => void;
}

const statusIcons: Record<GateStatus, React.ReactNode> = {
  pending: <Circle className="h-5 w-5 text-warning" />,
  in_progress: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
  completed: <CheckCircle2 className="h-5 w-5 text-success" />,
  blocked: <XCircle className="h-5 w-5 text-destructive" />,
};

export function GatesPanel({ gates, onGateClick, onGateLongPress }: GatesPanelProps) {
  let pressTimer: NodeJS.Timeout;

  const handleMouseDown = (gate: Gate) => {
    pressTimer = setTimeout(() => {
      onGateLongPress(gate);
    }, 500);
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="text-gradient">Gates (Impeditivos)</span>
          <span className="text-xs text-muted-foreground font-normal">
            {gates.filter(g => g.status === 'completed').length}/{gates.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {gates.map((gate, index) => (
          <div
            key={gate.id}
            className={cn(
              "group flex items-center gap-3 p-3 rounded-lg cursor-pointer",
              "transition-all duration-200",
              "hover:bg-muted/50 active:bg-muted",
              "border border-transparent hover:border-border/50",
              "animate-slide-in"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
            onClick={() => onGateClick(gate)}
            onMouseDown={() => handleMouseDown(gate)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={() => handleMouseDown(gate)}
            onTouchEnd={handleMouseUp}
          >
            {/* Status Icon */}
            <div className="shrink-0">
              {statusIcons[gate.status]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "font-medium text-sm",
                  gate.status === 'completed' && "text-muted-foreground line-through"
                )}>
                  {gate.title}
                </span>
                <StatusPill variant={gate.status} size="sm">
                  {getStatusLabel(gate.status)}
                </StatusPill>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {gate.description}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0" />
          </div>
        ))}

        <p className="text-[10px] text-muted-foreground text-center pt-2">
          Clique para alternar status • Segure para bloquear
        </p>
      </CardContent>
    </Card>
  );
}
