"use client";

import { useEffect } from "react";
import type { ThemeConfig } from "@/lib/theme-registry";

export default function ThemeProvider({ 
  children, 
  settings 
}: { 
  children: React.ReactNode; 
  settings: ThemeConfig;
}) {
  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    root.style.setProperty("--theme-bg", settings.bgColor);
    root.style.setProperty("--theme-text", settings.textColor);
    root.style.setProperty("--theme-primary", settings.primaryColor);
    root.style.setProperty("--theme-btn-bg", settings.buttonBgColor);
    root.style.setProperty("--theme-btn-text", settings.buttonTextColor);
    root.style.setProperty("--theme-btn-radius", settings.buttonRadius);
    root.style.setProperty("--theme-font", settings.fontFamily);
    root.style.setProperty("--theme-card-bg", settings.cardBgColor);

  }, [settings]);

  return <div style={{ fontFamily: 'var(--theme-font)' }} className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]">{children}</div>;
}
