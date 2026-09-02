export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface ExecutionStep {
  stepIndex: number;
  code: string;
  title: string;
  subtitle: string;
  status: StepStatus;
  duration?: string;
  timestamp?: string;
  toolUsed?: string;
  details?: string;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
  category: 'SYSTEM' | 'ROUTING' | 'OCR' | 'RAG' | 'SANDBOX' | 'VERIFICATION';
}

export interface Citation {
  id: string;
  sourceName: string;
  sourceFile: string;
  page: number;
  section: string;
  snippet: string;
  confidence: number;
}

export interface Deliverable {
  id: string;
  name: string;
  type: 'DOCX' | 'XLSX' | 'PPTX' | 'PY' | 'CSV' | 'PDF';
  size: string;
  status: 'Verified' | 'Generating' | 'Draft';
  summary: string;
  downloadUrl?: string;
}

export interface Finding {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  description: string;
  evidenceSource: string;
  page: number;
}

export interface AgentTask {
  id: string;
  prompt: string;
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed';
  createdAt: string;
  duration?: string;
  selectedModel: string;
  selectedTools: string[];
  files: UploadedFile[];
  steps: ExecutionStep[];
  logs: ExecutionLog[];
  citations: Citation[];
  findings: Finding[];
  deliverables: Deliverable[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: 'PDF' | 'DOCX' | 'IMAGE' | 'XLSX';
  pages?: number;
  status: 'Ready' | 'Uploading' | 'Processed';
  contentSummary?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'TXT' | 'IMAGE';
  collection: 'SOPs' | 'Manuals' | 'Reports' | 'Policies';
  chunks: number;
  status: 'Indexed' | 'Processing' | 'Failed';
  size: string;
  updatedAt: string;
  previewText?: string;
}

export interface AIModel {
  id: string;
  name: string;
  role: string;
  category: 'GENERAL' | 'CODING' | 'VISION' | 'EMBEDDING';
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  localInference: boolean;
  contextWindow: string;
  vramUsage: string;
  gpuLoad: number;
  throughput: string;
  lastCheck: string;
}

export interface SecurityStatus {
  externalApiCount: number;
  cloudLlmCalls: number;
  externalConnections: number;
  dataLeavingMachine: number;
  airGapStatus: 'ACTIVE' | 'WARNING';
  sandboxIsolation: 'SANDBOXED' | 'UNPROTECTED';
  networkStatus: 'LOCAL ONLY';
  knowledgeBaseStatus: 'LOCAL (QDRANT)';
}

export interface SystemMetrics {
  gpuUsage: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  ragIndexingRate: string;
  activeAgents: number;
  totalDocuments: number;
  totalChunks: number;
}
