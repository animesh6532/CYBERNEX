import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';

export const AgentExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeTask, isSimulating, activeStepIndex } = useApp();
  const [logsExpanded, setLogsExpanded] = useState(true);

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
              Agent Execution
            </h2>
            <StatusBadge status={isSimulating ? 'RUNNING' : 'COMPLETED'} />
          </div>
          <p className="text-xs text-sky-800 font-medium mt-1">
            "{activeTask.prompt}"
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate(`/results/${id || activeTask.id}`)}
        >
          View Results →
        </Button>
      </div>

      {/* Grid: Process Timeline & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Process Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span>Execution Timeline</span>
            <span className="text-emerald-700">
              {isSimulating ? `Step ${activeStepIndex}/12` : '12/12 Steps Verified'}
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-[2px] before:bg-sky-200">
            {activeTask.steps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div
                  key={step.stepIndex}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    isInProgress
                      ? 'glass-gradient-card border-sky-400 shadow-md scale-[1.01]'
                      : isCompleted
                      ? 'glass-panel border-sky-200'
                      : 'bg-white/30 border-sky-100 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                      isCompleted
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : isInProgress
                        ? 'bg-sky-100 border border-sky-300 text-sky-900 animate-pulse'
                        : 'bg-sky-50 border border-sky-200 text-sky-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : step.code}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0C4A6E]">{step.title}</span>
                      <span className="text-[10px] font-mono text-sky-700">{step.timestamp}</span>
                    </div>

                    <p className="text-xs text-sky-900 mt-0.5 font-medium">{step.subtitle}</p>

                    {step.details && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white/70 border border-sky-200 text-xs text-sky-900 leading-relaxed font-medium">
                        {step.details}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* JetBrains Mono Log Terminal */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-sky-600" /> Technical Log</span>
            <button
              onClick={() => setLogsExpanded(!logsExpanded)}
              className="text-sky-700 hover:text-sky-950 flex items-center gap-1"
            >
              {logsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {logsExpanded && (
            <div className="rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 p-4 text-xs space-y-3 h-[580px] overflow-y-auto shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="pb-2 border-b border-slate-800 text-[10px] text-slate-400 font-bold flex items-center justify-between">
                  <span>TERMINAL STREAM</span>
                  <span className="text-emerald-400">LOCAL</span>
                </div>

                {activeTask.logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-lg bg-slate-800/60 text-[11px] leading-relaxed font-medium"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>[{log.timestamp}]</span>
                      <span className="text-sky-300 font-bold">{log.category}</span>
                    </div>
                    <div>{log.message}</div>
                  </div>
                ))}

                {isSimulating && (
                  <div className="p-2 rounded bg-amber-500/10 text-amber-300 text-[11px] animate-pulse flex items-center gap-2 font-bold">
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    Executing step [{activeStepIndex}/12]...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
