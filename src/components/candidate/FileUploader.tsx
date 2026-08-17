"use client";

import React, { useCallback, useState, useRef } from "react";
import { Upload, FileText, X, Check } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  maxSize?: number;
}

export function FileUploader({
  accept = ".pdf,.jpg,.jpeg,.png",
  label,
  file,
  onFileSelect,
  maxSize = 5,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      if (f.size > maxSize * 1024 * 1024) {
        setError(`Le fichier dépasse ${maxSize} Mo`);
        return;
      }
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 100);
      onFileSelect(f);
    },
    [maxSize, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  if (file) {
    return (
      <div className="rounded-xl glass p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
            <p className="text-xs text-text-muted">{formatSize(file.size)}</p>
          </div>
          <div className="flex items-center gap-3">
            {uploadProgress === 100 && (
              <span className="flex items-center gap-1 text-xs font-medium text-teal">
                <Check className="w-3.5 h-3.5" />
                Téléchargé
              </span>
            )}
            <button
              onClick={() => onFileSelect(null)}
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {uploadProgress < 100 && (
          <div className="mt-3">
            <div className="h-1.5 bg-glass-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-teal rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">{uploadProgress}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          isDragging
            ? "border-teal bg-teal/5"
            : "border-glass-border hover:border-glass-border-strong"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="w-8 h-8 mx-auto text-text-muted mb-3" strokeWidth={1.5} />
        <p className="text-sm text-text-muted">
          Glissez un fichier ici ou{" "}
          <span className="font-medium text-teal">parcourir</span>
        </p>
        <p className="text-xs text-text-muted mt-1.5">
          PDF, JPG, PNG — max {maxSize} Mo
        </p>
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
