import React, { useState } from 'react';
import { X, Code, Play, CheckCircle2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodingDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodingDemoModal: React.FC<CodingDemoModalProps> = ({ isOpen, onClose }) => {
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  if (!isOpen) return null;

  const sampleCode = `import pandas as pd
import numpy as np

# Load turbine telemetry dataset from local storage
df = pd.read_csv("turbine_telemetry_unit4.csv")

# Calculate rolling mean pressure variance & detect anomalies (> 3.5 std)
df['rolling_mean'] = df['pressure_psi'].rolling(window=10).mean()
df['z_score'] = (df['pressure_psi'] - df['rolling_mean']) / df['pressure_psi'].std()

anomalies = df[df['z_score'].abs() > 3.5]
print(f"Detected {len(anomalies)} critical pressure variance points.")
print("Anomaly Summary:")
print(anomalies[['timestamp', 'stage', 'pressure_psi', 'z_score']])`;

  const handleRunCode = () => {
    setExecuting(true);
    setExecuted(false);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md animate-in fade-in font-sans">
      <div className="w-full max-w-4xl rounded-2xl glass-panel border border-sky-300 p-6 space-y-6 shadow-2xl relative bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0C4A6E] flex items-center gap-2">
                Sandboxed Python Code Execution
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                  ● DOCKER ISOLATED
                </span>
              </h3>
              <p className="text-xs text-sky-800 font-medium mt-0.5">
                Runtime: Python 3.11 • Memory Limit: 4.0 GB • Network: HARD DISABLED
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

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Preview */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-sky-900 font-bold">
              <span>Code (python_analyzer.py)</span>
              <span className="text-[10px] text-sky-700">READONLY DEMO</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 text-[11px] leading-relaxed h-72 overflow-y-auto font-mono">
              <pre>{sampleCode}</pre>
            </div>
          </div>

          {/* Execution Output */}
          <div className="space-y-4 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sky-900 font-bold">
                <span className="flex items-center gap-1.5"><Terminal className="w-4 h-4 text-sky-600" /> Execution Output</span>
                {executed && <span className="text-emerald-700 font-bold">EXIT CODE 0</span>}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 text-[11px] leading-relaxed h-56 overflow-y-auto font-mono space-y-2 shadow-inner">
                {!executing && !executed && (
                  <span className="text-slate-500 italic">Click "RUN CODE IN SANDBOX" to test isolated Python execution...</span>
                )}
                {executing && (
                  <span className="text-amber-400 animate-pulse">
                    Spinning up isolated Docker container...
                    <br />
                    Executing script in network-isolated sandbox...
                  </span>
                )}
                {executed && (
                  <div>
                    <div className="text-sky-300">$ python3 python_analyzer.py</div>
                    <div className="mt-2 text-slate-200">
                      Detected 3 critical pressure variance points.
                      <br />
                      Anomaly Summary:
                    </div>
                    <div className="mt-1 text-amber-300">
                      2026-09-02 10:14:02 | Stage 2 | 154.2 PSI | +3.82 std
                      <br />
                      2026-09-02 10:15:10 | Stage 2 | 155.8 PSI | +4.11 std
                      <br />
                      2026-09-02 10:18:45 | Stage 2 | 153.9 PSI | +3.74 std
                    </div>
                    <div className="mt-2 text-emerald-400 font-bold">
                      [Process completed in 0.84s]
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                loading={executing}
                icon={<Play className="w-4 h-4" />}
                onClick={handleRunCode}
                className="w-full"
              >
                {executed ? 'RE-RUN CODE IN SANDBOX' : 'RUN CODE IN SANDBOX'}
              </Button>
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
