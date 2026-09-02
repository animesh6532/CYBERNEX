import React from 'react';
import { X, Code, Terminal, CheckCircle2, ShieldCheck, Play } from 'lucide-react';
import { Button } from '../ui/Button';

interface CodingDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodingDemoModal: React.FC<CodingDemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pythonCode = `import numpy as np

def calculate_turbine_efficiency(actual_output_kw, thermal_input_kw):
    """
    Calculate Carnot & Actual Mechanical Efficiency for Turbine Unit #4.
    Enforces strict zero-external-dependency array calculations.
    """
    actual_eff = (actual_output_kw / thermal_input_kw) * 100
    nominal_threshold = 42.5 # SOP-704 Standard Nominal Efficiency (%)
    
    variance = actual_eff - nominal_threshold
    status = "OPTIMAL" if variance >= 0 else "MAINTENANCE_REQUIRED"
    
    return {
        "actual_efficiency_pct": round(actual_eff, 2),
        "nominal_threshold_pct": nominal_threshold,
        "variance_pct": round(variance, 2),
        "compliance_status": status
    }

# Execute calculation on telemetry dataset
result = calculate_turbine_efficiency(actual_output_kw=18450, thermal_input_kw=41200)
print("SANDBOX_OUTPUT:", result)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl rounded-2xl glass-panel border border-sky-300 p-6 space-y-6 shadow-2xl relative bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0C4A6E] flex items-center gap-2">
                Sandboxed Python Code Execution Workflow
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                  ● DOCKER ISOLATED
                </span>
              </h3>
              <p className="text-xs text-sky-800 font-mono">
                Model: Qwen2.5-Coder-32B • Network: DISABLED
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-sky-700 hover:text-sky-950 hover:bg-sky-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Pills */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs font-mono text-sky-900 font-bold">
          <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-sky-600" /> CODING MODEL</span>
          <span>→</span>
          <span className="text-cyan-700">GENERATED PYTHON</span>
          <span>→</span>
          <span className="text-emerald-700">DOCKER SANDBOX</span>
          <span>→</span>
          <span className="text-amber-700 font-black">EXECUTION</span>
          <span>→</span>
          <span className="text-emerald-700 font-black flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED RESULT
          </span>
        </div>

        {/* Code View & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 text-slate-100 border border-slate-700 p-4 font-mono text-xs overflow-x-auto space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800 font-bold">
              <span>calculate_efficiency.py</span>
              <span className="text-emerald-400">STATUS: VERIFIED</span>
            </div>
            <pre className="leading-relaxed text-slate-200">
              <code>{pythonCode}</code>
            </pre>
          </div>

          <div className="rounded-2xl bg-sky-50/80 border border-sky-200 p-4 font-mono text-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-sky-200 text-[10px] text-sky-800 font-black">
                <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> SANDBOX TERMINAL</span>
                <span className="text-emerald-700">NET: 0 B/s</span>
              </div>

              <div className="mt-3 space-y-2 text-[11px]">
                <div className="text-sky-800/70 font-semibold">[0.00s] Spawning python:3.11-slim container...</div>
                <div className="text-sky-800/70 font-semibold">[0.04s] Executing script with parameters...</div>
                <div className="p-3 rounded-xl bg-white border border-sky-300 text-sky-950 space-y-1 shadow-xs">
                  <div className="font-black text-[#0C4A6E]">Execution Output:</div>
                  <div>actual_efficiency_pct: 44.78%</div>
                  <div>nominal_threshold_pct: 42.50%</div>
                  <div>variance_pct: +2.28%</div>
                  <div className="text-emerald-700 font-black pt-1">compliance_status: OPTIMAL</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-sky-200 text-[10px] text-sky-800 font-bold flex items-center justify-between">
              <span>Execution Time: 0.12s</span>
              <span className="text-emerald-700">0 External Calls</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-sky-200 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            CLOSE DEMO
          </Button>
        </div>
      </div>
    </div>
  );
};
