"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import type { ContactMessage } from "@/types/database";
import { SmoothInput } from "@/components/ui/SmoothInput";
import {
  Mail,
  MailOpen,
  Search,
  Clock,
  User,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      setMessages((data as ContactMessage[]) || []);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  const filtered = messages.filter((m) => {
    if (filterRead === "unread" && m.is_read) return false;
    if (filterRead === "read" && !m.is_read) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  async function markAsRead(id: string) {
    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: true } : prev));
    }
  }

  async function markAsUnread(id: string) {
    await supabase
      .from("contact_messages")
      .update({ is_read: false })
      .eq("id", id);

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: false } : m))
    );

    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, is_read: false } : prev));
    }
  }

  async function markAllAsRead() {
    const unreadIds = messages.filter((m) => !m.is_read).map((m) => m.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .in("id", unreadIds);

    setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-['JetBrains_Mono'] text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">
              Boîte de réception
            </span>
            <h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-text-primary tracking-tight">
              Messages
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Gérez les <strong className="text-text-primary">{messages.length}</strong> messages reçus via le formulaire de contact du site.
              {unreadCount > 0 && (
                <span className="text-blue-400 ml-1">({unreadCount} non lu{unreadCount > 1 ? "s" : ""})</span>
              )}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-xl glass px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-glass-bg-strong transition flex items-center gap-2 border border-glass-border"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
              <span>Tout marquer comme lu</span>
            </button>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Total messages</span>
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-teal">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary">{messages.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass p-5 border border-glass-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted">Aujourd&apos;hui</span>
              <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center text-teal">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="font-['Space_Grotesk'] text-2xl font-bold text-text-primary">
              {messages.filter((m) => {
                const today = new Date();
                const msgDate = new Date(m.created_at);
                return (
                  msgDate.getDate() === today.getDate() &&
                  msgDate.getMonth() === today.getMonth() &&
                  msgDate.getFullYear() === today.getFullYear()
                );
              }).length}
            </p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {[
            { key: "all" as const, label: "Tous" },
            { key: "unread" as const, label: "Non lus" },
            { key: "read" as const, label: "Lus" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterRead(f.key)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                filterRead === f.key
                  ? "bg-green text-on-void border-teal"
                  : "bg-glass-bg text-text-muted border-glass-border hover:border-glass-border-strong hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="relative flex-1 min-w-[200px] max-w-md ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
            <SmoothInput
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un message…"
              wrapperClassName="rounded-xl bg-void-2/60 border border-glass-border pl-9 pr-4 py-2"
              className="text-xs text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Messages Layout: List + Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Message List */}
          <div className="lg:col-span-2 rounded-2xl glass border border-glass-border overflow-hidden">
            {/* List header */}
            <div className="px-4 py-3 border-b border-glass-border flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {filtered.length} message{filtered.length !== 1 ? "s" : ""}
              </span>
              {unreadCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-[10px] font-bold text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div className="max-h-[580px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-teal animate-spin" />
                  <span className="text-[11px] text-text-muted">Chargement…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green/15 to-teal/10 flex items-center justify-center text-teal mb-3 ring-1 ring-teal/15">
                    <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs font-medium text-text-primary mb-0.5">Aucun message</p>
                  <p className="text-[11px] text-text-muted">
                    {messages.length === 0
                      ? "Aucun message reçu pour le moment."
                      : "Aucun message ne correspond à vos critères."}
                  </p>
                </div>
              ) : (
                filtered.map((msg, idx) => {
                  const initials = msg.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                  const isToday = (() => {
                    const d = new Date(msg.created_at);
                    const now = new Date();
                    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  })();
                  const timeStr = isToday
                    ? new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                    : new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                  const isSelected = selectedMessage?.id === msg.id;

                  return (
                    <motion.button
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.is_read) markAsRead(msg.id);
                      }}
                      className={`w-full text-left px-4 py-3.5 transition-all duration-200 group relative border-l-[3px] ${
                        isSelected
                          ? "bg-gradient-to-r from-green/8 to-transparent border-l-teal"
                          : "border-l-transparent hover:bg-glass-bg hover:border-l-green/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
                          isSelected
                            ? "bg-gradient-to-br from-green/25 to-teal/15 text-teal ring-1 ring-teal/25"
                            : msg.is_read
                              ? "bg-glass-bg-strong text-text-muted"
                              : "bg-gradient-to-br from-blue-500/15 to-blue-400/10 text-blue-400 ring-1 ring-blue-400/20"
                        }`}>
                          {initials}
                          {!msg.is_read && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-400 ring-2 ring-white/80 dark:ring-void-2" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className={`text-[13px] font-semibold truncate ${
                              msg.is_read ? "text-text-muted" : "text-text-primary"
                            }`}>
                              {msg.name}
                            </span>
                            <span className={`text-[10px] shrink-0 tabular-nums ${
                              msg.is_read ? "text-text-muted/60" : "text-text-muted"
                            }`}>
                              {timeStr}
                            </span>
                          </div>
                          <p className={`text-[12px] font-medium truncate mb-0.5 ${
                            msg.is_read ? "text-text-muted" : "text-text-primary"
                          }`}>
                            {msg.subject}
                          </p>
                          <p className="text-[11px] text-text-muted/70 truncate leading-relaxed">
                            {msg.message.slice(0, 90)}…
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-3">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl glass p-6 md:p-8 border border-glass-border space-y-6"
              >
                {/* Message Header */}
                <div className="pb-4 border-b border-glass-border">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="font-['Space_Grotesk'] font-bold text-lg text-text-primary">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal" />
                          {selectedMessage.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-teal" />
                          {selectedMessage.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(selectedMessage.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-void-2/60 rounded-xl border border-glass-border p-5">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-2xl glass p-12 border border-glass-border text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-14 h-14 rounded-2xl bg-green/10 flex items-center justify-center text-teal mb-4">
                  <MessageSquare className="w-7 h-7" strokeWidth={1.5} />
                </div>
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-text-primary mb-1">
                  Sélectionnez un message
                </h3>
                <p className="text-xs text-text-muted max-w-xs">
                  Cliquez sur un message dans la liste pour afficher son contenu complet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
