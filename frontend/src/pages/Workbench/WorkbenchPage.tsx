import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Code, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MultimodalDemoModal } from '@/components/ui/MultimodalDemoModal';
import { CodingDemoModal } from '@/components/ui/CodingDemoModal';
import { TaskComposer } from '@/components/workbench/TaskComposer';
import { RecentWork } from '@/components/workbench/RecentWork';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import { UploadedFile } from '@/types';

export const WorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTask, showToast } = useApp();

  const [prompt, setPrompt] = useState<string>('');
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('Auto');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'OCR',
    'Knowledge',
    'Documents',
  ]);

  const [recentTasksList, setRecentTasksList] = useState<any[]>([]);

  const [multimodalModalOpen, setMultimodalModalOpen] = useState<boolean>(false);
  const [codingModalOpen, setCodingModalOpen] = useState<boolean>(false);

  useEffect(() => {
    api.getTasks().then(tasks => {
      setRecentTasksList(tasks.slice(0, 5));
    }).catch(() => setRecentTasksList([]));
  }, []);

  const handleToolToggle = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleAddFiles = (uploadedFiles: FileList | File[]) => {
    const fileArray = Array.from(uploadedFiles);
    setRawFiles(prev => [...prev, ...fileArray]);

    const newFiles: UploadedFile[] = fileArray.map((f, i) => {
      const extension = f.name.split('.').pop()?.toUpperCase();
      let type: UploadedFile['type'] = 'PDF';
      if (extension === 'DOCX') type = 'DOCX';
      else if (extension === 'XLSX') type = 'XLSX';
      else if (['PNG', 'JPG', 'JPEG', 'WEBP'].includes(extension || '')) type = 'IMAGE';

      return {
        id: `file-temp-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type,
        pages: 1,
        status: 'Ready',
      };
    });

    setFiles((prev) => [...prev, ...newFiles]);
    showToast(`Added ${newFiles.length} file${newFiles.length > 1 ? 's' : ''}`);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const handleRunTask = async () => {
    if (!prompt.trim()) {
      showToast('Describe your task first.');
      return;
    }

    try {
      const fileIds: string[] = [];
      for (const rf of rawFiles) {
        const upRes = await api.uploadFile(rf);
        if (upRes && upRes.id) {
          fileIds.push(upRes.id);
        }
      }

      const res = await createTask(prompt, selectedModel, selectedTools, fileIds);
      navigate(`/runs/${res.run_id}`);
    } catch (err: any) {
      showToast(`Task creation failed: ${err.message || err}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Workbench Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Workbench
          </h2>
          <p className="text-sm text-sky-800 font-medium mt-0.5">
            Create a task and let CYBERNEX handle the work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<History className="w-4 h-4 text-sky-600" />}
            onClick={() => navigate('/runs')}
          >
            Recent runs
          </Button>
        </div>
      </div>

      {/* Main Task Composer */}
      <TaskComposer
        prompt={prompt}
        setPrompt={setPrompt}
        files={files}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedTools={selectedTools}
        onToggleTool={handleToolToggle}
        onRunTask={handleRunTask}
      />

      {/* Secondary Demo Capabilities Section */}
      <div className="p-4 rounded-2xl glass-panel border border-sky-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
            Explore capabilities
          </span>
          <p className="text-xs text-sky-800 font-medium">
            Test multimodal vision and sandboxed code execution workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={<Eye className="w-3.5 h-3.5 text-sky-600" />}
            onClick={() => setMultimodalModalOpen(true)}
          >
            P&ID Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Code className="w-3.5 h-3.5 text-sky-600" />}
            onClick={() => setCodingModalOpen(true)}
          >
            Sandbox Demo
          </Button>
        </div>
      </div>

      {/* Recent Work */}
      <RecentWork recentTasks={recentTasksList} />

      {/* Demo Modals */}
      <MultimodalDemoModal
        isOpen={multimodalModalOpen}
        onClose={() => setMultimodalModalOpen(false)}
      />
      <CodingDemoModal
        isOpen={codingModalOpen}
        onClose={() => setCodingModalOpen(false)}
      />
    </div>
  );
};
