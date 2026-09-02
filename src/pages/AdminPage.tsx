import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { useApp } from '../context/AppContext';

export const AdminPage: React.FC = () => {
  const { systemMetrics } = useApp();

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            System
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Monitor your local workspace.
          </p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6 border-sky-300">
        <h3 className="text-xs font-bold text-sky-900 uppercase">Resource Monitors</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
          {[
            { label: 'GPU', val: `${systemMetrics.gpuUsage}%` },
            { label: 'CPU', val: `${systemMetrics.cpuUsage}%` },
            { label: 'Memory', val: `${systemMetrics.memoryUsage}%` },
            { label: 'Storage', val: `${systemMetrics.storageUsage}%` },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between font-black text-[#0C4A6E] text-sm">
                <span>{item.label}</span>
                <span>{item.val}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sky-100 border border-sky-200 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: item.val }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
