'use client';

import React, { useState, useMemo } from 'react';
import { I } from '../icons';
import { StatusBadge, Select, fmt } from '../ui';
import { DISHES, Dish } from '@/lib/data';

function DishCard({ d, onClick }: { d: Dish; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick}
         style={{ cursor: "pointer", overflow: "hidden", transition: "all .15s", padding: 0 }}
         onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
         onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}>
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
        <img src={d.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        {d.status !== "approved" && <div style={{ position: "absolute", top: 10, left: 10 }}><StatusBadge status={d.status} /></div>}
        <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.95)", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
          <I.Star size={10} style={{ color: "var(--brand-2)" }} />{d.rating}
        </div>
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 17, color: "var(--ink)", lineHeight: 1.2, marginBottom: 4 }}>{d.name}</div>
        <div className="muted text-xs truncate">{d.restaurant}</div>
        <div className="between mt-2" style={{ alignItems: "center" }}>
          <span className="text-xs fw-600" style={{ color: "var(--brand)" }}>${d.price}</span>
          <span className="muted text-xs">{fmt(d.ratings)} ratings</span>
        </div>
      </div>
    </div>
  );
}

export default function DishesPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => DISHES.filter(d =>
    !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.restaurant.toLowerCase().includes(q.toLowerCase())
  ), [q]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Dishes</h1>
          <div className="sub">{fmt(42180)} dishes across {fmt(8412)} restaurants · 23 awaiting review</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Layers size={14} /> Find duplicates</button>
          <button className="btn btn-primary"><I.Plus size={14} /> Add dish</button>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: 14 }}>
        <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <div className="input-icon" style={{ flex: "1 1 280px", maxWidth: 380 }}>
            <I.Search size={14} />
            <input className="input" placeholder="Search dishes, ingredients, restaurants…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value="all" onChange={() => {}} options={[["all","All cuisines"],["italian","Italian"],["japanese","Japanese"]]} />
          <Select value="popular" onChange={() => {}} options={[["popular","Most popular"],["recent","Recently added"],["rating","Top rated"]]} />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-head">
          <h4>Trending dishes this week</h4>
          <span className="muted text-xs">based on ratings growth</span>
        </div>
        <div style={{ padding: 16, display: "flex", gap: 12, overflowX: "auto" }} className="no-scrollbar">
          {DISHES.slice(0, 5).map((d, i) => (
            <div key={d.id} style={{ minWidth: 200, flex: "none" }}>
              <div style={{ position: "relative" }}>
                <img src={d.img} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12 }} />
                <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,0.95)", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: "var(--display)" }}>#{i + 1}</div>
              </div>
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 13.5, color: "var(--ink)" }}>{d.name}</div>
              <div className="muted text-xs">{d.restaurant}</div>
              <div className="row gap-2 mt-2" style={{ alignItems: "center" }}>
                <span className="row gap-1" style={{ alignItems: "center" }}><I.Star size={11} style={{ color: "var(--brand-2)" }} /><b className="tnum text-xs">{d.rating}</b></span>
                <span className="muted text-xs">·</span>
                <span className="text-xs" style={{ color: "var(--ok)" }}>+{(i + 1) * 94} this week</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {filtered.map(d => <DishCard key={d.id} d={d} onClick={() => {}} />)}
      </div>
    </div>
  );
}
