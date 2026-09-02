import React from 'react';
import { Wrench } from 'lucide-react';

interface ToolSelectorProps {
  selectedTools: string[];
  onToggleTool: (toolId: string) => void;
}

const TOOLS = [
  { id: 'OCR', label: 'OCR' },
  { id: 'Knowledge', label: 'Knowledge' },
  { id: 'Code', label: 'Code' },
  { id: 'Documents', label: 'Documents' },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({
  selectedTools,
  onToggleTool,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-sans">
      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
        <Wrench className="w-3.5 h-3.5 text-sky-600" />
        <span>Tools</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {TOOLS.map((tool) => {
          const isSelected = selectedTools.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onToggleTool(tool.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-sky-400/25 text-[#0C4A6E] border-sky-300 shadow-xs'
                  : 'bg-white/40 text-sky-800/70 border-sky-200/60 hover:text-sky-950 hover:bg-white/60'
              }`}
            >
              {tool.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
