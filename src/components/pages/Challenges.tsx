'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Badge, StatusBadge, fmt } from '../ui';
import { CHALLENGES, Challenge } from '@/lib/data';

function ChallengeRow({ c }: { c: Challenge }) {
  const icons: Record<string, React.ComponentType<{ size?: number }>> = { daily: I.Clock, weekly: I.Calendar, monthly: I.Trophy };
  const Ic = icons[c.type] || I.Trophy;
  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="row gap-4" style={{ alignItems: "flex-start" }}>
        <div style={{ width: 56, height: 56, background: "var(--brand-soft)", border: "1px solid var(--brand-line)", color: "var(--brand)", borderRadius: 12, display: "grid", placeItems: "center", flex: "none" }}>
          <Ic size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div className="row gap-2 mb-1" style={{ alignItems: "center" }}>
            <h4 style={{ fontFamily: "var(--display)", fontSize: 21, color: "var(--ink)" }}>{c.name}</h4>
            <Badge kind="brand">+{c.xp} XP</Badge>
            <Badge>{c.type}</Badge>
            <StatusBadge status={c.status} />
          </div>
          <div className="muted text-sm mb-3">{c.desc}</div>
          <div className="row gap-5" style={{ alignItems: "center" }}>
            <div>
              <div className="muted text-xs">Participants</div>
              <div className="font-display tnum" style={{ fontSize: 20, color: "var(--ink)" }}>{fmt(c.participants)}</div>
            </div>
            <div style={{ minWidth: 180 }}>
              <div className="between">
                <div className="muted text-xs">Completion</div>
                <div className="text-xs fw-600 tnum">{(c.completion * 100).toFixed(0)}%</div>
              </div>
              <div style={{ height: 6, background: "var(--paper)", borderRadius: 999, marginTop: 4, overflow: "hidden" }}>
                <div style={{ width: `${c.completion * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--brand), var(--brand-2))", borderRadius: 999 }} />
              </div>
            </div>
            <div>
              <div className="muted text-xs">Window</div>
              <div className="text-sm tnum">{c.start.slice(5)} → {c.end.slice(5)}</div>
            </div>
          </div>
        </div>
        <div className="row gap-2">
          <button className="btn sm btn-secondary"><I.Chart size={12} /> Analytics</button>
          <button className="btn sm btn-secondary"><I.Edit size={12} /> Edit</button>
          {c.status === "active" && <button className="btn sm btn-secondary" style={{ color: "var(--danger)" }}><I.X size={12} /> End</button>}
        </div>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Challenges</h1>
          <div className="sub">Time-limited XP campaigns for daily, weekly, and monthly engagement.</div>
        </div>
        <button className="btn btn-primary"><I.Plus size={14} /> New challenge</button>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat"><div className="label">Live now</div><div className="val tnum">{CHALLENGES.filter(c => c.status === "active").length}</div><div className="muted text-xs">across 3 cadences</div></div>
        <div className="stat"><div className="label">Active participants</div><div className="val tnum">{fmt(CHALLENGES.filter(c => c.status === "active").reduce((s, c) => s + c.participants, 0))}</div><div className="delta"><I.ArrowUp size={11} />+22%</div></div>
        <div className="stat"><div className="label">Avg completion</div><div className="val tnum">54%</div><div className="delta"><I.ArrowUp size={11} />+4%</div></div>
        <div className="stat"><div className="label">XP rewarded</div><div className="val tnum">3.2M</div><div className="muted text-xs">last 30 days</div></div>
      </div>

      <div className="row gap-2 mb-4">
        {["all", "active", "scheduled", "ended"].map(f => (
          <button key={f} className={"chip " + (filter === f ? "on" : "")} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>

      <div className="col gap-3">
        {CHALLENGES.filter(c => filter === "all" || c.status === filter).map(c => (
          <ChallengeRow key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
