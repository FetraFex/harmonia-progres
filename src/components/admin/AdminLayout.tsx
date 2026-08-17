"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Candidatures", href: "/admin/candidatures", icon: FileText },
  { label: "Évaluations", href: "/admin/evaluations", icon: Star },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#050505] flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="px-6 h-16 flex items-center border-b border-white/10">
          <Link href="/" className="font-['Space_Grotesk'] text-lg font-bold">
            <span className="text-white">H</span>
            <span className="text-teal">ARMONIA</span>
          </Link>
          <span className="ml-2 text-xs text-gray-500 font-medium">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition w-full"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden h-14 border-b border-gray-200 bg-white flex items-center px-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </button>
          <span className="ml-3 font-['Space_Grotesk'] font-bold text-sm">
            <span className="text-gray-900">H</span>
            <span className="text-teal">ARMONIA</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto p-2">
            <X className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
          </button>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
