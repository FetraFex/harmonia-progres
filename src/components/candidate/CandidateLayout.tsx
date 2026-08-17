"use client";

import React from "react";
import { CandidateHeader } from "./CandidateHeader";

export function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CandidateHeader />
      <main>{children}</main>
    </div>
  );
}
