"use client";

import React from "react";

interface FormStepLayoutProps {
  stepNumber: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  assistance?: React.ReactNode;
}

export function FormStepLayout({
  stepNumber,
  title,
  subtitle,
  children,
  assistance,
}: FormStepLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
      <div className="mb-8">
        <span className="font-['JetBrains_Mono'] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
          Étape {stepNumber}
        </span>
        <h1 className="mt-2 font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[var(--black)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">{children}</div>
        {assistance && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-white p-6 space-y-4">
              <h3 className="font-['Space_Grotesk'] font-bold text-[var(--black)] text-sm">
                Besoin d&apos;aide ?
              </h3>
              <div className="text-sm text-[var(--text-muted)] leading-relaxed space-y-3">
                {assistance}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
