import React, { useRef, useState } from 'react';
import { Paperclip, Plus, UploadCloud } from 'lucide-react';
import { FileCard } from '@/components/ui/FileCard';
import { UploadedFile } from '@/types';

interface AttachmentAreaProps {
  files: UploadedFile[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (fileId: string) => void;
}

export const AttachmentArea: React.FC<AttachmentAreaProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3 font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg,.py,.txt,.json,.csv"
      />

      {/* Upload Dropzone / Trigger */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group cursor-pointer p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
          isDragging
            ? 'bg-sky-100/60 border-sky-400 shadow-sm'
            : 'bg-white/40 hover:bg-white/70 border-sky-200/80 hover:border-sky-300'
        }`}
      >
        <div className="flex items-center gap-2.5 text-xs text-sky-900 font-medium">
          <div className="p-1.5 rounded-xl bg-sky-100/80 group-hover:bg-sky-200/80 text-sky-700 transition-colors">
            {isDragging ? (
              <UploadCloud className="w-4 h-4 text-sky-600 animate-bounce" />
            ) : (
              <Paperclip className="w-4 h-4 text-sky-600" />
            )}
          </div>
          <span>
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? 's' : ''} attached`
              : 'Drop documents or images here'}
          </span>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-white/80 hover:bg-white text-sky-900 border border-sky-200 shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-sky-600" />
          Add files
        </button>
      </div>

      {/* Render uploaded files */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onRemove={() => onRemoveFile(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
