"use client";

import React, { useCallback, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, FileText, X, Check, AlertTriangle } from "lucide-react";

interface FileUploaderProps {
  accept?: string;
  label: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  maxSize?: number;
}

// Accepted MIME types: images + PDF only
const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

// Accepted extensions as a fallback check (some browsers report empty MIME)
const ACCEPTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".pdf",
]);

function isAcceptedFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) return true;
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  return ACCEPTED_EXTENSIONS.has(ext);
}

export function FileUploader({
  accept = ".jpg,.jpeg,.png,.webp,.gif,.pdf",
  label,
  file,
  onFileSelect,
  maxSize = 5,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("candidate");

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      if (!isAcceptedFile(f)) {
        setError(t("uploadErrorFormat"));
        return;
      }
      if (f.size > maxSize * 1024 * 1024) {
        setError(t("uploadErrorSize", { maxSize }));
        return;
      }
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
    e.target.value = "";
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
            <span className="flex items-center gap-1 text-xs font-medium text-teal">
              <Check className="w-3.5 h-3.5" />
              {t("uploadSelected")}
            </span>
            <button
              onClick={() => onFileSelect(null)}
              className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
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
        className={`rounded-xl border border-dashed p-6 text-center cursor-pointer transition ${
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
          {t("uploadDrag")}
          <span className="font-medium text-teal">{t("uploadBrowse")}</span>
        </p>
        <p className="text-xs text-text-muted mt-1.5">
          {t("uploadHint", { maxSize })}
        </p>
      </div>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
