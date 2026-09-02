import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowUpRight, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { AgentTask } from '@/types';

interface RecentWorkProps {
  recentTasks?: AgentTask[];
  onSelectTask?: (task: AgentTask) => void;
}

export const RecentWork: React.FC<RecentWorkProps> = ({ recentTasks = [] }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: AgentTask['status']) => {
    switch (status) {
      case 'running':
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 font-sans max-w-4xl mx-auto pt-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-sky-950 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" />
          Recent work
        </h3>
      </div>

      {recentTasks.length === 0 ? (
        <div className="p-6 rounded-2xl glass-panel text-center space-y-1 border border-sky-200/60">
          <p className="text-xs font-bold text-sky-900">No recent tasks</p>
          <p className="text-[11px] text-sky-700 font-medium">
            Tasks you execute will appear here for quick reference.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(task.status === 'completed' ? `/results/${task.id}` : `/runs/${task.id}`)}
              className="group cursor-pointer glass-panel p-3.5 rounded-2xl border border-sky-200/80 hover:border-sky-300/90 transition-all flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0C4A6E] truncate">
                    {task.prompt}
                  </span>
                </div>
                <div className="text-[11px] text-sky-700/80 font-medium mt-0.5 flex items-center gap-3">
                  <span>{task.createdAt}</span>
                  {task.duration && <span>• {task.duration}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {getStatusBadge(task.status)}
                <span className="text-xs font-bold text-sky-700 group-hover:text-sky-950 flex items-center gap-0.5 transition-colors">
                  Open <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
