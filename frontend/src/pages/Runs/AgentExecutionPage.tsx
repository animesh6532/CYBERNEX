import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { api } from '@/lib/api';
import { WorkflowStep, LogEntry } from '@/types';

export const AgentExecutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [runDetail, setRunDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logsExpanded, setLogsExpanded] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    api.getRun(id)
      .then((res) => setRunDetail(res))
      .catch((err) => console.error('Error fetching run detail:', err))
      .finally(() => setLoading(false));

    // Connect to SSE stream for live updates
    const apiBase = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
    const eventSource = new EventSource(`${apiBase}/runs/${id}/events`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'step.completed' || data.event === 'run.completed') {
          api.getRun(id).then((updated) => setRunDetail(updated));
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-sky-700 font-bold">Loading agent execution state...</div>;
  }

  if (!runDetail) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-base font-black text-[#0C4A6E]">Execution run not found.</h3>
        <Button variant="primary" size="md" onClick={() => navigate('/runs')}>Back to Runs</Button>
      </div>
    );
  }

  const steps: WorkflowStep[] = runDetail.steps || [];
  const isCompleted = runDetail.status === 'completed';

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-[#0C4A6E] tracking-tight">
              Agent Execution
            </h2>
            <StatusBadge status={isCompleted ? 'COMPLETED' : 'RUNNING'} />
          </div>
          <p className="text-xs text-sky-800 font-medium mt-1">
            "{runDetail.prompt}"
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
          onClick={() => navigate(`/results/${id}`)}
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
              {steps.length} Steps Verified
            </span>
          </div>

          <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-[2px] before:bg-sky-200">
            {steps.map((step: WorkflowStep) => {
              const stepDone = step.status === 'completed';
              const inProg = step.status === 'in_progress';

              return (
                <div
                  key={step.stepIndex}
                  className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    inProg
                      ? 'glass-gradient-card border-sky-400 shadow-md scale-[1.01]'
                      : stepDone
                      ? 'glass-panel border-sky-200'
                      : 'bg-white/30 border-sky-100 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 z-10 ${
                      stepDone
                        ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                        : inProg
                        ? 'bg-sky-100 border border-sky-300 text-sky-900 animate-pulse'
                        : 'bg-sky-50 border border-sky-200 text-sky-400'
                    }`}
                  >
                    {stepDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : step.code}
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

                {steps.map((s) => (
                  <div key={s.stepIndex} className="p-2 rounded-lg bg-slate-800/60 text-[11px] leading-relaxed font-medium">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span>[{s.timestamp || 'Now'}]</span>
                      <span className="text-sky-300 font-bold">{s.toolUsed || 'SYSTEM'}</span>
                    </div>
                    <div>{s.title}: {s.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
