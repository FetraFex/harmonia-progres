"use client";

import React from "react";
import { CandidateHeader } from "./CandidateHeader";

export function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void text-text-primary">
      <CandidateHeader />
      <main>{children}</main>
    </div>
  );
}
