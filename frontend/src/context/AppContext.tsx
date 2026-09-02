import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AgentTask, AIModel, DocumentItem, SecurityStatus, SystemMetrics } from '../types';
import { api } from '../lib/api';

interface AppContextType {
  documents: DocumentItem[];
  models: AIModel[];
  security: SecurityStatus;
  systemMetrics: SystemMetrics;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
  createTask: (prompt: string, model: string, tools: string[], file_ids: string[]) => Promise<{ task_id: string; run_id: string }>;
}

const defaultSecurityStatus: SecurityStatus = {
  externalApiCount: 0,
  cloudLlmCalls: 0,
  externalConnections: 0,
  dataLeavingMachine: 0,
  airGapStatus: 'ACTIVE',
  sandboxIsolation: 'SANDBOXED',
  networkStatus: 'LOCAL ONLY',
  knowledgeBaseStatus: 'LOCAL (QDRANT)',
};

const defaultSystemMetrics: SystemMetrics = {
  gpuUsage: 0,
  cpuUsage: 0,
  memoryUsage: 0,
  storageUsage: 0,
  ragIndexingRate: '0 chunks/s',
  activeAgents: 0,
  totalDocuments: 0,
  totalChunks: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [security, setSecurity] = useState<SecurityStatus>(defaultSecurityStatus);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(defaultSystemMetrics);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [docsData, modelsData, secData, sysData] = await Promise.allSettled([
        api.getDocuments(),
        api.getModels(),
        api.getSecurityStatus(),
        api.getSystemStatus(),
      ]);

      if (docsData.status === 'fulfilled') setDocuments(docsData.value);
      if (modelsData.status === 'fulfilled') setModels(modelsData.value);
      if (secData.status === 'fulfilled') setSecurity(secData.value);
      if (sysData.status === 'fulfilled') setSystemMetrics(sysData.value);
    } catch (err) {
      console.error('Failed to fetch backend application state:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createTask = async (prompt: string, model: string, tools: string[], file_ids: string[]) => {
    const res = await api.createTask(prompt, model, tools, file_ids);
    showToast(`Task created successfully. Initialized run #${res.run_id}`);
    await refreshData();
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        documents,
        models,
        security,
        systemMetrics,
        toastMessage,
        showToast,
        refreshData,
        createTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
