"use client";

import React, { useCallback, useState, useRef } from "react";

interface FileUploaderProps {
  accept?: string;
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  maxSize?: number; // in MB
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
      <div className="rounded-xl border border-[var(--border)] bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--lime)]/10 flex items-center justify-center text-[var(--lime)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--black)] truncate">{file.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{formatSize(file.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            {uploadProgress === 100 && (
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Téléchargé
              </span>
            )}
            <button
              onClick={() => onFileSelect(null)}
              className="text-xs text-red-500 hover:underline"
            >
              Retirer
            </button>
          </div>
        </div>
        {uploadProgress < 100 && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--lime)] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">{uploadProgress}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--black)] mb-1.5">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          isDragging
            ? "border-[var(--lime)] bg-[var(--lime)]/5"
            : "border-[var(--border)] bg-white hover:border-[var(--black)]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <svg className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-[var(--text-muted)]">
          Glissez un fichier ici ou{" "}
          <span className="font-medium text-[var(--black)]">parcourir</span>
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          PDF, JPG, PNG — max {maxSize} Mo
        </p>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
