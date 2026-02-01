import { useState } from 'react';
import { ChecklistSection, ChecklistItem, ChecklistStatus } from '@/data/mockProcesses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusPill, getStatusLabel } from '@/components/StatusPill';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Check, X, ChevronDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistPanelProps {
  sections: ChecklistSection[];
  onItemUpdate: (sectionId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
}

export function ChecklistPanel({ sections, onItemUpdate }: ChecklistPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>(sections.map(s => s.id));

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSectionStats = (section: ChecklistSection) => {
    const ok = section.items.filter(i => i.status === 'ok').length;
    const blocked = section.items.filter(i => i.status === 'blocked').length;
    const pending = section.items.filter(i => i.status === 'pending').length;
    return { ok, blocked, pending, total: section.items.length };
  };

  const cycleStatus = (currentStatus: ChecklistStatus): ChecklistStatus => {
    const order: ChecklistStatus[] = ['pending', 'ok', 'blocked'];
    const currentIndex = order.indexOf(currentStatus);
    return order[(currentIndex + 1) % order.length];
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span>Checklist</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section) => {
          const stats = getSectionStats(section);
          const isOpen = openSections.includes(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="w-full">
                <div className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  "bg-muted/30 hover:bg-muted/50 transition-colors",
                  "text-left"
                )}>
                  <div className="flex items-center gap-2">
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {stats.blocked > 0 && (
                      <span className="text-destructive">{stats.blocked}⊗</span>
                    )}
                    {stats.pending > 0 && (
                      <span className="text-warning">{stats.pending}○</span>
                    )}
                    <span className="text-success">{stats.ok}✓</span>
                    <span className="text-muted-foreground">/ {stats.total}</span>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="mt-2 space-y-2 pl-2">
                  {section.items.map((item, index) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-3 rounded-lg border border-border/50",
                        "bg-card/50 hover:bg-card transition-colors",
                        "animate-fade-in"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => onItemUpdate(section.id, item.id, {
                              status: cycleStatus(item.status)
                            })}
                            className="shrink-0 hover:scale-110 transition-transform"
                          >
                            <StatusPill variant={item.status} size="sm">
                              {getStatusLabel(item.status)}
                            </StatusPill>
                          </button>
                          <span className={cn(
                            "text-sm",
                            item.status === 'ok' && "text-muted-foreground"
                          )}>
                            {item.title}
                          </span>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Evidência
                          </label>
                          <Input
                            value={item.evidence}
                            onChange={(e) => onItemUpdate(section.id, item.id, {
                              evidence: e.target.value
                            })}
                            placeholder="Ex: Doc anexado, Validado..."
                            className="h-8 text-sm bg-background/50"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Notas
                          </label>
                          <Textarea
                            value={item.notes}
                            onChange={(e) => onItemUpdate(section.id, item.id, {
                              notes: e.target.value
                            })}
                            placeholder="Observações..."
                            className="min-h-[60px] text-sm bg-background/50 resize-none"
                          />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-success hover:text-success hover:bg-success/10"
                            onClick={() => onItemUpdate(section.id, item.id, { status: 'ok' })}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Marcar OK
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => onItemUpdate(section.id, item.id, {
                              status: 'pending',
                              evidence: '',
                              notes: ''
                            })}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Limpar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </CardContent>
    </Card>
  );
}
