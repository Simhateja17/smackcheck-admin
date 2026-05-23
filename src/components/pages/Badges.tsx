'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Badge, fmt } from '../ui';
import { BADGES } from '@/lib/data';

function BadgeEditor({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("Truffle Hunter");
  const [emoji, setEmoji] = useState("🍄");
  const [desc, setDesc] = useState("Rate 25 dishes containing truffle");
  const [xp, setXp] = useState(500);
  const [rarity, setRarity] = useState("Rare");

  return (
    <>
      <div className="drawer-scrim open" onClick={onClose} />
      <div className="drawer open" style={{ width: 680 }}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">New badge</div>
            <h3 style={{ fontSize: 20, marginTop: 2 }}>Design</h3>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width: 30, height: 30 }}><I.X size={14} /></button>
        </div>
        <div className="drawer-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: 0 }}>
          <div style={{ padding: 24, overflowY: "auto" }}>
            <div className="col gap-4">
              <div className="row gap-3" style={{ alignItems: "flex-end" }}>
                <div className="field flex-1"><label>Name</label><input className="input" value={name} onChange={e => setName(e.target.value)} /></div>
                <div className="field" style={{ width: 88 }}><label>Icon</label>
                  <input className="input" value={emoji} onChange={e => setEmoji(e.target.value)} style={{ textAlign: "center", fontSize: 22, padding: 0, height: 38 }} />
                </div>
              </div>
              <div className="field"><label>Description</label><textarea className="textarea" value={desc} onChange={e => setDesc(e.target.value)} /></div>
              <div className="row gap-3">
                <div className="field flex-1"><label>XP reward</label><input className="input" type="number" value={xp} onChange={e => setXp(+e.target.value)} /></div>
                <div className="field flex-1"><label>Rarity</label>
                  <select className="input" value={rarity} onChange={e => setRarity(e.target.value)}>
                    <option>Common</option><option>Uncommon</option><option>Rare</option><option>Epic</option><option>Legendary</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="eyebrow mb-3">Earn criteria</div>
                <div className="col gap-3">
                  <div className="card" style={{ padding: 14 }}>
                    <div className="row gap-2 mb-3" style={{ alignItems: "center" }}>
                      <select className="input sm" style={{ width: 140 }}><option>Count of</option><option>Sum of</option></select>
                      <select className="input sm" style={{ width: 160 }}><option>Ratings</option><option>Photos</option><option>Comments</option></select>
                      <select className="input sm" style={{ width: 100 }}><option>≥</option><option>=</option></select>
                      <input className="input sm" defaultValue={25} style={{ width: 80 }} />
                    </div>
                    <div className="row gap-2" style={{ alignItems: "center" }}>
                      <span className="muted text-xs">where</span>
                      <select className="input sm" style={{ width: 140 }}><option>tag</option><option>cuisine</option><option>price tier</option></select>
                      <select className="input sm" style={{ width: 100 }}><option>=</option><option>contains</option></select>
                      <input className="input sm" defaultValue="truffle" style={{ flex: 1 }} />
                    </div>
                  </div>
                  <button className="btn sm btn-secondary"><I.Plus size={12} /> Add condition</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 24, background: "var(--paper)", borderLeft: "1px solid var(--line)" }}>
            <div className="eyebrow mb-3">Preview</div>
            <div className="card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ width: 110, height: 110, margin: "8px auto 16px", borderRadius: 999, background: "radial-gradient(circle, var(--brand-soft) 0%, white 70%)", border: "2px solid var(--brand-line)", display: "grid", placeItems: "center", fontSize: 54, boxShadow: "0 8px 30px -8px rgba(100,34,35,0.25)" }}>{emoji}</div>
              <h3 style={{ fontFamily: "var(--display)", fontSize: 26, color: "var(--ink)", marginBottom: 6 }}>{name}</h3>
              <div className="muted text-sm mb-3">{desc}</div>
              <div className="row gap-2" style={{ justifyContent: "center" }}>
                <Badge kind="brand">+{xp} XP</Badge>
                <Badge>{rarity}</Badge>
              </div>
            </div>
            <div className="mt-4">
              <div className="eyebrow mb-3">Estimated eligible users</div>
              <div className="font-display tnum" style={{ fontSize: 32, color: "var(--ink)" }}>1,240</div>
              <div className="muted text-xs">Based on current criteria · 0.58% of active users</div>
            </div>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary">Save draft</button>
          <button className="btn btn-primary"><I.Plus size={14} /> Publish badge</button>
        </div>
      </div>
    </>
  );
}

