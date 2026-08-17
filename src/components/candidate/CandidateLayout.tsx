"use client";

import React from "react";
import { CandidateHeader } from "./CandidateHeader";

export function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-void text-text-primary flex flex-col">
      <CandidateHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
