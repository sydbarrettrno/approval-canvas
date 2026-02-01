import { useState, useMemo } from 'react';
import { Process, Gate, GateStatus, ChecklistItem } from '@/data/mockProcesses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPanel } from '@/components/StatusPanel';
import { GatesPanel } from '@/components/GatesPanel';
import { ChecklistPanel } from '@/components/ChecklistPanel';
import { DevolutivaModal } from '@/components/DevolutivaModal';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  Copy, 
  Sun, 
  Moon,
  User,
  MapPin,
  FileCheck,
  Building
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProcessDetailProps {
  process: Process;
  onBack: () => void;
  onUpdate: (process: Process) => void;
}

export function ProcessDetail({ process, onBack, onUpdate }: ProcessDetailProps) {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [showBlockedFirst, setShowBlockedFirst] = useState(false);
  const [showDevolutiva, setShowDevolutiva] = useState(false);

  // Filter checklist sections based on search and toggles
  const filteredSections = useMemo(() => {
    let sections = process.checklistSections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        // Search filter
        if (search) {
          const searchLower = search.toLowerCase();
          const matchesSearch = 
            item.title.toLowerCase().includes(searchLower) ||
            item.evidence.toLowerCase().includes(searchLower) ||
            item.notes.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        
        // Only pending filter
        if (showOnlyPending && item.status === 'ok') {
          return false;
        }

        return true;
      })
    }));

    // Sort blocked first
    if (showBlockedFirst) {
      sections = sections.map(section => ({
        ...section,
        items: [...section.items].sort((a, b) => {
          if (a.status === 'blocked' && b.status !== 'blocked') return -1;
          if (b.status === 'blocked' && a.status !== 'blocked') return 1;
          return 0;
        })
      }));
    }

    // Remove empty sections
    return sections.filter(s => s.items.length > 0);
  }, [process.checklistSections, search, showOnlyPending, showBlockedFirst]);

  // Filter gates
  const filteredGates = useMemo(() => {
    let gates = [...process.gates];

    if (search) {
      const searchLower = search.toLowerCase();
      gates = gates.filter(g => 
        g.title.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower)
      );
    }

    if (showOnlyPending) {
      gates = gates.filter(g => g.status !== 'completed');
    }

    if (showBlockedFirst) {
      gates.sort((a, b) => {
        if (a.status === 'blocked' && b.status !== 'blocked') return -1;
        if (b.status === 'blocked' && a.status !== 'blocked') return 1;
        return 0;
      });
    }

    return gates;
  }, [process.gates, search, showOnlyPending, showBlockedFirst]);

  const handleGateClick = (gate: Gate) => {
    const statusOrder: GateStatus[] = ['pending', 'in_progress', 'completed'];
    const currentIndex = statusOrder.indexOf(gate.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    const updatedGates = process.gates.map(g =>
      g.id === gate.id ? { ...g, status: nextStatus } : g
    );

    const newProcess = recalculateProcess({
      ...process,
      gates: updatedGates,
    });

    onUpdate(newProcess);
    toast.success(`${gate.title}: ${nextStatus}`);
  };

  const handleGateLongPress = (gate: Gate) => {
    const updatedGates = process.gates.map(g =>
      g.id === gate.id ? { ...g, status: 'blocked' as GateStatus } : g
    );

    const newProcess = recalculateProcess({
      ...process,
      gates: updatedGates,
    });

    onUpdate(newProcess);
    toast.error(`${gate.title}: Bloqueado`);
  };

  const handleChecklistItemUpdate = (
    sectionId: string, 
    itemId: string, 
    updates: Partial<ChecklistItem>
  ) => {
    const updatedSections = process.checklistSections.map(section => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        items: section.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        ),
      };
    });

    const newProcess = recalculateProcess({
      ...process,
      checklistSections: updatedSections,
    });

    onUpdate(newProcess);
  };

  const recalculateProcess = (p: Process): Process => {
    const totalGates = p.gates.length;
    const completedGates = p.gates.filter(g => g.status === 'completed').length;
    const blockedGates = p.gates.filter(g => g.status === 'blocked').length;

    const allItems = p.checklistSections.flatMap(s => s.items);
    const totalItems = allItems.length;
    const completedItems = allItems.filter(i => i.status === 'ok').length;
    const blockedItems = allItems.filter(i => i.status === 'blocked').length;

    const totalTasks = totalGates + totalItems;
    const completedTasks = completedGates + completedItems;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const hasBlocked = blockedGates > 0 || blockedItems > 0;
    const allCompleted = completedTasks === totalTasks;
    const status = (allCompleted && !hasBlocked) ? 'APTO' : 'NAO_APTO';

    return {
      ...p,
      progress,
      status,
      lastUpdate: new Date().toISOString(),
    };
  };

  const handleCopyDevolutiva = () => {
    setShowDevolutiva(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-bold text-gradient">{process.numero}</h1>
                <p className="text-xs text-muted-foreground">{process.protocolo}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Process Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Process Identity */}
            <Card className="glass">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Requerente</p>
                    <p className="text-sm font-medium">{process.requerente}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Responsável Técnico</p>
                    <p className="text-sm font-medium">{process.rt}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Imóvel</p>
                    <p className="text-sm font-medium">{process.imovel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Matrícula</p>
                    <p className="text-sm font-medium">{process.matricula}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Panel */}
            <StatusPanel process={process} />
          </div>

          {/* Right Column - Gates & Checklist */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar no processo... (atalho: /)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Switch
                    id="detail-pending"
                    checked={showOnlyPending}
                    onCheckedChange={setShowOnlyPending}
                  />
                  <Label htmlFor="detail-pending" className="text-muted-foreground cursor-pointer">
                    Apenas pendentes
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="detail-blocked"
                    checked={showBlockedFirst}
                    onCheckedChange={setShowBlockedFirst}
                  />
                  <Label htmlFor="detail-blocked" className="text-muted-foreground cursor-pointer">
                    Bloqueios primeiro
                  </Label>
                </div>
              </div>
            </div>

            {/* Gates */}
            <GatesPanel 
              gates={filteredGates}
              onGateClick={handleGateClick}
              onGateLongPress={handleGateLongPress}
            />

            {/* Checklist */}
            <ChecklistPanel
              sections={filteredSections}
              onItemUpdate={handleChecklistItemUpdate}
            />
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCopyDevolutiva}
            >
              <FileText className="h-4 w-4 mr-2" />
              Gerar Devolutiva
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                setShowDevolutiva(true);
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
        </div>
      </footer>

      {/* Devolutiva Modal */}
      <DevolutivaModal
        process={process}
        open={showDevolutiva}
        onOpenChange={setShowDevolutiva}
      />
    </div>
  );
}
