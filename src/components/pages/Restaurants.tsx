'use client';

import React, { useState, useMemo, useRef } from 'react';
import { I } from '../icons';
import { Badge, StatusBadge, Stars, Mini, DetailRow, Select, fmt, ago } from '../ui';
import { RESTAURANTS, DISHES, RATINGS_FEED, PHOTOS, SERIES_30D, Restaurant } from '@/lib/data';

// GrowthChart (mini version for drawer analytics tab)
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
        <linearGradient id="gradR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gradR)"/>
      <path d={path} stroke="var(--brand)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RestaurantCard({ r, onClick }: { r: Restaurant; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick}
         style={{ cursor: "pointer", overflow: "hidden", transition: "all .15s", padding: 0 }}
         onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
         onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}>
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "var(--paper)" }}>
        <img src={r.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between" }}>
          <StatusBadge status={r.status} />
          {r.featured && <Badge kind="dark" pip>Featured</Badge>}
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(255,255,255,0.95)", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
          <I.Star size={11} style={{ color: "var(--brand-2)" }} />{r.rating}
          <span className="muted" style={{ fontWeight: 400 }}>({fmt(r.ratingsCount)})</span>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div className="row gap-2 mb-2" style={{ alignItems: "baseline", justifyContent: "space-between" }}>
          <h4 style={{ fontFamily: "var(--display)", fontSize: 20, color: "var(--ink)", lineHeight: 1.1, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</h4>
          <span className="muted text-xs no-shrink">{r.price}</span>
        </div>
        <div className="muted text-xs mb-3" style={{ marginTop: 4 }}>{r.cuisine} · {r.area}</div>
        <div className="row gap-3" style={{ alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--line-soft)" }}>
          <span className="text-xs"><I.Dish size={11} style={{ verticalAlign: -2, marginRight: 4, color: "var(--mute)" }} />{r.dishes} dishes</span>
          <span className="text-xs muted">·</span>
          <span className="text-xs muted">added {r.added.slice(0, 7)}</span>
        </div>
      </div>
    </div>
  );
}

function RestaurantDrawer({ r, onClose }: { r: Restaurant | null; onClose: () => void }) {
  const lastRef = useRef<Restaurant>(RESTAURANTS[0]);
  if (r) lastRef.current = r;
  const rest = r || lastRef.current;
  const [tab, setTab] = useState("overview");

  const photos = [PHOTOS.rest1, PHOTOS.rest2, PHOTOS.rest3, PHOTOS.rest4, PHOTOS.rest5, PHOTOS.truffle];

  return (
    <>
      <div className={"drawer-scrim " + (r ? "open" : "")} onClick={onClose} />
      <div className={"drawer " + (r ? "open" : "")} style={{ width: 600 }}>
        <div className="drawer-head">
          <div className="row gap-3" style={{ alignItems: "center" }}>
            <button className="icon-btn" onClick={onClose} style={{ width: 30, height: 30 }}><I.X size={14} /></button>
            <span className="font-mono text-xs muted">{rest.id}</span>
            <StatusBadge status={rest.status} />
          </div>
          <div className="row gap-1">
            <button className="btn sm btn-secondary"><I.Edit size={12} /> Edit</button>
            <button className="btn sm btn-secondary"><I.Layers size={12} /> Merge</button>
            <button className="icon-btn" style={{ width: 30, height: 30 }}><I.DotsV size={14} /></button>
          </div>
        </div>

        <div className="drawer-body" style={{ padding: 0 }}>
          <img src={rest.img} alt="" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          <div style={{ padding: 24 }}>
            <h2 style={{ fontSize: 32, marginBottom: 6 }}>{rest.name}</h2>
            <div className="row gap-2 mb-4" style={{ alignItems: "center", color: "var(--mute)", fontSize: 13 }}>
              <span style={{ color: "var(--ink-3)" }}>{rest.cuisine}</span>
              <span>·</span>
              <span>{rest.price}</span>
              <span>·</span>
              <span>{rest.area}, {rest.city}</span>
            </div>

            <div className="grid mb-4" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              <Mini label="Rating" value={rest.rating} />
              <Mini label="Ratings" value={fmt(rest.ratingsCount)} />
              <Mini label="Dishes" value={rest.dishes} />
              <Mini label="Reports" value={0} />
            </div>

            <div className="tabs">
              {[
                ["overview",   "Overview"],
                ["images",     "Images",   12],
                ["dishes",     "Dishes",   rest.dishes],
                ["ratings",    "Ratings",  rest.ratingsCount],
                ["analytics",  "Analytics"],
              ].map(([id, label, c]) => (
                <div key={id as string} className={"tab " + (tab === id ? "on" : "")} onClick={() => setTab(id as string)}>
                  {label}{c != null && <span className="count">{fmt(c as number)}</span>}
                </div>
              ))}
            </div>

            {tab === "overview" && (
              <div className="col gap-4">
                <DetailRow label="Cuisine" value={rest.cuisine} />
                <DetailRow label="Price tier" value={rest.price} />
                <DetailRow label="Address" value={`${rest.area}, ${rest.city}`} />
                <DetailRow label="Verified" value={rest.status === "verified" ? "Yes — manually" : "Pending"} />
                <DetailRow label="Featured" value={rest.featured ? "Yes — homepage" : "No"} />
                <DetailRow label="Added" value={rest.added} />
                <DetailRow label="Hours" value="11:00 — 23:00 daily" />
                <DetailRow label="Phone" value="+1 (212) 555-0184" />
                <DetailRow label="Website" value={<a style={{ color: "var(--brand)" }}>{rest.name.toLowerCase().replace(/[^a-z]/g, "")}.com</a>} />
              </div>
            )}

            {tab === "images" && (
              <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {photos.map((src, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1/1", borderRadius: 10, overflow: "hidden", background: "var(--paper)" }}>
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    {i === 0 && <Badge kind="brand" style={{ position: "absolute", top: 6, left: 6 }}>Cover</Badge>}
                  </div>
                ))}
                <button style={{ aspectRatio: "1/1", border: "2px dashed var(--line)", borderRadius: 10, background: "var(--paper)", color: "var(--mute)", cursor: "pointer", display: "grid", placeItems: "center" }}>
                  <div style={{ textAlign: "center" }}><I.Plus size={20} /><div className="text-xs mt-1">Upload</div></div>
                </button>
              </div>
            )}

            {tab === "dishes" && (
              <div className="col gap-3">
                {DISHES.filter(d => d.restaurant === rest.name).map(d => (
                  <div key={d.id} className="row gap-3" style={{ padding: 10, background: "var(--paper)", borderRadius: 10, alignItems: "center" }}>
                    <img src={d.img} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>{d.name}</div>
                      <div className="muted text-xs">${d.price} · {fmt(d.ratings)} ratings</div>
                    </div>
                    <div className="row gap-1" style={{ alignItems: "center" }}><I.Star size={12} style={{ color: "var(--brand-2)" }} /><b className="tnum">{d.rating}</b></div>
                  </div>
                ))}
              </div>
            )}

            {tab === "ratings" && (
              <div className="col gap-3">
                {RATINGS_FEED.slice(0, 4).map(r => (
                  <div key={r.id} style={{ padding: 12, background: "var(--paper)", borderRadius: 10 }}>
                    <div className="row gap-2 mb-2" style={{ alignItems: "center" }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{r.user.name}</span>
                      <Stars value={r.stars} />
                      <span className="muted text-xs" style={{ marginLeft: "auto" }}>{ago(r.time)}</span>
                    </div>
                    <div className="text-sm truncate">{r.text}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === "analytics" && (
              <div className="col gap-4">
                <div className="card" style={{ padding: 16 }}>
                  <div className="eyebrow mb-2">Ratings · last 30 days</div>
                  <GrowthChart data={SERIES_30D.slice(0, 30).map(v => v * 0.4)} height={160} />
                </div>
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Mini label="This week" value="+24%" />
                  <Mini label="Avg session" value="3.2 min" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost"><I.History size={14} /> History</button>
          <div style={{ flex: 1 }} />
          {rest.status === "pending" && <button className="btn btn-primary"><I.Check size={14} /> Verify</button>}
          <button className="btn btn-secondary"><I.Edit size={14} /> Edit</button>
          <button className="btn btn-danger"><I.Trash size={14} /> Remove</button>
        </div>
      </div>
    </>
  );
}

function AddRestaurantModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="drawer-scrim open" onClick={onClose} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 520, maxWidth: "92vw", background: "white", borderRadius: 16, boxShadow: "var(--sh-pop)", zIndex: 200 }}>
        <div className="between" style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
          <h3>Add restaurant</h3>
          <button className="icon-btn" onClick={onClose} style={{ width: 30, height: 30 }}><I.X size={14} /></button>
        </div>
        <div style={{ padding: 22 }}>
          <div className="col gap-4">
            <div className="field"><label>Name</label><input className="input" placeholder="e.g. Osteria Marco" /></div>
            <div className="row gap-3">
              <div className="field flex-1"><label>Cuisine</label><input className="input" placeholder="Italian" /></div>
              <div className="field flex-1"><label>Price tier</label>
                <select className="input"><option>$</option><option>$$</option><option>$$$</option><option>$$$$</option></select>
              </div>
            </div>
            <div className="field"><label>Address</label><input className="input" placeholder="123 Main St, Brooklyn, NY" /></div>
            <div className="field"><label>Description</label><textarea className="textarea" placeholder="A few sentences..." /></div>
            <div className="field"><label>Cover image</label>
              <button style={{ border: "2px dashed var(--line)", background: "var(--paper)", borderRadius: 10, padding: 24, textAlign: "center", color: "var(--mute)", cursor: "pointer" }}>
                <I.Upload size={20} />
                <div className="text-sm mt-2">Drop image or click to upload</div>
              </button>
            </div>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={onClose}><I.Plus size={14} /> Create restaurant</button>
        </div>
      </div>
    </>
  );
}

export default function RestaurantsPage() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState({ status: "all", cuisine: "all" });
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    return RESTAURANTS.filter(r => {
      if (filter.status !== "all" && r.status !== filter.status) return false;
      if (filter.cuisine !== "all" && r.cuisine !== filter.cuisine) return false;
      if (q) {
        const lc = q.toLowerCase();
        return r.name.toLowerCase().includes(lc) || r.cuisine.toLowerCase().includes(lc) || r.area.toLowerCase().includes(lc);
      }
      return true;
    });
  }, [q, filter]);

  const dupes = RESTAURANTS.filter(r => r.status === "duplicate").length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Restaurants</h1>
          <div className="sub">{fmt(8412)} venues · {RESTAURANTS.filter(r => r.status === "verified").length * 1218} verified · {dupes * 47} duplicates flagged</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Layers size={14} /> Review {dupes * 47} duplicates</button>
          <button className="btn btn-secondary"><I.Download size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><I.Plus size={14} /> Add restaurant</button>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: 14 }}>
        <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <div className="input-icon" style={{ flex: "1 1 280px", maxWidth: 380 }}>
            <I.Search size={14} />
            <input className="input" placeholder="Search by name, cuisine, neighborhood…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <Select value={filter.status} onChange={v => setFilter({ ...filter, status: v })}
                  options={[["all","All status"],["verified","Verified"],["pending","Pending"],["duplicate","Duplicate"]]} />
          <Select value={filter.cuisine} onChange={v => setFilter({ ...filter, cuisine: v })}
                  options={[["all","All cuisines"],["Italian","Italian"],["Japanese","Japanese"],["American","American"],["French","French"],["Seafood","Seafood"],["Spanish","Spanish"]]} />
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 0, background: "var(--paper)", borderRadius: 8, padding: 3, border: "1px solid var(--line)" }}>
            <button onClick={() => setView("grid")} style={{ padding: "6px 12px", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", background: view === "grid" ? "white" : "transparent", color: view === "grid" ? "var(--ink)" : "var(--mute)", boxShadow: view === "grid" ? "0 1px 2px rgba(0,0,0,0.05)" : "none", fontWeight: 500 }}><I.Image size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Grid</button>
            <button onClick={() => setView("table")} style={{ padding: "6px 12px", border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", background: view === "table" ? "white" : "transparent", color: view === "table" ? "var(--ink)" : "var(--mute)", boxShadow: view === "table" ? "0 1px 2px rgba(0,0,0,0.05)" : "none", fontWeight: 500 }}><I.Menu size={12} style={{ marginRight: 4, verticalAlign: -2 }} />Table</button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(r => <RestaurantCard key={r.id} r={r} onClick={() => setSelected(r)} />)}
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>Restaurant</th><th>Cuisine</th><th>Price</th><th>Location</th>
              <th style={{ textAlign: "right" }}>Rating</th><th style={{ textAlign: "right" }}>Dishes</th>
              <th>Status</th><th>Added</th><th></th>
            </tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setSelected(r)}>
                  <td>
                    <div className="user-cell">
                      <img src={r.img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                      <div className="meta"><b>{r.name}</b><span className="font-mono text-xs">{r.id}</span></div>
                    </div>
                  </td>
                  <td>{r.cuisine}</td>
                  <td className="muted">{r.price}</td>
                  <td className="text-sm">{r.area}, {r.city}</td>
                  <td style={{ textAlign: "right" }} className="tnum">
                    <span className="row gap-1" style={{ justifyContent: "flex-end", alignItems: "center" }}>
                      <I.Star size={11} style={{ color: "var(--brand-2)" }} />
                      <span className="fw-600">{r.rating}</span>
                      <span className="muted text-xs">({fmt(r.ratingsCount)})</span>
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }} className="tnum">{r.dishes}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="muted text-sm">{r.added}</td>
                  <td><button className="btn-icon" style={{ width: 28, height: 28, border: "none", background: "transparent" }}><I.DotsV size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RestaurantDrawer r={selected} onClose={() => setSelected(null)} />
      {showAdd && <AddRestaurantModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
