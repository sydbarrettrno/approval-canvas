import { useState, useMemo } from 'react';
import { Process } from '@/data/mockProcesses';
import { ProcessCard } from '@/components/ProcessCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Search, Sun, Moon, Filter } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ProcessListProps {
  processes: Process[];
  onProcessClick: (process: Process) => void;
  onNewProcess: () => void;
}

export function ProcessList({ processes, onProcessClick, onNewProcess }: ProcessListProps) {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [showBlockedFirst, setShowBlockedFirst] = useState(false);

  const filteredProcesses = useMemo(() => {
    let result = [...processes];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.numero.toLowerCase().includes(searchLower) ||
        p.protocolo.toLowerCase().includes(searchLower) ||
        p.requerente.toLowerCase().includes(searchLower) ||
        p.matricula.toLowerCase().includes(searchLower) ||
        p.imovel.toLowerCase().includes(searchLower)
      );
    }

    // Only pending filter
    if (showOnlyPending) {
      result = result.filter(p => p.status === 'NAO_APTO');
    }

    // Sort by blocked first
    if (showBlockedFirst) {
      result.sort((a, b) => {
        const aBlocked = a.gates.filter(g => g.status === 'blocked').length;
        const bBlocked = b.gates.filter(g => g.status === 'blocked').length;
        return bBlocked - aBlocked;
      });
    }

    return result;
  }, [processes, search, showOnlyPending, showBlockedFirst]);

  const stats = useMemo(() => {
    const total = processes.length;
    const aptos = processes.filter(p => p.status === 'APTO').length;
    const naoAptos = processes.filter(p => p.status === 'NAO_APTO').length;
    return { total, aptos, naoAptos };
  }, [processes]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">
                ZRPI Itapoá
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Painel de Aprovação
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="shrink-0"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={onNewProcess} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Novo Processo</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.aptos}</div>
            <div className="text-xs text-muted-foreground">Aptos</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{stats.naoAptos}</div>
            <div className="text-xs text-muted-foreground">Não Aptos</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, requerente, matrícula... (atalho: /)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 glass"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Switch
                id="pending"
                checked={showOnlyPending}
                onCheckedChange={setShowOnlyPending}
              />
              <Label htmlFor="pending" className="text-muted-foreground cursor-pointer">
                Apenas pendentes
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="blocked"
                checked={showBlockedFirst}
                onCheckedChange={setShowBlockedFirst}
              />
              <Label htmlFor="blocked" className="text-muted-foreground cursor-pointer">
                Bloqueios primeiro
              </Label>
            </div>
          </div>
        </div>

        {/* Process List */}
        <div className="space-y-3">
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum processo encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou busca</p>
            </div>
          ) : (
            filteredProcesses.map((process, index) => (
              <div
                key={process.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProcessCard
                  process={process}
                  onClick={() => onProcessClick(process)}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
