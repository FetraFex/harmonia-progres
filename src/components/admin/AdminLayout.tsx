"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  Star,
  Settings,
  LogOut,
  Menu,
  Shield,
  Loader2,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  Users,
  Activity,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Candidatures", href: "/admin/candidatures", icon: FileText },
  { label: "Évaluations", href: "/admin/evaluations", icon: Star },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email: string; name?: string; role?: string } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("admin_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const supabase = createClient();
  const authChecked = useRef(false);

  useEffect(() => {
    async function checkAdminAuth() {
      if (authChecked.current) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/admin/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        const userData = {
          email: user.email || "",
          name: profile?.full_name || user.email?.split("@")[0] || "Admin",
          role: profile?.role || "admin",
        };
        setAdminUser(userData);
        localStorage.setItem("admin_user", JSON.stringify(userData));
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        authChecked.current = true;
        setCheckingAuth(false);
      }
    }

    checkAdminAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    localStorage.removeItem("admin_user");
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  // No full-page gate — sidebar stays visible during auth check

  const initials = adminUser?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-void text-text-primary flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-void-2/80 backdrop-blur-xl border-r border-glass-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand & Logo */}
        <div className="px-6 h-16 flex items-center justify-between border-b border-glass-border shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo
              width={170}
              height={42}
              priority
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="text-[9px] font-['JetBrains_Mono'] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-md bg-green/10 text-teal border border-teal/20">
            Admin
          </span>
        </div>

        {/* User Card */}
        <div className="px-4 py-4 border-b border-glass-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 border border-teal/20 flex items-center justify-center text-teal shrink-0 font-['Space_Grotesk'] font-bold text-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-primary truncate">
                {adminUser?.name || "Admin"}
              </p>
              <p className="text-[11px] text-text-muted truncate">
                {adminUser?.email || ""}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-['JetBrains_Mono'] uppercase tracking-widest text-teal/70">
                <Shield className="w-2.5 h-2.5" />
                {adminUser?.role || "admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
          <div>
            <span className="px-3 text-[9px] font-['JetBrains_Mono'] uppercase tracking-[0.2em] text-text-muted/60 font-semibold">
              Navigation
            </span>
            <div className="mt-3 space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-green text-on-void font-semibold shadow-lg shadow-green/20"
                        : "text-text-muted hover:text-text-primary hover:bg-glass-bg"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={`w-[18px] h-[18px] ${isActive ? "text-on-void" : "text-text-muted/70"}`}
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-on-void/70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span className="px-3 text-[9px] font-['JetBrains_Mono'] uppercase tracking-[0.2em] text-text-muted/60 font-semibold">
              Raccourcis
            </span>
            <div className="mt-3 space-y-1">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-text-muted hover:text-text-primary hover:bg-glass-bg transition"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-text-muted/50" />
                  <span>Site public</span>
                </div>
                <ExternalLink className="w-3 h-3 text-text-muted/40" />
              </Link>
              <Link
                href="/candidater"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-text-muted hover:text-text-primary hover:bg-glass-bg transition"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-text-muted/50" />
                  <span>Portail candidat</span>
                </div>
                <ExternalLink className="w-3 h-3 text-text-muted/40" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-glass-border shrink-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] text-text-muted/50 font-['JetBrains_Mono']">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
            <ThemeToggle className="h-8 w-8 p-1.5 rounded-full glass" />
            <span className="text-[10px] text-text-muted/50 font-['JetBrains_Mono']">
              {currentTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition w-full"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-16 border-b border-glass-border bg-void/90 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg glass text-text-primary hover:text-teal transition"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Logo
              width={130}
              height={30}
              className="h-6 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="h-8 w-8 p-1.5 rounded-full glass" />
            <span className="text-[9px] font-['JetBrains_Mono'] font-bold uppercase tracking-[0.15em] px-2 py-1 rounded-md bg-green/10 text-teal border border-teal/20">
              Admin
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] w-full mx-auto">
          {checkingAuth ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 text-teal animate-spin" />
                <p className="text-xs text-text-muted">Chargement…</p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
