"use client";

import React from "react";
import { Pencil } from "lucide-react";

interface ReviewSectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-[var(--black)]">
          {title}
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--black)] transition"
          >
            <Pencil className="w-3 h-3" />
            Modifier
          </button>
        )}
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

export function ReviewItem({ label, value }: { label: string; value: string | string[] }) {
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--black)] font-medium text-right">{display || "—"}</span>
    </div>
  );
}
