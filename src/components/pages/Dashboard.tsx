'use client';

import React from 'react';
import Link from 'next/link';
import { I } from '../icons';
import { Avatar, Badge, Severity, Sparkline, fmt, ago } from '../ui';
import {
  SERIES_30D, RATINGS_24H, MODERATION_WEEK, ACTIVITY, REPORTS, DISHES, USERS,
} from '@/lib/data';

// ============ Growth chart ============
function GrowthChart({ data, height = 200 }: { data: number[]; height?: number }) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 14, b: 26 };
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);
    return { x, y, v };
  });
  const path = "M " + points.map(p => `${p.x},${p.y}`).join(" L ");
  const area = `${path} L ${points[points.length - 1].x},${h - pad.b} L ${pad.l},${h - pad.b} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="gradGrow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
        const y = pad.t + t * (h - pad.t - pad.b);
        const val = Math.round(max - t * range);
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="var(--line-soft)" strokeDasharray="2 4" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--mute)" style={{ fontVariantNumeric: "tabular-nums" }}>{val}</text>
          </g>
        );
      })}
      {[0, 7, 14, 21, 29].map(i => {
        if (!points[i]) return null;
        return <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--mute)">{`D${i + 1}`}</text>;
      })}
      <path d={area} fill="url(#gradGrow)" />
      <path d={path} stroke="var(--brand)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => i % 4 === 0 && <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--brand)" />)}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill="white" stroke="var(--brand)" strokeWidth="2" />
    </svg>
  );
}

// ============ Stacked bars ============
function StackedBars({ data }: { data: typeof MODERATION_WEEK }) {
  const max = Math.max(...data.map(d => d.open + d.reviewing + d.resolved + d.dismissed));
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 8, height: 200, padding: "8px 4px" }}>
      {data.map(d => {
        const total = d.open + d.reviewing + d.resolved + d.dismissed;
        return (
          <div key={d.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div className="tnum text-xs muted">{total}</div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column-reverse", height: 156, borderRadius: 6, overflow: "hidden", background: "var(--paper)" }}>
              {[
                { v: d.resolved,  c: "var(--ok)" },
                { v: d.reviewing, c: "var(--warn)" },
                { v: d.open,      c: "var(--danger)" },
                { v: d.dismissed, c: "var(--mute-2)" },
              ].map((s, i) => (
                <div key={i} style={{ height: (s.v / max) * 156, background: s.c, transition: "height .3s" }} />
              ))}
            </div>
            <div className="text-xs muted">{d.d}</div>
          </div>
        );
      })}
    </div>
  );
}

// ============ Dashboard page ============
export default function Dashboard() {
  const stats = [
    { label: "Total users",       val: fmt(212804), delta: "+8.2%",  down: false, spark: SERIES_30D },
    { label: "Active today",      val: fmt(38421),  delta: "+12.4%", down: false, spark: RATINGS_24H },
    { label: "Ratings today",     val: fmt(4218),   delta: "+22.0%", down: false, spark: SERIES_30D.slice(0, 12).reverse() },
    { label: "Restaurants added", val: "47",        delta: "+5",     down: false, spark: [3,4,2,5,6,4,7,5,6,8,9,7] },
    { label: "Pending reports",   val: "124",       delta: "+18",    down: true,  spark: [12,18,14,22,19,28,32,29,35,38,42,47] },
    { label: "Moderation queue",  val: "62",        delta: "−4",     down: false, spark: [80,76,72,68,71,69,72,68,65,64,66,62], invert: true },
    { label: "AI accuracy",       val: "99.2%",     delta: "+0.4%",  down: false, spark: [97.8,98.1,98.3,98.6,98.5,98.8,98.9,99.0,98.9,99.1,99.0,99.2] },
    { label: "Avg response time", val: "4m 12s",    delta: "−18%",   down: false, spark: [9,8,8,7,7,6,6,5,5,5,4.5,4.2], invert: true },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="eyebrow mb-2">Tuesday · May 14, 2026</div>
          <h1>Good evening, Alex.</h1>
          <div className="sub">Here&apos;s what&apos;s happening across SmackCheck right now.</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Calendar size={14} /> Last 7 days <I.ChevronDown size={14} /></button>
          <button className="btn btn-secondary"><I.Download size={14} /> Export</button>
          <button className="btn btn-primary"><I.Plus size={14} /> New</button>
        </div>
      </div>

      {/* Stat grid */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 18 }}>
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="label">{s.label}</div>
            <div className="val tnum">{s.val}</div>
            <div className={"delta " + (s.down ? "down" : "")}>
              {s.down ? <I.ArrowDown size={11} /> : <I.ArrowUp size={11} />}
              {s.delta}
              <span style={{ color: "var(--mute)", fontWeight: 400, marginLeft: 4 }}>vs. last week</span>
            </div>
            <div className="spark">
              <Sparkline data={s.spark} width={70} height={28} color={s.down ? "var(--danger)" : "var(--brand)"} fill={true} />
            </div>
          </div>
        ))}
      </div>

      {/* Big charts row */}
      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 18 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h4>User growth</h4>
              <div className="text-xs muted mt-1">New + active users · last 30 days</div>
            </div>
            <div className="row gap-2">
              <span className="chip on" style={{ padding: "4px 10px", fontSize: 11.5 }}>30d</span>
              <span className="chip" style={{ padding: "4px 10px", fontSize: 11.5 }}>90d</span>
              <span className="chip" style={{ padding: "4px 10px", fontSize: 11.5 }}>1y</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: 16 }}>
            <GrowthChart data={SERIES_30D} height={260} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h4>Moderation this week</h4>
              <div className="text-xs muted mt-1">By status, daily</div>
            </div>
          </div>
          <div className="card-body">
            <StackedBars data={MODERATION_WEEK} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16, fontSize: 11.5 }}>
              {[
                { l: "Open",      c: "var(--danger)" },
                { l: "Reviewing", c: "var(--warn)" },
                { l: "Resolved",  c: "var(--ok)" },
                { l: "Dismissed", c: "var(--mute-2)" },
              ].map(k => (
                <div key={k.l} className="row gap-2" style={{ alignItems: "center" }}>
                  <span style={{ width: 10, height: 10, background: k.c, borderRadius: 3 }} />
                  <span className="muted">{k.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle row — three columns */}
      <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr 1fr", marginBottom: 18 }}>
        {/* Recent activity */}
        <div className="card">
          <div className="card-head">
            <h4>Recent activity</h4>
            <Link href="/logs" style={{ fontSize: 12, color: "var(--brand)", textDecoration: "none" }}>View all →</Link>
          </div>
          <div className="card-body" style={{ padding: "8px 20px 16px" }}>
            <div className="timeline">
              {ACTIVITY.map((a, i) => (
                <div className="tl-row" key={i}>
                  <div className={"tl-dot " + a.dot}>
                    {a.kind === "report" ? <I.Flag size={14} /> :
                     a.kind === "ban" ? <I.X size={14} /> :
                     a.kind === "verify" ? <I.Check size={14} /> :
                     a.kind === "badge" ? <I.Badge size={14} /> :
                     a.kind === "push" ? <I.Send size={14} /> :
                     <I.Edit size={14} />}
                  </div>
                  <div className="tl-body">
                    <div style={{ fontSize: 13.5, color: "var(--ink-2)" }}>{a.text}</div>
                    <div className="desc"><span className="muted">by</span> <b style={{ fontWeight: 500, color: "var(--ink-3)" }}>{a.who}</b></div>
                  </div>
                  <div className="tl-time">{ago(a.time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top urgent reports */}
        <div className="card">
          <div className="card-head">
            <div>
              <h4>Top urgent reports</h4>
              <div className="text-xs muted mt-1">Sorted by severity + AI score</div>
            </div>
            <Link href="/reports" style={{ fontSize: 12, color: "var(--brand)", textDecoration: "none" }}>Queue →</Link>
          </div>
          <div style={{ padding: "4px 4px 4px" }}>
            {REPORTS.filter(r => r.status === "open").slice(0, 4).map(r => (
              <Link key={r.id} href="/reports" style={{ textDecoration: "none", display: "block" }}>
                <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line-soft)", cursor: "pointer", transition: "background .08s" }}>
                  <div className="between mb-2">
                    <Severity level={r.severity} />
                    <span className="muted" style={{ fontSize: 11 }}>{ago(r.submitted)}</span>
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13, marginBottom: 4 }}>{r.targetTitle}</div>
                  <div className="muted text-xs truncate" style={{ maxWidth: 280 }}>{r.targetSnippet}</div>
                  <div className="row gap-2 mt-3">
                    <Badge kind="brand" size="">{r.category}</Badge>
                    <Badge>AI {(r.aiConfidence * 100).toFixed(0)}%</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System status + quick actions */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-head">
              <h4>System status</h4>
              <Badge kind="ok" pip>All systems normal</Badge>
            </div>
            <div className="card-body" style={{ padding: "8px 20px 16px" }}>
              {[
                { name: "API gateway",       status: "ok",   value: "23ms p50" },
                { name: "Ratings ingestion", status: "ok",   value: "12k/min" },
                { name: "AI moderation",     status: "ok",   value: "v4.2.1 · 99.2%" },
                { name: "Push delivery",     status: "warn", value: "1.4s delay" },
                { name: "Image vision",      status: "ok",   value: "OK" },
                { name: "Search index",      status: "ok",   value: "fresh" },
              ].map(s => (
                <div key={s.name} className="between" style={{ padding: "8px 0", borderTop: "1px solid var(--line-soft)" }}>
                  <div className="row gap-3" style={{ alignItems: "center" }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 999,
                      background: s.status === "ok" ? "var(--ok)" : s.status === "warn" ? "var(--warn)" : "var(--danger)",
                      boxShadow: s.status === "ok" ? "0 0 0 3px rgba(63,122,82,0.15)" : "0 0 0 3px rgba(181,131,65,0.18)"
                    }} />
                    <span style={{ fontSize: 13 }}>{s.name}</span>
                  </div>
                  <span className="muted text-xs tnum">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h4>Quick actions</h4>
            </div>
            <div style={{ padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { i: I.Flag,  l: "Review queue", c: "var(--danger)", r: "/reports" },
                { i: I.Send,  l: "Send push",    c: "var(--brand)",  r: "/notifications" },
                { i: I.Badge, l: "New badge",    c: "var(--warn)",   r: "/badges" },
                { i: I.Store, l: "Add place",    c: "var(--info)",   r: "/restaurants" },
              ].map((a, i) => {
                const Ic = a.i;
                return (
                  <Link key={i} href={a.r} style={{ textDecoration: "none" }}>
                    <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", transition: "all .12s" }}
                         onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.background = "var(--brand-soft)"; }}
                         onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.background = "white"; }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--paper)", display: "grid", placeItems: "center", color: a.c, marginBottom: 8 }}>
                        <Ic size={16} />
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{a.l}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: trending + recent signups */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h4>Trending today</h4>
            <Link href="/analytics" style={{ fontSize: 12, color: "var(--brand)", textDecoration: "none" }}>Analytics →</Link>
          </div>
          <div style={{ padding: "4px 0" }}>
            {[
              { d: DISHES[0], rank: 1, delta: "+412 ratings" },
              { d: DISHES[1], rank: 2, delta: "+318 ratings" },
              { d: DISHES[3], rank: 3, delta: "+204 ratings" },
              { d: DISHES[2], rank: 4, delta: "+188 ratings" },
            ].map(({ d, rank, delta }) => (
              <div key={d.id} className="row gap-3" style={{ padding: "10px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center" }}>
                <span className="font-display" style={{ fontSize: 22, color: "var(--mute-2)", width: 24, textAlign: "center" }}>{rank}</span>
                <img src={d.img} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>{d.name}</div>
                  <div className="muted text-xs">{d.restaurant} · {d.cuisine}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="row gap-2" style={{ alignItems: "center", justifyContent: "flex-end" }}>
                    <I.Star size={12} style={{ color: "var(--brand-2)" }} />
                    <span className="tnum fw-600" style={{ fontSize: 13 }}>{d.rating}</span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--ok)", marginTop: 2 }}>{delta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h4>Recent signups</h4>
            <Link href="/users" style={{ fontSize: 12, color: "var(--brand)", textDecoration: "none" }}>All users →</Link>
          </div>
          <div style={{ padding: "4px 0" }}>
            {USERS.slice(0, 5).map(u => (
              <div key={u.id} className="row gap-3" style={{ padding: "10px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center" }}>
                <Avatar name={u.name} src={u.avatar} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>{u.name}</div>
                  <div className="muted text-xs">@{u.username} · {u.location}</div>
                </div>
                <div className="row gap-2">
                  <Badge>Lv {u.level}</Badge>
                  {u.verified && <Badge kind="info" pip>Verified</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
