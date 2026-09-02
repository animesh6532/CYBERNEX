import React from 'react';
import { FileText, FileSpreadsheet, FileCode, FileImage, X } from 'lucide-react';
import { UploadedFile } from '../../types';

interface FileCardProps {
  file: UploadedFile;
  onRemove?: () => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onRemove }) => {
  const getIcon = () => {
    switch (file.type) {
      case 'PDF':
      case 'DOCX':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'XLSX':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'IMAGE':
        return <FileImage className="w-4 h-4 text-cyan-600" />;
      default:
        return <FileCode className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center justify-between gap-3 border border-sky-200 hover:border-sky-300 transition-all font-sans">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-1.5 rounded-lg bg-sky-100/60 shrink-0">
          {getIcon()}
        </div>
        <span className="text-xs font-bold text-[#0C4A6E] truncate">
          {file.name}
        </span>
        <span className="text-[11px] text-sky-700 font-medium">({file.size})</span>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 rounded-lg text-sky-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
