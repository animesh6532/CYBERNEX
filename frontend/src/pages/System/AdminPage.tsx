import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useApp } from '@/context/AppContext';

export const AdminPage: React.FC = () => {
  const { systemMetrics } = useApp();

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            System Hardware Status
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Real-time telemetry for CPU, RAM, Disk, and GPU.
          </p>
        </div>
      </div>

      <GlassCard className="p-8 space-y-6 border-sky-300">
        <h3 className="text-xs font-bold text-sky-900 uppercase">Hardware Resource Monitors</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-sans">
          {[
            { label: 'CPU Usage', val: `${systemMetrics.cpuUsage || 0}%`, num: systemMetrics.cpuUsage || 0 },
            { label: 'Memory Usage', val: `${systemMetrics.memoryUsage || 0}%`, num: systemMetrics.memoryUsage || 0 },
            { label: 'Storage Usage', val: `${systemMetrics.storageUsage || 0}%`, num: systemMetrics.storageUsage || 0 },
            { label: 'GPU Usage', val: systemMetrics.gpuUsage ? `${systemMetrics.gpuUsage}%` : 'UNAVAILABLE', num: systemMetrics.gpuUsage || 0 },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between font-black text-[#0C4A6E] text-sm">
                <span>{item.label}</span>
                <span>{item.val}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sky-100 border border-sky-200 overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, item.num))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
