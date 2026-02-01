import { useState, useEffect, useCallback } from 'react';
import { Process, mockProcesses } from '@/data/mockProcesses';

const STORAGE_KEY = 'zrpi-processes';

export function useProcesses() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProcesses(JSON.parse(stored));
      } catch {
        setProcesses(mockProcesses);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProcesses));
      }
    } else {
      setProcesses(mockProcesses);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProcesses));
    }
    setIsLoading(false);
  }, []);

  const updateProcess = useCallback((updatedProcess: Process) => {
    setProcesses(prev => {
      const updated = prev.map(p => p.id === updatedProcess.id ? updatedProcess : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addProcess = useCallback((newProcess: Omit<Process, 'id'>) => {
    const process: Process = {
      ...newProcess,
      id: Date.now().toString(),
    };
    setProcesses(prev => {
      const updated = [process, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return process;
  }, []);

  const getProcess = useCallback((id: string) => {
    return processes.find(p => p.id === id);
  }, [processes]);

  return {
    processes,
    isLoading,
    updateProcess,
    addProcess,
    getProcess,
  };
}
