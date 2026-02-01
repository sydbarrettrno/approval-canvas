import { useState } from 'react';
import { Process, ChecklistItem, GateStatus } from '@/data/mockProcesses';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Copy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DevolutivaModalProps {
  process: Process;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DevolutivaModal({ process, open, onOpenChange }: DevolutivaModalProps) {
  const [copied, setCopied] = useState(false);

  const generateDevolutiva = () => {
    const lines: string[] = [];
    
    lines.push(`DEVOLUTIVA - ${process.numero}`);
    lines.push(`Protocolo: ${process.protocolo}`);
    lines.push(`Requerente: ${process.requerente}`);
    lines.push(`RT: ${process.rt}`);
    lines.push(`Imóvel: ${process.imovel}`);
    lines.push(`Matrícula: ${process.matricula}`);
    lines.push('');
    lines.push(`Status: ${process.status === 'APTO' ? 'APTO PARA DESPACHO' : 'NÃO APTO - PENDÊNCIAS IDENTIFICADAS'}`);
    lines.push('');
    
    // Gates
    const pendingGates = process.gates.filter(g => g.status !== 'completed');
    if (pendingGates.length > 0) {
      lines.push('═══ IMPEDITIVOS (GATES) ═══');
      pendingGates.forEach(gate => {
        const statusLabel = gate.status === 'blocked' ? '[BLOQUEADO]' : 
                           gate.status === 'in_progress' ? '[EM ANDAMENTO]' : '[PENDENTE]';
        lines.push(`${statusLabel} ${gate.title}`);
        lines.push(`   └─ ${gate.description}`);
      });
      lines.push('');
    }

    // Checklist issues
    const checklistIssues: { section: string; item: ChecklistItem }[] = [];
    process.checklistSections.forEach(section => {
      section.items.forEach(item => {
        if (item.status !== 'ok') {
          checklistIssues.push({ section: section.title, item });
        }
      });
    });

    if (checklistIssues.length > 0) {
      lines.push('═══ ITENS DO CHECKLIST PENDENTES ═══');
      let currentSection = '';
      checklistIssues.forEach(({ section, item }) => {
        if (section !== currentSection) {
          currentSection = section;
          lines.push(`\n▸ ${section}`);
        }
        const statusLabel = item.status === 'blocked' ? '[BLOQUEADO]' : '[PENDENTE]';
        lines.push(`  ${statusLabel} ${item.title}`);
        if (item.notes) {
          lines.push(`     Obs: ${item.notes}`);
        }
      });
      lines.push('');
    }

    if (process.status === 'APTO') {
      lines.push('═══════════════════════════════════');
      lines.push('PROCESSO APTO PARA DESPACHO');
      lines.push('Todas as pendências foram sanadas.');
      lines.push('═══════════════════════════════════');
    } else {
      lines.push('═══════════════════════════════════');
      lines.push('SOLICITAMOS A REGULARIZAÇÃO DOS ITENS ACIMA');
      lines.push('PARA PROSSEGUIMENTO DA ANÁLISE.');
      lines.push('═══════════════════════════════════');
    }

    lines.push('');
    lines.push(`Gerado em: ${new Date().toLocaleString('pt-BR')}`);

    return lines.join('\n');
  };

  const devolutivaText = generateDevolutiva();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(devolutivaText);
      setCopied(true);
      toast.success('Devolutiva copiada para a área de transferência');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col glass-strong">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Devolutiva
          </DialogTitle>
          <DialogDescription>
            Texto gerado automaticamente com base no status atual do processo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <pre className={cn(
            "text-sm font-mono whitespace-pre-wrap",
            "bg-muted/30 rounded-lg p-4",
            "border border-border/50"
          )}>
            {devolutivaText}
          </pre>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          <Button onClick={handleCopy} className="flex-1">
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
