import React, { useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AttachmentArea } from './AttachmentArea';
import { ModelSelector } from './ModelSelector';
import { ToolSelector } from './ToolSelector';
import { UploadedFile } from '@/types';

interface TaskComposerProps {
  prompt: string;
  setPrompt: (value: string) => void;
  files: UploadedFile[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (fileId: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedTools: string[];
  onToggleTool: (toolId: string) => void;
  onRunTask: () => void;
}

export const TaskComposer: React.FC<TaskComposerProps> = ({
  prompt,
  setPrompt,
  files,
  onAddFiles,
  onRemoveFile,
  selectedModel,
  setSelectedModel,
  selectedTools,
  onToggleTool,
  onRunTask,
}) => {
  const composerRef = useRef<HTMLDivElement>(null);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!composerRef.current) return;
    const rect = composerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    composerRef.current.style.setProperty('--mouse-x', `${x}px`);
    composerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const sampleSuggestion =
    'Analyze an inspection report and prepare an approval note.';

  const handleApplySuggestion = () => {
    setPrompt(
      'Analyze the inspection report, compare findings against SOP-704, and prepare an approval note.'
    );
  };

  return (
    <div
      ref={composerRef}
      onMouseMove={handleMouseMove}
      className="glass-gradient-card rounded-3xl p-6 sm:p-8 border border-sky-300/70 space-y-6 shadow-xl relative overflow-hidden cursor-glow-card transition-all duration-300 font-sans"
    >
      {/* Top subtle line glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/40 to-transparent pointer-events-none" />

      {/* Composer Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-black text-[#0C4A6E] tracking-tight">
          Create a task
        </h3>
        <p className="text-xs text-sky-800 font-medium">
          What would you like CYBERNEX to work on?
        </p>
      </div>

      {/* Task Textarea Input */}
      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your task..."
          className="w-full min-h-[160px] max-h-[260px] p-4 rounded-2xl bg-white/40 border border-sky-200/90 focus:border-sky-400 focus:bg-white/60 focus:ring-2 focus:ring-sky-300/40 text-base text-[#0C4A6E] font-medium leading-relaxed resize-y placeholder-sky-500/70 transition-all outline-none"
        />

        {/* Suggestion below placeholder */}
        {!prompt && (
          <div className="flex items-center gap-1.5 px-1 text-xs">
            <span className="text-sky-700/80 font-medium">Try:</span>
            <button
              type="button"
              onClick={handleApplySuggestion}
              className="text-sky-700 hover:text-sky-950 font-bold underline decoration-sky-300/80 underline-offset-2 flex items-center gap-1 transition-colors text-left"
            >
              <Sparkles className="w-3 h-3 text-sky-600 shrink-0" />
              {sampleSuggestion}
            </button>
          </div>
        )}
      </div>

      {/* Attachments Section */}
      {(showAttachments || files.length > 0) && (
        <div className="pt-2 animate-in fade-in duration-200">
          <AttachmentArea
            files={files}
            onAddFiles={onAddFiles}
            onRemoveFile={onRemoveFile}
          />
        </div>
      )}

      {/* Single Bottom Toolbar inside Composer */}
      <div className="pt-4 border-t border-sky-200/70 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Toolbar Controls: Attachments, Model, Tools */}
        <div className="flex flex-wrap items-center gap-4">
          {!showAttachments && files.length === 0 && (
            <button
              type="button"
              onClick={() => setShowAttachments(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-sky-900 bg-white/50 hover:bg-white/80 border border-sky-200/80 transition-all shadow-xs flex items-center gap-1.5"
            >
              📎 Add files
            </button>
          )}

          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />

          <div className="h-4 w-[1px] bg-sky-200 hidden sm:block" />

          <ToolSelector
            selectedTools={selectedTools}
            onToggleTool={onToggleTool}
          />
        </div>

        {/* Right Action: Run Task CTA */}
        <div className="flex items-center justify-end shrink-0 pt-2 lg:pt-0">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onRunTask}
            disabled={!prompt.trim()}
            className="w-full lg:w-auto min-w-[160px]"
          >
            Run task →
          </Button>
        </div>
      </div>
    </div>
  );
};
