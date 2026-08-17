"use client";

import React from "react";
import { CandidateHeader } from "./CandidateHeader";

export function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-white text-gray-900"
      style={{
        "--text-primary": "#0F172A",
        "--text-muted": "#475569",
        "--text-secondary": "#334155",
      } as React.CSSProperties}
    >
      <CandidateHeader />
      <main>{children}</main>
    </div>
  );
}
