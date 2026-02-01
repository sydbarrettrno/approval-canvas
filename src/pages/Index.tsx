import { useState, useCallback, useEffect } from 'react';
import { Process } from '@/data/mockProcesses';
import { ProcessList } from '@/components/ProcessList';
import { ProcessDetail } from '@/components/ProcessDetail';
import { useProcesses } from '@/hooks/useProcesses';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { processes, isLoading, updateProcess, getProcess } = useProcesses();
  const { toggleTheme } = useTheme();
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const selectedProcess = selectedProcessId ? getProcess(selectedProcessId) : null;

  const handleProcessClick = useCallback((process: Process) => {
    setSelectedProcessId(process.id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProcessId(null);
  }, []);

  const handleNewProcess = useCallback(() => {
    // For now, just show a toast - this would open a creation modal in production
    console.log('New process clicked');
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '/',
      handler: () => {
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    },
    {
      key: 'g',
      handler: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      key: 't',
      handler: toggleTheme
    },
    {
      key: 'd',
      handler: () => {
        if (selectedProcess) {
          // Trigger devolutiva modal - this would be handled by the detail component
          const devolutivaBtn = document.querySelector('[data-devolutiva]') as HTMLButtonElement;
          if (devolutivaBtn) devolutivaBtn.click();
        }
      }
    },
    {
      key: 'Escape',
      handler: handleBack
    }
  ]);

  // Initialize dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando processos...</p>
        </div>
      </div>
    );
  }

  if (selectedProcess) {
    return (
      <ProcessDetail
        process={selectedProcess}
        onBack={handleBack}
        onUpdate={updateProcess}
      />
    );
  }

  return (
    <ProcessList
      processes={processes}
      onProcessClick={handleProcessClick}
      onNewProcess={handleNewProcess}
    />
  );
};

export default Index;
