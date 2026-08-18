"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggleButton2 } from "@/components/ui/skiper-ui/skiper4";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ThemeToggleButton2
      isDark={isDark}
      onClick={toggleTheme}
      label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={cn("h-10 w-10 p-2", className)}
    />
  );
}
