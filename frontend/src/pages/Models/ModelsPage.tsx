import React from 'react';
import { Cpu, Server } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { AIModel } from '@/types';

export const ModelsPage: React.FC = () => {
  const { models } = useApp();

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Models
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Local models available to CYBERNEX via Ollama.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-sky-200 text-xs text-sky-900 font-bold">
          <Server className="w-4 h-4 text-sky-600" />
          <span>Local Ollama Server</span>
        </div>
      </div>

      {models.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {models.map((model: AIModel) => (
            <GlassCard key={model.id} gradient className="p-6 space-y-5 border-sky-300">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-100/70 border border-sky-300 text-sky-700">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0C4A6E] truncate max-w-[140px]">{model.name}</h3>
                    <p className="text-xs text-sky-800 font-bold">{model.role}</p>
                  </div>
                </div>
                <StatusBadge status={model.status} label={model.status} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="p-3 rounded-xl bg-white/60 border border-sky-200">
                  <span className="text-[10px] text-sky-700 block">Context</span>
                  <span className="text-[#0C4A6E] font-black">{model.contextWindow}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/60 border border-sky-200">
                  <span className="text-[10px] text-sky-700 block">Size / VRAM</span>
                  <span className="text-sky-700 font-black">{model.vramUsage}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-4 border-sky-300">
          <Cpu className="w-12 h-12 text-sky-500 mx-auto opacity-60" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0C4A6E]">No local models detected.</h3>
            <p className="text-xs text-sky-800 font-medium">
              Start your local Ollama service (`ollama run llama3`) to enable local inference models.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
