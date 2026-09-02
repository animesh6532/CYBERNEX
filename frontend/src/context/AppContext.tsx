import React, { createContext, useContext, useState } from 'react';
import { AgentTask, AIModel, DocumentItem, SecurityStatus, SystemMetrics, ExecutionStep, ExecutionLog } from '../types';
import { INITIAL_DEMO_TASK, MOCK_DOCUMENTS, MOCK_MODELS, MOCK_SECURITY, MOCK_SYSTEM_METRICS } from '../data/mockData';

interface AppContextType {
  activeTask: AgentTask;
  documents: DocumentItem[];
  models: AIModel[];
  security: SecurityStatus;
  systemMetrics: SystemMetrics;
  isSimulating: boolean;
  activeStepIndex: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  runAgentSimulation: (prompt: string, model: string, tools: string[], files: any[]) => string;
  addDocument: (doc: Partial<DocumentItem>) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTask, setActiveTask] = useState<AgentTask>(INITIAL_DEMO_TASK);
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [models] = useState<AIModel[]>(MOCK_MODELS);
  const [security] = useState<SecurityStatus>(MOCK_SECURITY);
  const [systemMetrics] = useState<SystemMetrics>(MOCK_SYSTEM_METRICS);
  
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(12);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const runAgentSimulation = (prompt: string, model: string, tools: string[], files: any[]): string => {
    const newRunId = `run-${Math.floor(1000 + Math.random() * 9000)}-cx`;
    
    const newSteps: ExecutionStep[] = INITIAL_DEMO_TASK.steps.map(s => ({
      ...s,
      status: s.stepIndex === 1 ? 'in_progress' : 'pending',
    }));

    const initialLogs: ExecutionLog[] = [
      {
        id: 'log-start',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: `Task initialized: "${prompt.slice(0, 60)}..."`,
        level: 'info',
        category: 'SYSTEM',
      },
    ];

    const newTask: AgentTask = {
      ...INITIAL_DEMO_TASK,
      id: newRunId,
      prompt: prompt || INITIAL_DEMO_TASK.prompt,
      status: 'running',
      createdAt: new Date().toLocaleString(),
      selectedModel: model || 'General (Llama-3-70B-Sovereign)',
      selectedTools: tools.length > 0 ? tools : INITIAL_DEMO_TASK.selectedTools,
      files: files.length > 0 ? files : INITIAL_DEMO_TASK.files,
      steps: newSteps,
      logs: initialLogs,
    };

    setActiveTask(newTask);
    setIsSimulating(true);
    setActiveStepIndex(1);

    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep <= 12) {
        setActiveStepIndex(currentStep);
        
        setActiveTask(prev => {
          const updatedSteps = prev.steps.map(s => {
            if (s.stepIndex < currentStep) return { ...s, status: 'completed' as const };
            if (s.stepIndex === currentStep) return { ...s, status: 'in_progress' as const };
            return s;
          });

          const stepInfo = prev.steps.find(s => s.stepIndex === currentStep);
          const newLog: ExecutionLog = {
            id: `log-${currentStep}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            message: `Executed step [${currentStep}/12]: ${stepInfo?.title} using ${stepInfo?.toolUsed}`,
            level: currentStep === 9 ? 'warn' : 'info',
            category: currentStep === 6 ? 'OCR' : currentStep === 7 || currentStep === 8 ? 'RAG' : 'SYSTEM',
          };

          return {
            ...prev,
            steps: updatedSteps,
            logs: [...prev.logs, newLog],
          };
        });
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setActiveTask(prev => ({
          ...prev,
          status: 'completed',
          steps: prev.steps.map(s => ({ ...s, status: 'completed' })),
        }));
        showToast('Agent Execution Completed. Deliverables ready for inspection.');
      }
    }, 1200);

    return newRunId;
  };

  const addDocument = (doc: Partial<DocumentItem>) => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: doc.name || 'Untitled_Document.pdf',
      type: doc.type || 'PDF',
      collection: doc.collection || 'Reports',
      chunks: doc.chunks || Math.floor(50 + Math.random() * 200),
      status: 'Indexed',
      size: doc.size || '3.5 MB',
      updatedAt: new Date().toISOString().split('T')[0],
      previewText: doc.previewText || 'Newly uploaded sovereign organizational document, successfully indexed in local Qdrant collection.',
    };
    setDocuments(prev => [newDoc, ...prev]);
    showToast(`Indexed document "${newDoc.name}" into local Knowledge Base.`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTask,
        documents,
        models,
        security,
        systemMetrics,
        isSimulating,
        activeStepIndex,
        sidebarCollapsed,
        setSidebarCollapsed,
        runAgentSimulation,
        addDocument,
        toastMessage,
        showToast,
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
