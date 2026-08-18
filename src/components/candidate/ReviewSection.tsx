"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Pencil } from "lucide-react";

interface ReviewSectionProps {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  const t = useTranslations("candidate");

  return (
    <div className="rounded-xl glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-['Space_Grotesk'] font-semibold text-sm text-text-primary">
          {title}
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-teal transition"
          >
            <Pencil className="w-3 h-3" />
            {t("edit")}
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
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary font-medium text-right">{display || "—"}</span>
    </div>
  );
}
