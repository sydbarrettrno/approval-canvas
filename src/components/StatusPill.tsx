import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusPillVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        pending: "bg-warning/15 text-warning border border-warning/30",
        in_progress: "bg-primary/15 text-primary border border-primary/30",
        completed: "bg-success/15 text-success border border-success/30",
        ok: "bg-success/15 text-success border border-success/30",
        blocked: "bg-destructive/15 text-destructive border border-destructive/30",
        apto: "bg-success/20 text-success border border-success/40",
        nao_apto: "bg-destructive/20 text-destructive border border-destructive/40",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "pending",
      size: "default",
    },
  }
);

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusPillVariants> {}

export function StatusPill({ className, variant, size, ...props }: StatusPillProps) {
  return (
    <span className={cn(statusPillVariants({ variant, size }), className)} {...props} />
  );
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Pendente',
    in_progress: 'Em andamento',
    completed: 'Concluído',
    ok: 'OK',
    blocked: 'Bloqueado',
    APTO: 'APTO',
    NAO_APTO: 'NÃO APTO',
  };
  return labels[status] || status;
}
