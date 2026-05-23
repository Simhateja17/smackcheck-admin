'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Badge, Mini, Sparkline, fmt } from '../ui';
import { SERIES_30D, RATINGS_24H, ANALYTICS } from '@/lib/data';

// ============ Growth chart ============
function GrowthChart({ data, height = 200 }: { data: number[]; height?: number }) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 14, b: 26 };
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * (w - pad.l - pad.r);
    const y = pad.t + (1 - (v - min) / range) * (h - pad.t - pad.b);
    return { x, y };
  });
  const path = "M " + points.map(p => `${p.x},${p.y}`).join(" L ");
  const area = `${path} L ${points[points.length-1].x},${h - pad.b} L ${pad.l},${h - pad.b} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((t, i) => {
        const y = pad.t + t * (h - pad.t - pad.b);
        const val = Math.round(max - t * range);
        return (
          <g key={i}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="var(--line-soft)" strokeDasharray="2 4"/>
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="var(--mute)" style={{ fontVariantNumeric: "tabular-nums" }}>{val}</text>
          </g>
        );
      })}
      {[0, 7, 14, 21, 29].map(i => {
        if (!points[i]) return null;
        return <text key={i} x={points[i].x} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--mute)">{`D${i+1}`}</text>;
      })}
      <path d={area} fill="url(#gradA)"/>
      <path d={path} stroke="var(--brand)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((p, i) => i % 4 === 0 && <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--brand)"/>)}
      <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="4" fill="white" stroke="var(--brand)" strokeWidth="2"/>
    </svg>
  );
}

// ============ Cohort heatmap ============
function CohortHeatmap() {
  const cohorts = ["W18","W19","W20","W21","W22","W23","W24","W25"];
  const matrix = cohorts.map((_, i) => Array.from({length: 8 - i}, (_, j) => {
    const base = 100 - j * 12 - Math.random() * 8;
    return Math.max(20, Math.round(base));
  }));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 4, fontSize: 11, color: "var(--mute)", marginBottom: 8 }}>
        <div></div>
        {Array.from({length: 8}, (_, i) => <div key={i} style={{ textAlign: "center" }}>W{i}</div>)}
      </div>
      {cohorts.map((c, i) => (
        <div key={c} style={{ display: "grid", gridTemplateColumns: "60px repeat(8, 1fr)", gap: 4, marginBottom: 4 }}>
          <div style={{ fontSize: 11, color: "var(--mute)", display: "flex", alignItems: "center" }}>{c}</div>
          {Array.from({length: 8}, (_, j) => {
            const v = matrix[i][j];
            if (v == null) return <div key={j}/>;
            return (
              <div key={j} title={`${v}% retained`} style={{
                background: `rgba(100,34,35,${0.08 + (v/100)*0.85})`,
                color: v > 50 ? "white" : "var(--ink)",
                padding: "10px 0",
                textAlign: "center",
                fontSize: 11.5,
                fontWeight: 600,
                borderRadius: 4,
                fontVariantNumeric: "tabular-nums",
              }}>{v}%</div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ============ Donut chart ============
function DonutChart({ data }: { data: { l: string; v: number; c: string }[] }) {
  const total = data.reduce((s, d) => s + d.v, 0);
  let acc = 0;
  const r = 70, cx = 100, cy = 100;
  const segs = data.map(d => {
    const start = (acc / total) * Math.PI * 2 - Math.PI/2;
    acc += d.v;
    const end = (acc / total) * Math.PI * 2 - Math.PI/2;
    const large = d.v / total > 0.5 ? 1 : 0;
    const x1 = cx + Math.cos(start) * r, y1 = cy + Math.sin(start) * r;
    const x2 = cx + Math.cos(end) * r, y2 = cy + Math.sin(end) * r;
    return { d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z` };
  });
  return (
    <div className="row gap-4" style={{ alignItems: "center" }}>
      <svg width={200} height={200} viewBox="0 0 200 200" style={{ flex: "none" }}>
        {segs.map((s, i) => <path key={i} d={s.path} fill={s.d.c} stroke="white" strokeWidth="2"/>)}
        <circle cx={cx} cy={cy} r={40} fill="white"/>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontFamily="var(--display)" fill="var(--ink)">100%</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="var(--mute)">activity</text>
      </svg>
      <div style={{ flex: 1 }}>
        {data.map(d => (
          <div key={d.l} className="row gap-3 mb-2" style={{ alignItems: "center" }}>
            <span style={{ width: 10, height: 10, background: d.c, borderRadius: 3 }}/>
            <span style={{ flex: 1, fontSize: 13 }}>{d.l}</span>
            <span className="tnum text-sm fw-600">{d.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Confusion matrix ============
function ConfusionMatrix() {
  const cats = ["Safe","Spam","Toxic","NSFW"];
  const matrix = [
    [9842, 12, 4, 2],
    [8, 412, 6, 1],
    [3, 4, 218, 0],
    [1, 0, 2, 88],
  ];
  const max = Math.max(...matrix.flat());
  return (
    <div style={{ display: "grid", gridTemplateColumns: "60px repeat(4, 1fr)", gap: 3 }}>
      <div/>
      {cats.map(c => <div key={c} style={{ fontSize: 11, color: "var(--mute)", textAlign: "center", padding: 4 }}>{c}</div>)}
      {cats.map((row, i) => (
        <React.Fragment key={row}>
          <div style={{ fontSize: 11, color: "var(--mute)", display: "flex", alignItems: "center" }}>{row}</div>
          {cats.map((_, j) => {
            const v = matrix[i][j];
            const correct = i === j;
            return (
              <div key={j} style={{
                background: correct ? `rgba(63,122,82,${0.15 + (v/max)*0.7})` : `rgba(168,66,63,${0.05 + (v/max)*0.6})`,
                color: correct && v/max > 0.4 ? "white" : "var(--ink)",
                padding: 10, textAlign: "center", fontSize: 12, fontWeight: 600, borderRadius: 4,
                fontVariantNumeric: "tabular-nums",
              }}>{fmt(v)}</div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

// ============ Analytics page ============
export default function Analytics() {
  const [range, setRange] = useState("30d");

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Analytics</h1>
          <div className="sub">Community health, growth, and platform performance.</div>
        </div>
        <div className="row">
          <div style={{ display: "flex", background: "var(--paper)", borderRadius: 8, padding: 3, border: "1px solid var(--line)" }}>
            {["7d","30d","90d","1y"].map(r => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: "6px 14px", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", background: range === r ? "white" : "transparent", color: range === r ? "var(--ink)" : "var(--mute)", fontWeight: 500, boxShadow: range === r ? "0 1px 2px rgba(0,0,0,0.05)" : "none" }}>{r}</button>
            ))}
          </div>
          <button className="btn btn-secondary"><I.Download size={14} /> Export</button>
        </div>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { l: "New users",      v: fmt(18420),  d: "+12%",     s: SERIES_30D },
          { l: "DAU",            v: fmt(72104),  d: "+8%",      s: RATINGS_24H },
          { l: "Ratings posted", v: fmt(241082), d: "+22%",     s: SERIES_30D.map(v => v * 8) },
          { l: "Avg session",    v: "8m 42s",    d: "+1m 12s",  s: [7,7.2,7.5,7.8,8.0,8.1,8.3,8.5,8.6,8.7] },
        ].map((k, i) => (
          <div key={i} className="stat">
            <div className="label">{k.l}</div>
            <div className="val tnum">{k.v}</div>
            <div className="delta"><I.ArrowUp size={11} />{k.d}</div>
            <div className="spark"><Sparkline data={k.s} width={70} height={28} color="var(--brand)" fill /></div>
          </div>
        ))}
      </div>

      <div className="card mb-4">
        <div className="card-head">
          <div>
            <h4>User growth</h4>
            <div className="text-xs muted mt-1">New signups + reactivations · {range}</div>
          </div>
          <div className="row gap-3" style={{ alignItems: "center", fontSize: 12 }}>
            <div className="row gap-2" style={{ alignItems: "center" }}><span style={{ width: 8, height: 8, background: "var(--brand)", borderRadius: 999 }}/><span className="muted">New</span></div>
            <div className="row gap-2" style={{ alignItems: "center" }}><span style={{ width: 8, height: 8, background: "var(--brand-2)", borderRadius: 999 }}/><span className="muted">Reactivated</span></div>
          </div>
        </div>
        <div style={{ padding: 16 }}><GrowthChart data={SERIES_30D} height={260}/></div>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h4>Retention</h4>
            <span className="muted text-xs">Day-0 anchor, by signup cohort</span>
          </div>
          <div style={{ padding: 16, overflowX: "auto" }}>
            <CohortHeatmap/>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h4>Geographic split</h4>
            <span className="muted text-xs">active users</span>
          </div>
          <div style={{ padding: "12px 20px 18px" }}>
            {ANALYTICS.geoSplit.map(g => (
              <div key={g.region} className="row gap-3 mb-3" style={{ alignItems: "center" }}>
                <div style={{ minWidth: 96, fontSize: 13 }}>{g.region}</div>
                <div style={{ flex: 1, height: 8, background: "var(--paper)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${g.pct*2.5}%`, height: "100%", background: "linear-gradient(90deg, var(--brand), var(--brand-2))", borderRadius: 999 }}/>
                </div>
                <div className="tnum text-xs muted" style={{ minWidth: 60, textAlign: "right" }}>{fmt(g.users)}</div>
                <div className="tnum text-xs fw-600" style={{ minWidth: 32, textAlign: "right" }}>{g.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="card-head">
            <h4>Engagement breakdown</h4>
            <span className="muted text-xs">per active user, this week</span>
          </div>
          <div style={{ padding: 16 }}>
            <DonutChart data={[
              { l: "Ratings",  v: 42, c: "var(--brand)" },
              { l: "Comments", v: 24, c: "var(--brand-2)" },
              { l: "Stories",  v: 14, c: "#c98484" },
              { l: "Saves",    v: 12, c: "var(--mute-2)" },
              { l: "Other",    v: 8,  c: "#dcd5cf" },
            ]}/>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h4>AI moderation accuracy</h4>
            <Badge kind="ok" pip>99.2% · model v4.2.1</Badge>
          </div>
          <div style={{ padding: 16 }}>
            <div className="grid mb-4" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Mini label="True positives" value="98.4%"/>
              <Mini label="False positives" value="1.2%"/>
              <Mini label="False negatives" value="0.4%"/>
            </div>
            <div className="eyebrow mb-2">Confusion matrix · last 7 days</div>
            <ConfusionMatrix/>
          </div>
        </div>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <div className="card-head"><h4>Top restaurants</h4><span className="muted text-xs">by ratings</span></div>
          <div style={{ padding: "4px 0" }}>
            {ANALYTICS.topRestaurants.map((r, i) => (
              <div key={r.name} className="row gap-3" style={{ padding: "10px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center" }}>
                <span className="font-display" style={{ fontSize: 20, color: "var(--mute-2)", width: 22, textAlign: "center" }}>{i+1}</span>
                <div style={{ flex: 1 }}><b style={{ color: "var(--ink)" }}>{r.name}</b></div>
                <div className="tnum text-sm">{fmt(r.ratings)}</div>
                <div className="tnum text-xs fw-600" style={{ color: r.growth > 0 ? "var(--ok)" : "var(--danger)", minWidth: 56, textAlign: "right" }}>
                  {r.growth > 0 ? "+" : ""}{r.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h4>Top dishes</h4><span className="muted text-xs">this period</span></div>
          <div style={{ padding: "4px 0" }}>
            {ANALYTICS.topDishes.map((d, i) => (
              <div key={d.name} className="row gap-3" style={{ padding: "10px 20px", borderTop: "1px solid var(--line-soft)", alignItems: "center" }}>
                <span className="font-display" style={{ fontSize: 20, color: "var(--mute-2)", width: 22, textAlign: "center" }}>{i+1}</span>
                <div style={{ flex: 1 }}>
                  <b style={{ color: "var(--ink)" }}>{d.name}</b>
                  <div className="muted text-xs">{d.restaurant}</div>
                </div>
                <div className="row gap-1" style={{ alignItems: "center" }}><I.Star size={11} style={{ color: "var(--brand-2)" }}/><b className="tnum">{d.rating}</b></div>
                <div className="tnum text-xs muted" style={{ minWidth: 50, textAlign: "right" }}>{fmt(d.ratings)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
