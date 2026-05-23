'use client';

import React, { useState, useMemo } from 'react';
import { I } from '../icons';
import { Avatar, Badge, StatusBadge, Stars, Select, fmt, ago } from '../ui';
import { RATINGS_FEED, RatingFeed } from '@/lib/data';

function PillStat({ label, v, color, set, on }: { label: string; v: number; color: string; set: () => void; on: boolean }) {
  const map: Record<string, { bg: string; bd: string; t: string }> = {
    warn:   { bg: "var(--warn-soft)",   bd: "#ecdcc1",             t: "var(--warn)" },
    ok:     { bg: "var(--ok-soft)",     bd: "#d2e3d8",             t: "var(--ok)" },
    danger: { bg: "var(--danger-soft)", bd: "#ecc9c7",             t: "var(--danger)" },
    brand:  { bg: "var(--brand-soft)",  bd: "var(--brand-line)",   t: "var(--brand-ink)" },
    "":     { bg: "var(--paper)",       bd: "var(--line)",         t: "var(--ink-3)" },
  };
  const m = map[color] || map[""];
  return (
    <button onClick={set} style={{
      background: on ? m.bg : "white",
      border: "1px solid " + (on ? m.bd : "var(--line)"),
      borderRadius: 12,
      padding: "14px 16px",
      textAlign: "left",
      cursor: "pointer",
      transition: "all .12s",
      position: "relative",
    }}>
      <div className="text-xs" style={{ color: on ? m.t : "var(--mute)", fontWeight: 500, letterSpacing: "0.02em" }}>{label}</div>
      <div className="font-display tnum" style={{ fontSize: 26, color: on ? m.t : "var(--ink)", marginTop: 4 }}>{fmt(v)}</div>
    </button>
  );
}

function ContentRow({ item, selected, checked, onCheck, onClick }: {
  item: RatingFeed; selected: boolean; checked: boolean; onCheck: (v: boolean) => void; onClick: () => void;
}) {
  return (
    <div onClick={onClick}
         style={{
           display: "grid",
           gridTemplateColumns: "24px 60px 1fr auto",
           gap: 12,
           alignItems: "center",
           padding: "12px 16px",
           borderBottom: "1px solid var(--line-soft)",
           background: selected ? "var(--brand-soft)" : "white",
           borderLeft: selected ? "3px solid var(--brand)" : "3px solid transparent",
           cursor: "pointer",
         }}>
      <input type="checkbox" style={{ accentColor: "var(--brand)" }}
             checked={checked} onChange={e => onCheck(e.target.checked)}
             onClick={e => e.stopPropagation()} />
      {item.img ? (
        <img src={item.img} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} />
      ) : (
        <div style={{ width: 60, height: 60, background: "var(--paper)", borderRadius: 8, display: "grid", placeItems: "center", color: "var(--mute)" }}><I.Hash size={20} /></div>
      )}
      <div style={{ minWidth: 0 }}>
        <div className="row gap-2 mb-1" style={{ alignItems: "center" }}>
          <Avatar name={item.user.name} src={item.user.avatar} size="sm" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>{item.user.name}</span>
          <span className="muted text-xs">{ago(item.time)}</span>
        </div>
        <div className="truncate text-sm" style={{ color: "var(--ink-2)" }}>{item.text}</div>
        <div className="row gap-2 mt-2" style={{ alignItems: "center" }}>
          <StatusBadge status={item.status} />
          {item.ai > 0.5 && <Badge kind="danger"><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><I.AI size={10} />{(item.ai * 100).toFixed(0)}%</span></Badge>}
          {item.stars && <span className="row gap-1" style={{ alignItems: "center" }}><I.Star size={10} style={{ color: "var(--brand-2)" }} /><span className="text-xs tnum fw-600">{item.stars}.0</span></span>}
        </div>
      </div>
    </div>
  );
}

