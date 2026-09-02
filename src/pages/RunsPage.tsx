import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';

export const RunsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTask } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'RUNNING' | 'FAILED'>('ALL');

  const historyRuns = [
    {
      id: activeTask.id,
      prompt: activeTask.prompt,
      model: activeTask.selectedModel,
      tools: activeTask.selectedTools.join(', '),
      status: activeTask.status === 'running' ? 'RUNNING' : 'COMPLETED',
      duration: activeTask.duration || '18.4s',
      time: activeTask.createdAt,
    },
    {
      id: 'run-7104-cx',
      prompt: 'Execute sandboxed Python equipment efficiency calculation',
      model: 'Coding (Qwen2.5-Coder-32B)',
      tools: 'CODE_EXECUTION, FILE_OPERATIONS',
      status: 'COMPLETED',
      duration: '4.2s',
      time: '2026-09-02 11:30:12',
    },
    {
      id: 'run-6091-cx',
      prompt: 'Multimodal vision scan of plant P&ID schematic diagram',
      model: 'Vision (Llama-3.2-Vision)',
      tools: 'OCR, KNOWLEDGE_BASE',
      status: 'COMPLETED',
      duration: '12.1s',
      time: '2026-09-01 16:45:00',
    },
  ];

  const filteredRuns = historyRuns.filter((r) => filter === 'ALL' || r.status === filter);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Runs
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            View your recent tasks.
          </p>
        </div>

        <div className="flex items-center gap-2 font-bold text-xs">
          {['ALL', 'COMPLETED', 'RUNNING', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                filter === st
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-white/60 text-sky-800 border-sky-200 hover:bg-sky-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-sky-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-sky-200 text-sky-900 font-black uppercase">
              <tr>
                <th className="p-4">Task</th>
                <th className="p-4">Model</th>
                <th className="p-4">Status</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 font-medium">
              {filteredRuns.map((run) => (
                <tr
                  key={run.id}
                  onClick={() => navigate(`/runs/${run.id}`)}
                  className="hover:bg-white/60 cursor-pointer transition-colors"
                >
                  <td className="p-4 text-sky-950 font-bold max-w-xs truncate">{run.prompt}</td>
                  <td className="p-4 text-sky-900 font-bold">{run.model}</td>
                  <td className="p-4">
                    <StatusBadge status={run.status as any} size="sm" />
                  </td>
                  <td className="p-4 text-sky-800 font-bold">{run.duration}</td>
                  <td className="p-4 text-sky-700 font-medium">{run.time}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5 text-sky-600" />}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
