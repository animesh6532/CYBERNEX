import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, History } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';

export const RunsPage: React.FC = () => {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'RUNNING' | 'FAILED'>('ALL');

  useEffect(() => {
    api.getTasks()
      .then((data) => setRuns(data))
      .catch((err) => console.error('Error fetching runs:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredRuns = runs.filter((r) => {
    if (filter === 'ALL') return true;
    const st = (r.status || '').toUpperCase();
    return st === filter;
  });

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Runs
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            View your recent agent execution tasks.
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

      {loading ? (
        <div className="p-8 text-center text-xs text-sky-700 font-bold">Loading execution runs...</div>
      ) : filteredRuns.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-sky-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-sky-200 text-sky-900 font-black uppercase">
                <tr>
                  <th className="p-4">Task Prompt</th>
                  <th className="p-4">Model</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 font-medium">
                {filteredRuns.map((run) => (
                  <tr
                    key={run.id || run.run_id}
                    onClick={() => navigate(`/runs/${run.run_id || run.id}`)}
                    className="hover:bg-white/60 cursor-pointer transition-colors"
                  >
                    <td className="p-4 text-sky-950 font-bold max-w-xs truncate">{run.prompt}</td>
                    <td className="p-4 text-sky-900 font-bold">{run.selectedModel || 'Auto'}</td>
                    <td className="p-4">
                      <StatusBadge status={(run.status || 'COMPLETED').toUpperCase()} size="sm" />
                    </td>
                    <td className="p-4 text-sky-700 font-medium">{run.createdAt || 'Just now'}</td>
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
      ) : (
        <GlassCard className="p-12 text-center space-y-4 border-sky-300">
          <History className="w-12 h-12 text-sky-500 mx-auto opacity-60" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0C4A6E]">No runs yet.</h3>
            <p className="text-xs text-sky-800 font-medium">
              Create a task in the Workbench to see execution history.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={() => navigate('/workbench')}>
            Go to Workbench
          </Button>
        </GlassCard>
      )}
    </div>
  );
};
