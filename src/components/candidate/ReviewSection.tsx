"use client";

import React from "react";

interface ReviewSectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)] text-sm">
          {title}
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-medium text-[var(--lime)] hover:underline"
          >
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
    <div className="flex justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--black)] font-medium text-right">{display || "—"}</span>
    </div>
  );
}
