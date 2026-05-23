'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Badge, Select, ago } from '../ui';
import { MOD_LOGS } from '@/lib/data';

export default function ModLogs() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState({ action: "all", actor: "all" });

  const actionMeta: Record<string, { i: React.ComponentType<{ size?: number }>; c: string; l: string }> = {
    ban:          { i: I.Lock,    c: "danger", l: "Banned" },
    unban:        { i: I.Check,   c: "ok",     l: "Unbanned" },
    warn:         { i: I.Shield,  c: "warn",   l: "Warned" },
    hide:         { i: I.Eye,     c: "",       l: "Hid" },
    remove:       { i: I.Trash,   c: "danger", l: "Removed" },
    approve:      { i: I.Check,   c: "ok",     l: "Approved" },
    dismiss:      { i: I.X,       c: "",       l: "Dismissed" },
    verify:       { i: I.Check,   c: "ok",     l: "Verified" },
    merge:        { i: I.Layers,  c: "",       l: "Merged" },
    create_badge: { i: I.Badge,   c: "brand",  l: "Created badge" },
    broadcast:    { i: I.Send,    c: "brand",  l: "Broadcast" },
    feature:      { i: I.Star,    c: "brand",  l: "Featured" },
  };

  const filtered = MOD_LOGS.filter(l => {
    if (filter.action !== "all" && l.action !== filter.action) return false;
    if (filter.actor !== "all" && !l.actor.toLowerCase().includes(filter.actor)) return false;
    if (q) {
      const lc = q.toLowerCase();
      return l.target.toLowerCase().includes(lc) || l.detail.toLowerCase().includes(lc) || l.id.toLowerCase().includes(lc) || l.actor.toLowerCase().includes(lc);
    }
    return true;
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Moderation log</h1>
          <div className="sub">Full audit trail. Every action taken by every admin and automated system.</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Download size={14} /> Export CSV</button>
          <button className="btn btn-secondary"><I.Filter size={14} /> Saved views</button>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: 14 }}>
        <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <div className="input-icon" style={{ flex: "1 1 280px", maxWidth: 380 }}>
            <I.Search size={14} />
            <input className="input" placeholder="Search by target, actor, or log ID…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value={filter.action} onChange={v => setFilter({ ...filter, action: v })}
                  options={[["all","All actions"],["ban","Ban"],["warn","Warn"],["hide","Hide"],["remove","Remove"],["approve","Approve"],["verify","Verify"],["broadcast","Broadcast"]]} />
          <Select value={filter.actor} onChange={v => setFilter({ ...filter, actor: v })}
                  options={[["all","All actors"],["auto","Auto-mod"],["alex","Alex Chen"],["marcus","Marcus Q."],["sara","Sara Kwon"]]} />
          <button className="btn btn-secondary sm"><I.Calendar size={12} /> Last 7 days</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="timeline" style={{ padding: "12px 20px" }}>
          {filtered.map(l => {
            const meta = actionMeta[l.action] || { i: I.Edit, c: "", l: l.action };
            const Ic = meta.i;
            const isAuto = l.actor === "Auto-mod";
            return (
              <div className="tl-row" key={l.id} style={{ padding: "14px 0" }}>
                <div className={"tl-dot " + meta.c}><Ic size={13} /></div>
                <div className="tl-body">
                  <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>{l.actor}</span>
                    {isAuto && <Badge kind="brand"><span className="row gap-1" style={{ alignItems: "center" }}><I.Sparkle size={9} />auto</span></Badge>}
                    <span className="muted" style={{ fontSize: 13 }}>{meta.l.toLowerCase()}</span>
                    <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>{l.target}</span>
                  </div>
                  <div className="desc mt-1">{l.detail}</div>
                  <div className="row gap-2 mt-2" style={{ alignItems: "center" }}>
                    <span className="font-mono text-xs muted">{l.id}</span>
                    {l.evidence !== "—" && (<><span className="muted text-xs">·</span><span className="text-xs"><span className="muted">evidence:</span> <a style={{ color: "var(--brand)" }}>{l.evidence}</a></span></>)}
                  </div>
                </div>
                <div className="tl-time">
                  <div>{ago(l.time)}</div>
                  <div className="muted text-xs" style={{ marginTop: 2 }}>via web</div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="empty"><div className="ico"><I.Search size={20} /></div><h4>No matching events</h4><div className="muted text-sm mt-1">Try widening your filters.</div></div>}
      </div>
    </div>
  );
}
