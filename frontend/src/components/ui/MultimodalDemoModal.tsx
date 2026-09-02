import React from 'react';
import { X, Eye, CheckCircle2, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MultimodalDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultimodalDemoModal: React.FC<MultimodalDemoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md animate-in fade-in font-sans">
      <div className="w-full max-w-4xl rounded-2xl glass-panel border border-sky-300 p-6 space-y-6 shadow-2xl relative bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0C4A6E] flex items-center gap-2">
                P&ID Engineering Diagram Analysis
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                  ● LOCAL VISION INFERENCE
                </span>
              </h3>
              <p className="text-xs text-sky-800 font-medium mt-0.5">
                Model: Local Llama-3.2-Vision-11B • Air-Gapped Sandbox
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
          {/* SVG P&ID Diagram */}
          <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-sky-800 mb-3">
              <span className="flex items-center gap-1"><FileImage className="w-3.5 h-3.5 text-sky-600" /> SCHEMATIC_PND_704.SVG</span>
              <span>100% AIR-GAPPED</span>
            </div>

            <div className="w-full h-64 border border-sky-300 rounded-xl p-2 bg-white relative flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 400 240" className="w-full h-full text-sky-600">
                <pattern id="grid-light" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(14,165,233,0.08)" strokeWidth="1" />
                </pattern>
                <rect width="400" height="240" fill="url(#grid-light)" />

                <path d="M 40 120 L 140 120 L 140 60 L 260 60 L 260 120 L 360 120" fill="none" stroke="#0284C7" strokeWidth="3" />
                <path d="M 140 120 L 140 180 L 260 180 L 260 120" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="4 2" />

                <circle cx="90" cy="120" r="22" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
                <path d="M 90 98 L 108 120 L 90 142 Z" fill="#0369A1" />
                <text x="90" y="156" fill="#0C4A6E" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">P-101 (Pump)</text>

                <polygon points="190,50 210,70 190,70 210,50" fill="#0EA5E9" stroke="#0284C7" strokeWidth="1.5" />
                <text x="200" y="42" fill="#0C4A6E" fontSize="10" fontFamily="Inter" fontWeight="bold" textAnchor="middle">V-204 (Valve)</text>

                <circle cx="310" cy="120" r="14" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" className="animate-pulse" />
                <text x="310" y="124" fill="#92400E" fontSize="9" fontFamily="Inter" fontWeight="bold" textAnchor="middle">PI-70</text>
                <text x="310" y="148" fill="#0C4A6E" fontSize="9" fontFamily="Inter" fontWeight="bold" textAnchor="middle">154.2 PSI</text>
              </svg>
            </div>
          </div>

          {/* Detections List */}
          <div className="space-y-4 text-xs font-sans">
            <div className="text-sky-900 font-extrabold uppercase tracking-wider">Vision Model Detection Results</div>

            <div className="space-y-2">
              {[
                { tag: 'P-101', type: 'Centrifugal Pump Stage 2', status: 'Operational', val: '2,400 RPM' },
                { tag: 'V-204', type: 'High Pressure Safety Valve', status: 'Open', val: 'Flow 120 L/min' },
                { tag: 'PI-70', type: 'Digital Pressure Gauge', status: 'ANOMALY DETECTED', val: '154.2 PSI (+6.3%)' },
              ].map((entity, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border border-sky-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#0C4A6E]">{entity.tag} • {entity.type}</span>
                    <span className={entity.status.includes('ANOMALY') ? 'text-amber-700 font-black' : 'text-emerald-700 font-black'}>
                      {entity.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-sky-800 font-semibold">Reading: {entity.val}</div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
              <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-600" />
              Vision analysis complete. Findings merged into active agent context.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-sky-200 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            CLOSE PREVIEW
          </Button>
        </div>
      </div>
    </div>
  );
};