function ContentPreview({ item }: { item: RatingFeed }) {
  return (
    <div style={{ padding: 24, overflowY: "auto" }}>
      <div className="between mb-4">
        <span className="font-mono text-xs muted">{item.id}</span>
        <StatusBadge status={item.status} />
      </div>

      <div className="row gap-3 mb-3" style={{ alignItems: "center" }}>
        <Avatar name={item.user.name} src={item.user.avatar} size="lg" />
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{item.user.name}</div>
          <div className="muted text-xs">@{item.user.username} · Level {item.user.level} · {fmt(item.user.ratings)} ratings · {ago(item.time)}</div>
        </div>
      </div>

      {item.stars && (
        <div className="row gap-3 mb-3" style={{ alignItems: "center" }}>
          <Stars value={item.stars} size={16} />
          <span className="font-display tnum" style={{ fontSize: 22, color: "var(--ink)" }}>{item.stars}.0</span>
          <span className="muted text-sm">on</span>
          <span style={{ fontWeight: 600, color: "var(--ink)" }}>{item.restaurant}{item.dish ? ` — ${item.dish}` : ""}</span>
        </div>
      )}

      {item.img && (
        <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "var(--paper)" }}>
          <img src={item.img} alt="" style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }} />
        </div>
      )}

      <div style={{ background: "var(--paper)", borderRadius: 12, padding: "16px 18px", fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>
        &ldquo;{item.text}&rdquo;
      </div>

      <div style={{ background: "white", border: "1px solid var(--line)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div className="between mb-3">
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <I.Sparkle size={14} style={{ color: "var(--brand)" }} />
            <span className="fw-600">AI moderation signals</span>
          </div>
          <Badge kind={item.ai > 0.5 ? "danger" : item.ai > 0.2 ? "warn" : "ok"}>
            {item.ai > 0.5 ? "Risky" : item.ai > 0.2 ? "Review" : "Safe"}
          </Badge>
        </div>
        <div className="col gap-2">
          {[
            { l: "Toxicity",      v: item.ai },
            { l: "Spam",          v: Math.max(0, item.ai * 0.5 + (item.text.includes("!!!") ? 0.4 : 0)) },
            { l: "Off-topic",     v: Math.max(0.05, item.ai * 0.3) },
            { l: "Authenticity",  v: 1 - item.ai * 0.8 },
            { l: "Quality score", v: item.text.length > 80 ? 0.85 : 0.4 },
          ].map(s => (
            <div key={s.l} className="row gap-3" style={{ alignItems: "center" }}>
              <span className="text-xs muted" style={{ width: 110 }}>{s.l}</span>
              <div style={{ flex: 1, height: 4, background: "var(--paper)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, s.v * 100)}%`, height: "100%",
                  background: s.v > 0.6 ? "var(--danger)" : s.v > 0.3 ? "var(--warn)" : "var(--ok)",
                  borderRadius: 999 }} />
              </div>
              <span className="text-xs tnum fw-600" style={{ width: 36, textAlign: "right" }}>{(s.v * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="row gap-2" style={{ flexWrap: "wrap" }}>
        <button className="btn btn-primary flex-1"><I.Check size={14} /> Approve</button>
        <button className="btn btn-secondary flex-1"><I.Eye size={14} /> Hide</button>
        <button className="btn btn-danger flex-1"><I.X size={14} /> Reject</button>
        <button className="btn btn-secondary"><I.Flag size={14} /> Escalate</button>
      </div>
    </div>
  );
}

export default function ContentMod() {
  const [type, setType] = useState("ratings");
  const [status, setStatus] = useState("pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bulk, setBulk] = useState<string[]>([]);

  const items = useMemo(() => {
    const base = RATINGS_FEED.map(r => ({ ...r, kind: type }));
    if (status === "all") return base;
    return base.filter(r => r.status === status);
  }, [type, status]);

  const selected = items.find(i => i.id === selectedId) || items[0];

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { pending: 0, approved: 0, hidden: 0, rejected: 0, all: RATINGS_FEED.length };
    RATINGS_FEED.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Content moderation</h1>
          <div className="sub">Review and act on user-generated content across the platform.</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Filter size={14} /> Filters</button>
          <button className="btn btn-primary"><I.Sparkle size={14} /> Run AI sweep</button>
        </div>
      </div>

      <div className="row gap-2 mb-4" style={{ flexWrap: "wrap" }}>
        {[
          { id: "ratings",  label: "Ratings",  count: 1280, i: I.Star },
          { id: "comments", label: "Comments", count: 4218, i: I.Hash },
          { id: "stories",  label: "Stories",  count: 218,  i: I.Layers },
          { id: "images",   label: "Images",   count: 980,  i: I.Image },
        ].map(t => {
          const Ic = t.i;
          return (
            <button key={t.id} onClick={() => setType(t.id)}
                    className={"chip " + (type === t.id ? "on" : "")}
                    style={{ padding: "10px 16px", fontSize: 13 }}>
              <Ic size={14} />
              {t.label}
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: 0.7 }}>{fmt(t.count)}</span>
            </button>
          );
        })}
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        <PillStat label="Pending review" v={statusCounts.pending} color="warn" set={() => setStatus("pending")} on={status === "pending"} />
        <PillStat label="Approved" v={statusCounts.approved} color="ok" set={() => setStatus("approved")} on={status === "approved"} />
        <PillStat label="Hidden" v={statusCounts.hidden} color="" set={() => setStatus("hidden")} on={status === "hidden"} />
        <PillStat label="Rejected" v={statusCounts.rejected} color="danger" set={() => setStatus("rejected")} on={status === "rejected"} />
        <PillStat label="All" v={statusCounts.all} color="brand" set={() => setStatus("all")} on={status === "all"} />
      </div>

      <div className="card" style={{ overflow: "hidden", padding: 0, display: "grid", gridTemplateColumns: "1fr 1.4fr", minHeight: 600 }}>
        <div style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" style={{ accentColor: "var(--brand)" }}
                   checked={bulk.length === items.length && items.length > 0}
                   onChange={e => setBulk(e.target.checked ? items.map(i => i.id) : [])} />
            {bulk.length > 0 ? (
              <>
                <span className="text-xs muted">{bulk.length} selected</span>
                <button className="btn sm btn-secondary" style={{ marginLeft: "auto" }}><I.Check size={12} /> Approve</button>
                <button className="btn sm btn-danger"><I.X size={12} /> Reject</button>
              </>
            ) : (
              <>
                <span className="text-xs muted">{items.length} {type}</span>
                <div style={{ flex: 1 }} />
                <Select value="newest" onChange={() => {}} options={[["newest","Newest"],["ai","AI score"],["likes","Most liked"]]} />
              </>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {items.map(item => (
              <ContentRow key={item.id} item={item}
                          selected={selected?.id === item.id}
                          checked={bulk.includes(item.id)}
                          onCheck={v => setBulk(v ? [...bulk, item.id] : bulk.filter(x => x !== item.id))}
                          onClick={() => setSelectedId(item.id)} />
            ))}
            {!items.length && (
              <div className="empty"><div className="ico"><I.Check size={20} /></div><h4>Inbox zero</h4><div className="muted text-sm mt-1">Nothing to review in this category.</div></div>
            )}
          </div>
        </div>

        {selected && <ContentPreview item={selected} />}
      </div>
    </div>
  );
}
