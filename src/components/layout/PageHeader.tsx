"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-glass-border bg-void/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-transparent-dark.png"
            alt="Harmonia Progrès"
            width={140}
            height={36}
            className="h-7 w-auto object-contain"
          />
        </Link>
        <ThemeToggle className="h-10 w-10 p-2 rounded-full glass" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{title}</h1>
          <p className="mt-3 text-base text-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  );
}
