import React, { useState } from 'react';
import { FileText, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';
import { DocumentItem } from '@/types';

export const DocumentsPage: React.FC = () => {
  const { documents, showToast } = useApp();
  const [search, setSearch] = useState('');

  const filtered = documents.filter((d: DocumentItem) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Documents
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Manage your workspace files.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-48 sm:w-64 p-2.5 rounded-xl glass-input text-xs font-medium"
          />
          <Button variant="primary" size="md" icon={<Upload className="w-4 h-4" />}>
            Upload
          </Button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-sky-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-sky-200 text-sky-900 font-black uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Collection</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 font-medium">
              {filtered.map((doc: DocumentItem) => (
                <tr key={doc.id} className="hover:bg-white/60 transition-colors">
                  <td className="p-4 font-black text-[#0C4A6E] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="p-4 text-sky-800 font-bold">{doc.type}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 font-bold border border-sky-200">
                      {doc.collection}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status="VERIFIED" label={doc.status} size="sm" />
                  </td>
                  <td className="p-4 text-sky-700 font-medium">{doc.updatedAt}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="w-3.5 h-3.5 text-sky-600" />}
                      onClick={() => showToast(`Opening ${doc.name}`)}
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