export default function BadgesPage() {
  const [creating, setCreating] = useState(false);
  const rarityColor: Record<string, string> = { Common: "", Uncommon: "info", Rare: "brand", Epic: "warn", Legendary: "danger" };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Badges</h1>
          <div className="sub">{BADGES.length} active badges · {fmt(BADGES.reduce((s, b) => s + b.earned, 0))} earned across the community</div>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}><I.Plus size={14} /> New badge</button>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat"><div className="label">Total earned</div><div className="val tnum">{fmt(BADGES.reduce((s, b) => s + b.earned, 0))}</div><div className="delta"><I.ArrowUp size={11} />+12%</div></div>
        <div className="stat"><div className="label">Most earned</div><div className="val font-display" style={{ fontSize: 22 }}>First Bite</div><div className="muted text-xs">{fmt(84210)} users</div></div>
        <div className="stat"><div className="label">Rarest badge</div><div className="val font-display" style={{ fontSize: 22 }}>Streak Master</div><div className="muted text-xs">only 124 holders</div></div>
        <div className="stat"><div className="label">XP awarded</div><div className="val tnum">{fmt(2.4e6)}</div><div className="delta"><I.ArrowUp size={11} />+18%</div></div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {BADGES.map(b => (
          <div key={b.id} className="card"
               style={{ padding: 18, cursor: "pointer", textAlign: "center", transition: "all .15s", position: "relative", overflow: "hidden" }}
               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--sh-3)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}>
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <Badge kind={rarityColor[b.rarity]}>{b.rarity}</Badge>
            </div>
            <div style={{ width: 80, height: 80, margin: "8px auto 14px", borderRadius: 999, background: "radial-gradient(circle, var(--brand-soft) 0%, white 70%)", border: "2px solid var(--brand-line)", display: "grid", placeItems: "center", fontSize: 40, boxShadow: "0 8px 20px -8px rgba(100,34,35,0.2)" }}>{b.emoji}</div>
            <h4 style={{ fontFamily: "var(--display)", fontSize: 19, color: "var(--ink)", marginBottom: 4 }}>{b.name}</h4>
            <div className="muted text-xs mb-3" style={{ lineHeight: 1.4, minHeight: 32 }}>{b.desc}</div>
            <div style={{ padding: "10px 0 0", borderTop: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
              <div>
                <div className="font-display tnum" style={{ fontSize: 18, color: "var(--ink)" }}>{fmt(b.earned)}</div>
                <div className="muted text-xs">earned</div>
              </div>
              <div style={{ width: 1, background: "var(--line)", alignSelf: "stretch" }} />
              <div>
                <div className="font-display tnum" style={{ fontSize: 18, color: "var(--brand)" }}>+{b.xp}</div>
                <div className="muted text-xs">XP</div>
              </div>
            </div>
          </div>
        ))}
        <div onClick={() => setCreating(true)}
             style={{ border: "2px dashed var(--line)", borderRadius: 14, padding: 18, cursor: "pointer", textAlign: "center", display: "grid", placeItems: "center", color: "var(--mute)", minHeight: 240, transition: "all .12s" }}
             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLElement).style.color = "var(--mute)"; }}>
          <div><I.Plus size={28} /><div className="mt-2 fw-600">New badge</div></div>
        </div>
      </div>

      {creating && <BadgeEditor onClose={() => setCreating(false)} />}
    </div>
  );
}
