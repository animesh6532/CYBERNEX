import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Download,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { useApp } from '@/context/AppContext';
import { Finding, Citation, Deliverable } from '@/types';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeTask, showToast } = useApp();

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Verification Banner */}
      <div className="p-6 rounded-2xl glass-gradient-card border border-sky-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#0C4A6E]">
                Analysis Complete
              </h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                ✓ Verified
              </span>
            </div>
            <p className="text-xs text-sky-800 font-medium mt-0.5">
              Run #{id || activeTask.id} • Duration: {activeTask.duration || '18.4s'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/workbench')}
          >
            New Task
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            onClick={() => showToast('Downloading Approval_Note_Turbine_Unit4.docx')}
          >
            Download DOCX
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Summary */}
          <GlassCard className="p-6 space-y-2">
            <h3 className="text-xs font-bold text-sky-900 uppercase">Summary</h3>
            <p className="text-sm text-sky-950 leading-relaxed font-medium">
              Analysis of <span className="font-bold text-[#0C4A6E]">inspection_report.pdf</span> against <span className="font-bold text-[#0C4A6E]">inspection_sop.pdf (SOP-704)</span> identified a Stage 2 turbine pressure variance. Secondary vibration telemetry confirms safe conditional operation under supervisor sign-off.
            </p>
          </GlassCard>

          {/* Key Findings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-sky-900 uppercase">Identified Findings</h3>

            <div className="space-y-3">
              {activeTask.findings.map((finding: Finding, idx: number) => (
                <div key={finding.id} className="glass-panel p-4 rounded-2xl border border-sky-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#0C4A6E]">
                      FINDING 0{idx + 1} — {finding.title}
                    </span>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-xs text-sky-900 font-medium leading-relaxed">{finding.description}</p>
                  <div className="text-[11px] text-sky-700 font-bold">
                    Evidence: {finding.evidenceSource} (Page {finding.page})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source Citations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-sky-900 uppercase">Sources & Evidence</h3>

            <div className="space-y-3">
              {activeTask.citations.map((citation: Citation) => (
                <GlassCard key={citation.id} hoverEffect className="p-5 space-y-3 border-sky-300">
                  <div className="flex items-center justify-between text-xs border-b border-sky-200 pb-2">
                    <span className="font-black text-[#0C4A6E]">{citation.sourceName}</span>
                    <span className="text-emerald-700 font-bold">{(citation.confidence * 100).toFixed(1)}% Match</span>
                  </div>

                  <div className="text-xs text-sky-800 font-bold flex gap-4">
                    <span>File: {citation.sourceFile}</span>
                    <span>Page: {citation.page}</span>
                    <span>Section: {citation.section}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-sky-200 text-xs text-sky-950 italic font-medium leading-relaxed">
                    "{citation.snippet}"
                  </div>

                  <div className="flex justify-end pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5 text-sky-600" />}
                      onClick={() => showToast(`Inspecting ${citation.sourceFile} Page ${citation.page}`)}
                    >
                      VIEW SOURCE
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-sky-900 uppercase">Generated Deliverables</h3>

          <div className="space-y-3">
            {activeTask.deliverables.map((del: Deliverable) => {
              return (
                <GlassCard key={del.id} gradient className="p-5 space-y-3 border-sky-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-sky-600" />
                      <span className="text-xs font-black text-[#0C4A6E] truncate max-w-[150px]">{del.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                      {del.status}
                    </span>
                  </div>

                  <p className="text-xs text-sky-900 font-medium leading-relaxed">{del.summary}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-sky-200">
                    <Button variant="ghost" size="sm" onClick={() => showToast(`Opening ${del.name}`)}>
                      OPEN
                    </Button>
                    <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => showToast(`Downloading ${del.name}`)}>
                      DOWNLOAD
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
