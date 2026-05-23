'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { I } from '../icons';
import { NAV_ROUTES } from '@/lib/nav';
import { REPORTS, USERS, RESTAURANTS } from '@/lib/data';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const [q, setQ] = useState("");
  const router = useRouter();

  const items = useMemo(() => {
    const all = [
      ...NAV_ROUTES.map(n => ({ kind: "Nav", id: "nav:" + n.id, label: n.label, sub: n.group, action: () => router.push(n.href) })),
      ...REPORTS.map(r => ({ kind: "Report", id: r.id, label: `${r.id} · ${r.category}`, sub: r.targetTitle, action: () => router.push("/reports") })),
      ...USERS.map(u => ({ kind: "User", id: u.id, label: u.name, sub: "@" + u.username, action: () => router.push("/users") })),
      ...RESTAURANTS.map(r => ({ kind: "Restaurant", id: r.id, label: r.name, sub: r.cuisine + " · " + r.city, action: () => router.push("/restaurants") })),
    ];
    if (!q) return all.slice(0, 12);
    const lc = q.toLowerCase();
    return all.filter(i => i.label.toLowerCase().includes(lc) || (i.sub || "").toLowerCase().includes(lc)).slice(0, 20);
  }, [q, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o: boolean) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(20,15,15,0.36)", zIndex: 200, display: "grid", placeItems: "start center", paddingTop: "10vh" }}
      onClick={() => setOpen(false)}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: 600, maxWidth: "92vw", background: "white", borderRadius: 14, boxShadow: "var(--sh-pop)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
          <I.Search size={16} style={{ color: "var(--mute)" }} />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search anything…"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 15, background: "transparent", color: "var(--ink)" }}
          />
          <span className="kbd-key">esc</span>
        </div>
        <div style={{ maxHeight: 440, overflowY: "auto", padding: 6 }}>
          {items.map(i => (
            <div key={i.id} className="menu-item" onClick={() => { i.action(); setOpen(false); setQ(""); }}>
              <span style={{ fontSize: 10, color: "var(--mute)", textTransform: "uppercase", letterSpacing: "0.08em", width: 70, fontWeight: 600 }}>{i.kind}</span>
              <span style={{ color: "var(--ink)", fontWeight: 500 }}>{i.label}</span>
              <span style={{ color: "var(--mute)", marginLeft: "auto", fontSize: 12 }}>{i.sub}</span>
            </div>
          ))}
          {!items.length && (
            <div className="empty">
              <div className="ico"><I.Search size={20} /></div>
              <div className="muted">No results for &quot;{q}&quot;</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
