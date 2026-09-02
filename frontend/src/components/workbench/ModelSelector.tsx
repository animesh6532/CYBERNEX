import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const MODELS = [
  { id: 'Auto', label: 'Auto' },
  { id: 'General', label: 'General' },
  { id: 'Coding', label: 'Coding' },
  { id: 'Vision', label: 'Vision' },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-sans">
      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
        <Cpu className="w-3.5 h-3.5 text-sky-600" />
        <span>Model</span>
      </div>

      <div className="flex items-center gap-1 bg-white/40 p-1 rounded-xl border border-sky-200/80">
        {MODELS.map((m) => {
          const isSelected = selectedModel === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModel(m.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-sky-900/80 hover:text-sky-950 hover:bg-white/60'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Auto Routing Subtle Indicator */}
      {selectedModel === 'Auto' && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-100/70 border border-sky-200 text-[11px] font-bold text-sky-800 animate-in fade-in duration-150">
          <Sparkles className="w-3 h-3 text-sky-600" />
          <span>CYBERNEX chooses</span>
        </div>
      )}
    </div>
  );
};
