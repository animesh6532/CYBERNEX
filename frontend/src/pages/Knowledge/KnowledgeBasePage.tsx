import React, { useState } from 'react';
import { Search, Plus, FileText, X, Sparkles, BookOpen, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';

export const KnowledgeBasePage: React.FC = () => {
  const { documents, addDocument, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newDocName, setNewDocName] = useState('');
  const [newDocCollection, setNewDocCollection] = useState<'SOPs' | 'Manuals' | 'Reports' | 'Policies'>('SOPs');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.previewText?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColl = selectedCollection === 'ALL' || doc.collection === selectedCollection;
    return matchesSearch && matchesColl;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;
    addDocument({
      name: newDocName,
      collection: newDocCollection,
      type: newDocName.endsWith('.docx') ? 'DOCX' : 'PDF',
    });
    setNewDocName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200">
        <div>
          <h2 className="text-3xl font-black text-[#0C4A6E] tracking-tight">
            Knowledge Base
          </h2>
          <p className="text-xs text-sky-800 font-medium mt-0.5">
            Your private documents, available locally.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add document
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Documents" value="124" />
        <StatCard title="Chunks" value="8,521" />
        <StatCard title="Collections" value="4" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-sky-500 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs font-medium"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'SOPs', 'Manuals', 'Reports', 'Policies'].map((coll) => (
            <button
              key={coll}
              onClick={() => setSelectedCollection(coll)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCollection === coll
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-white/60 text-sky-800 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              {coll}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Empty State */}
      {filteredDocs.length > 0 ? (
        <div className="glass-panel rounded-2xl border border-sky-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-sky-200 text-sky-900 font-black uppercase">
                <tr>
                  <th className="p-4">Document</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Collection</th>
                  <th className="p-4">Chunks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 font-medium">
                {filteredDocs.map((doc) => (
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
                    <td className="p-4 text-sky-950 font-bold">{doc.chunks}</td>
                    <td className="p-4">
                      <StatusBadge status="VERIFIED" label={doc.status} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5 text-sky-600" />}
                        onClick={() => setSelectedDoc(doc)}
                      >
                        Preview
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-4 border-sky-300">
          <BookOpen className="w-12 h-12 text-sky-500 mx-auto opacity-60" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0C4A6E]">No documents yet.</h3>
            <p className="text-xs text-sky-800 font-medium">
              Upload a document to get started.
            </p>
          </div>
          <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
            Upload document
          </Button>
        </GlassCard>
      )}

      {/* Preview Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-sky-950/20 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl h-full glass-panel border-l border-sky-300 p-6 flex flex-col justify-between space-y-6 shadow-2xl overflow-y-auto bg-white/95">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0C4A6E]">{selectedDoc.name}</h3>
                    <p className="text-xs text-sky-800 font-bold">
                      {selectedDoc.collection} • {selectedDoc.chunks} Chunks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-xl text-sky-700 hover:text-sky-950 hover:bg-sky-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-sky-900 uppercase">Preview Snippet</span>
                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950 leading-relaxed italic font-medium">
                    "{selectedDoc.previewText}"
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-sky-300 p-6 space-y-6 shadow-2xl relative bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-sky-200">
              <h3 className="text-base font-black text-[#0C4A6E]">Add Document</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-sky-700 hover:text-sky-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-sky-900 mb-1">File Name</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Engineering_Standard.pdf"
                  className="w-full p-3 rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-sky-900 mb-1">Collection</label>
                <select
                  value={newDocCollection}
                  onChange={(e) => setNewDocCollection(e.target.value as any)}
                  className="w-full p-3 rounded-xl glass-input bg-white text-sky-950 font-bold"
                >
                  <option value="SOPs">SOPs</option>
                  <option value="Manuals">Manuals</option>
                  <option value="Reports">Reports</option>
                  <option value="Policies">Policies</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Index Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
