import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Database, Terminal, Shield, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/ui/StatCard';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';

export const SecurityPage: React.FC = () => {
  const { security, systemMetrics } = useApp();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.getSecurityEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  const capabilities = [
    { title: 'Local models', desc: 'Models executed locally via Ollama HTTP API.', icon: Cpu },
    { title: 'Private knowledge', desc: 'Vector database stored locally on Qdrant.', icon: Database },
    { title: 'Sandboxed code', desc: 'Code isolated in Docker container with network disabled.', icon: Terminal },
    { title: 'Controlled network', desc: 'Inbound & outbound sockets monitored.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Heading */}
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Security Telemetry
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Real-time zero-cloud isolation status and event audit log.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-300 text-sky-900 font-bold text-xs shadow-xs">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>{security.airGapStatus || 'LOCAL ONLY'}</span>
        </div>
      </div>

      {/* 4 Clean Glass Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="External AI calls" value={String(security.externalApiCount ?? 0)} />
        <StatCard title="Cloud LLM calls" value={String(security.cloudLlmCalls ?? 0)} />
        <StatCard title="External connections" value={String(security.externalConnections ?? 0)} />
        <StatCard title="Data sent outside" value={`${security.dataLeavingMachine ?? 0} B`} />
      </div>

      {/* Security Architecture Flow */}
      <GlassCard gradient className="p-8 space-y-6 border-sky-300 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-[#0C4A6E]">Local Telemetry Active</h3>
          <p className="text-xs text-sky-800 font-bold uppercase tracking-wider">LOCAL INFRASTRUCTURE STATUS</p>
        </div>

        {/* Visual Connection Flow */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 font-sans text-xs font-bold text-[#0C4A6E]">
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-600" /> User
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/90 border border-sky-300 shadow-sm flex items-center gap-1.5 text-sky-950 font-black">
            <Shield className="w-3.5 h-3.5 text-sky-600" /> CYBERNEX
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-600" /> Local Ollama
          </span>
          <span className="text-sky-400">→</span>
          <span className="px-3.5 py-2 rounded-xl bg-white/80 border border-sky-200 shadow-xs flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-600" /> Local Qdrant
          </span>
        </div>
      </GlassCard>

      {/* Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <GlassCard key={idx} hoverEffect className="p-5 space-y-2 border-sky-300">
              <div className="p-2 rounded-xl bg-sky-100/70 border border-sky-300 text-sky-700 w-fit">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black text-[#0C4A6E]">{cap.title}</h4>
              <p className="text-xs text-sky-900 font-medium leading-relaxed">{cap.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Security Audit Events List */}
      <GlassCard className="p-6 space-y-4 border-sky-300">
        <h3 className="text-xs font-bold text-sky-900 uppercase">Recorded Security Events</h3>

        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((evt) => (
              <div key={evt.id} className="p-3 rounded-xl bg-white/70 border border-sky-200 flex items-center justify-between text-xs font-medium">
                <div>
                  <span className="font-bold text-[#0C4A6E] mr-2">[{evt.event_type}]</span>
                  <span className="text-sky-900">{evt.details}</span>
                </div>
                <span className="text-sky-700 font-mono text-[10px]">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-sky-800 font-medium italic">No security audit events recorded.</div>
        )}
      </GlassCard>
    </div>
  );
};
