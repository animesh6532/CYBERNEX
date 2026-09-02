import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ArrowRight, Eye, Code, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FileCard } from '../components/ui/FileCard';
import { MultimodalDemoModal } from '../components/workbench/MultimodalDemoModal';
import { CodingDemoModal } from '../components/workbench/CodingDemoModal';
import { useApp } from '../context/AppContext';
import { UploadedFile } from '../types';

export const WorkbenchPage: React.FC = () => {
  const navigate = useNavigate();
  const { runAgentSimulation, showToast } = useApp();

  const [prompt, setPrompt] = useState(
    'Analyze the inspection report, compare findings against SOP-704, and prepare an approval note.'
  );

  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: 'file-1',
      name: 'inspection_report.pdf',
      size: '4.2 MB',
      type: 'PDF',
      pages: 7,
      status: 'Ready',
    },
    {
      id: 'file-2',
      name: 'inspection_sop.pdf',
      size: '8.1 MB',
      type: 'PDF',
      pages: 24,
      status: 'Ready',
    },
  ]);

  const [selectedModel, setSelectedModel] = useState<string>('Auto');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'OCR',
    'Knowledge',
    'Documents',
  ]);

  const [multimodalModalOpen, setMultimodalModalOpen] = useState(false);
  const [codingModalOpen, setCodingModalOpen] = useState(false);

  const availableModels = ['Auto', 'General', 'Coding', 'Vision'];
  const availableTools = [
    { id: 'OCR', label: 'OCR' },
    { id: 'Knowledge', label: 'Knowledge' },
    { id: 'Code', label: 'Code Sandbox' },
    { id: 'Documents', label: 'Documents' },
  ];

  const handleToolToggle = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const uploaded: UploadedFile = {
        id: `file-${Date.now()}`,
        name: newFile.name,
        size: `${(newFile.size / (1024 * 1024)).toFixed(1)} MB`,
        type: newFile.name.endsWith('.pdf') ? 'PDF' : newFile.name.endsWith('.docx') ? 'DOCX' : 'IMAGE',
        pages: 5,
        status: 'Ready',
      };
      setFiles((prev) => [...prev, uploaded]);
      showToast(`Uploaded ${newFile.name}`);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const handleRunAgent = () => {
    if (!prompt.trim()) {
      showToast('Please enter a task description before running.');
      return;
    }
    const runId = runAgentSimulation(prompt, selectedModel, selectedTools, files);
    navigate(`/runs/${runId}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Page Title & Supporting Text */}
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Workbench
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Create a task and let CYBERNEX handle the work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye className="w-4 h-4 text-sky-600" />}
            onClick={() => setMultimodalModalOpen(true)}
          >
            P&ID Demo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Code className="w-4 h-4 text-sky-600" />}
            onClick={() => setCodingModalOpen(true)}
          >
            Sandbox Demo
          </Button>
        </div>
      </div>

      {/* Main Task Composer Focal Point */}
      <div className="glass-panel p-8 rounded-3xl border border-sky-300 space-y-6 shadow-xl relative cursor-glow-card">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-sky-900 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            What would you like CYBERNEX to do?
          </label>

          <button
            onClick={() =>
              setPrompt(
                'Analyze the inspection report, compare findings against SOP-704, and prepare an approval note.'
              )
            }
            className="text-xs font-bold text-sky-700 hover:text-sky-950 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sample Task
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="w-full p-4 rounded-2xl glass-input text-base text-[#0C4A6E] font-medium leading-relaxed resize-y placeholder-sky-400"
          placeholder="What would you like CYBERNEX to do?"
        />

        {/* Attachments */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span>Attachments ({files.length})</span>
            <label className="cursor-pointer text-sky-700 hover:text-sky-950 flex items-center gap-1 font-bold">
              <Upload className="w-3.5 h-3.5" /> Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {files.map((file) => (
              <FileCard key={file.id} file={file} onRemove={() => handleRemoveFile(file.id)} />
            ))}
          </div>
        </div>

        {/* Model & Tools Bar */}
        <div className="pt-4 border-t border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Model */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-900 uppercase">Model:</span>
            <div className="flex items-center gap-1">
              {availableModels.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedModel === m
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white/60 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-900 uppercase">Tools:</span>
            <div className="flex items-center gap-1">
              {availableTools.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolToggle(tool.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-sky-400/25 text-[#0C4A6E] border border-sky-300'
                        : 'bg-white/40 text-sky-700/60 hover:text-sky-900 border border-sky-200/60'
                    }`}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-4 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={handleRunAgent}
            className="min-w-[200px]"
          >
            Run task →
          </Button>
        </div>
      </div>

      <MultimodalDemoModal isOpen={multimodalModalOpen} onClose={() => setMultimodalModalOpen(false)} />
      <CodingDemoModal isOpen={codingModalOpen} onClose={() => setCodingModalOpen(false)} />
    </div>
  );
};
