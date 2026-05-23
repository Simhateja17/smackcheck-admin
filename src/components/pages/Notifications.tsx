'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Badge, StatusBadge, fmt } from '../ui';
import { NOTIFICATIONS } from '@/lib/data';

function ComposeNotification({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("Weekend challenge unlocked");
  const [body, setBody] = useState("Rate 3 dishes this weekend to earn 500 bonus XP and the Weekender badge.");
  const [audience, setAudience] = useState("All users");
  const [audienceCount, setAudienceCount] = useState(212804);
  const [when, setWhen] = useState("now");

  return (
    <>
      <div className="drawer-scrim open" onClick={onClose} />
      <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 720, maxWidth: "96vw", background: "white", borderLeft: "1px solid var(--line)", boxShadow: "var(--sh-pop)", zIndex: 200, display: "flex", flexDirection: "column" }}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">Compose</div>
            <h3 style={{ fontSize: 20, marginTop: 2 }}>New broadcast</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><I.X size={14} /></button>
        </div>

        <div className="drawer-body" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24, padding: 0 }}>
          <div style={{ padding: 24, overflowY: "auto" }}>
            <div className="col gap-5">
              <div>
                <div className="eyebrow mb-3">Content</div>
                <div className="col gap-3">
                  <div className="field"><label>Title <span className="muted text-xs">({title.length}/65)</span></label>
                    <input className="input" value={title} onChange={e => setTitle(e.target.value)} maxLength={65} /></div>
                  <div className="field"><label>Body <span className="muted text-xs">({body.length}/178)</span></label>
                    <textarea className="textarea" value={body} onChange={e => setBody(e.target.value)} maxLength={178} /></div>
                  <div className="field"><label>Deep link</label>
                    <input className="input" placeholder="smackcheck://challenges/c_01" /></div>
                </div>
              </div>

              <div>
                <div className="eyebrow mb-3">Audience</div>
                <div className="col gap-2">
                  {[
                    { l: "All users",       c: 212804 },
                    { l: "Active 7d",       c: 168402 },
                    { l: "Level 5+",        c: 92104 },
                    { l: "Inactive 14d+",   c: 32418 },
                    { l: "By city: NYC",    c: 84210 },
                    { l: "Custom segment…", c: null },
                  ].map(a => (
                    <label key={a.l} className="row gap-3" style={{ padding: "8px 10px", borderRadius: 8, background: audience === a.l ? "var(--brand-soft)" : "white", border: "1px solid " + (audience === a.l ? "var(--brand-line)" : "var(--line)"), cursor: "pointer", alignItems: "center" }}>
                      <input type="radio" checked={audience === a.l} onChange={() => { setAudience(a.l); if (a.c) setAudienceCount(a.c); }} style={{ accentColor: "var(--brand)" }} />
                      <span style={{ flex: 1, fontWeight: 500, fontSize: 13 }}>{a.l}</span>
                      {a.c != null && <span className="muted tnum text-xs">{fmt(a.c)}</span>}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="eyebrow mb-3">Delivery</div>
                <div className="row gap-2 mb-3">
                  <button onClick={() => setWhen("now")} className={"chip " + (when === "now" ? "on" : "")}><I.Send size={12} /> Send now</button>
                  <button onClick={() => setWhen("schedule")} className={"chip " + (when === "schedule" ? "on" : "")}><I.Calendar size={12} /> Schedule</button>
                  <button onClick={() => setWhen("smart")} className={"chip " + (when === "smart" ? "on" : "")}><I.Sparkle size={12} /> Smart time</button>
                </div>
                {when === "schedule" && (
                  <div className="row gap-2">
                    <input className="input" type="date" defaultValue="2026-05-15" />
                    <input className="input" type="time" defaultValue="09:00" style={{ maxWidth: 130 }} />
                  </div>
                )}
                {when === "smart" && <div className="muted text-xs">Each user receives the notification at their personal peak-engagement time within the next 24 hours.</div>}
              </div>
            </div>
          </div>

          <div style={{ padding: 24, background: "var(--paper)", borderLeft: "1px solid var(--line)", overflowY: "auto" }}>
            <div className="eyebrow mb-3">Preview</div>
            <div style={{ background: "white", borderRadius: 18, padding: 14, boxShadow: "0 4px 20px -8px rgba(0,0,0,0.15)", marginBottom: 16 }}>
              <div className="row gap-3" style={{ alignItems: "center" }}>
                <div style={{ width: 36, height: 36, background: "var(--brand)", borderRadius: 8, display: "grid", placeItems: "center", color: "white", fontFamily: "var(--display)", fontSize: 18 }}>s</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="between" style={{ alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: 12 }}>SMACKCHECK</span>
                    <span className="muted text-xs">now</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)", marginTop: 2 }}>{title || "Notification title"}</div>
                  <div className="text-sm" style={{ color: "var(--ink-2)", marginTop: 1, lineHeight: 1.35 }}>{body || "Notification body"}</div>
                </div>
              </div>
            </div>

            <div className="card mb-4" style={{ padding: 16 }}>
              <div className="eyebrow mb-3">Forecast</div>
              <div className="row gap-4">
                <div>
                  <div className="muted text-xs">Estimated reach</div>
                  <div className="font-display tnum" style={{ fontSize: 26, color: "var(--ink)" }}>{fmt(audienceCount)}</div>
                </div>
                <div>
                  <div className="muted text-xs">Expected opens</div>
                  <div className="font-display tnum" style={{ fontSize: 26, color: "var(--ink)" }}>{fmt(Math.round(audienceCount * 0.38))}</div>
                </div>
              </div>
              <div className="mt-3 muted text-xs">Based on similar campaigns sent in the last 30 days.</div>
            </div>

            <div style={{ padding: 14, background: "var(--warn-soft)", border: "1px solid #ecdcc1", borderRadius: 10, color: "var(--warn)", fontSize: 12.5 }}>
              <b>Heads up:</b> Sends over 100k users require a second admin approval.
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary"><I.Sparkle size={13} /> Send test to me</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary">Save draft</button>
          <button className="btn btn-primary"><I.Send size={14} /> {when === "now" ? "Send now" : when === "schedule" ? "Schedule" : "Schedule smart send"}</button>
        </div>
      </div>
    </>
  );
}

export default function NotificationsPage() {
  const [tab, setTab] = useState("campaigns");
  const [composing, setComposing] = useState(false);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Notifications</h1>
          <div className="sub">Push notifications, broadcasts, and engagement campaigns.</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Calendar size={14} /> Schedule</button>
          <button className="btn btn-primary" onClick={() => setComposing(true)}><I.Plus size={14} /> Compose</button>
        </div>
      </div>

      <div className="grid mb-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat"><div className="label">Sent (30d)</div><div className="val tnum">2.4M</div><div className="delta"><I.ArrowUp size={11} />+18%</div></div>
        <div className="stat"><div className="label">Open rate</div><div className="val tnum">38.2%</div><div className="delta"><I.ArrowUp size={11} />+2.1%</div></div>
        <div className="stat"><div className="label">CTR</div><div className="val tnum">12.4%</div><div className="delta"><I.ArrowUp size={11} />+0.8%</div></div>
        <div className="stat"><div className="label">Opt-outs (30d)</div><div className="val tnum">412</div><div className="delta down"><I.ArrowDown size={11} />−9%</div></div>
      </div>

      <div className="tabs">
        <div className={"tab " + (tab === "campaigns" ? "on" : "")} onClick={() => setTab("campaigns")}>Campaigns<span className="count">{NOTIFICATIONS.length}</span></div>
        <div className={"tab " + (tab === "templates" ? "on" : "")} onClick={() => setTab("templates")}>Templates<span className="count">12</span></div>
        <div className={"tab " + (tab === "individual" ? "on" : "")} onClick={() => setTab("individual")}>Send to user</div>
      </div>

      {tab === "campaigns" && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th>Notification</th><th>Audience</th><th>Status</th>
              <th style={{ textAlign: "right" }}>Reach</th><th style={{ textAlign: "right" }}>CTR</th>
              <th>Sent / Scheduled</th><th></th>
            </tr></thead>
            <tbody>
              {NOTIFICATIONS.map(n => (
                <tr key={n.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{n.title}</div>
                    <div className="muted text-xs truncate" style={{ maxWidth: 360, marginTop: 2 }}>{n.body}</div>
                  </td>
                  <td><Badge>{n.audience}</Badge></td>
                  <td><StatusBadge status={n.status} /></td>
                  <td style={{ textAlign: "right" }} className="tnum">{n.reach ? fmt(n.reach) : "—"}</td>
                  <td style={{ textAlign: "right" }} className="tnum">{n.ctr != null ? n.ctr + "%" : "—"}</td>
                  <td className="muted text-sm">{n.sentAt || n.scheduled || "—"}</td>
                  <td><button className="btn-icon" style={{ width: 28, height: 28, border: "none", background: "transparent" }}><I.DotsV size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "templates" && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { name: "Welcome series · Day 1", uses: 84210, body: "Welcome to SmackCheck! Rate your first dish for 50 XP." },
            { name: "Streak reminder",         uses: 42180, body: "Your %streak%-day streak is at risk. Rate one dish today!" },
            { name: "Badge unlocked",          uses: 38420, body: "You earned the %badge_name% badge! +%xp% XP" },
            { name: "New follower",            uses: 21048, body: "%follower_name% just started following you on SmackCheck." },
            { name: "Friend rated nearby",     uses: 18204, body: "%friend_name% just rated %dish_name% near you (%distance%)" },
            { name: "Weekly digest",           uses: 12044, body: "Your week in food: %ratings% ratings, %xp% XP, %level_progress%" },
          ].map((t, i) => (
            <div key={i} className="card" style={{ padding: 16, cursor: "pointer", transition: "all .12s" }}
                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--brand)"}
                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--line)"}>
              <div className="between mb-3">
                <h4 style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>{t.name}</h4>
                <I.Edit size={13} style={{ color: "var(--mute)" }} />
              </div>
              <div className="muted text-sm mb-3" style={{ fontFamily: "var(--mono)", fontSize: 11.5, lineHeight: 1.5, padding: 8, background: "var(--paper)", borderRadius: 6 }}>{t.body}</div>
              <div className="row gap-3 between" style={{ alignItems: "center" }}>
                <span className="muted text-xs">{fmt(t.uses)} sends</span>
                <button className="btn sm btn-secondary"><I.Send size={11} /> Use</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "individual" && (
        <div className="card" style={{ padding: 22 }}>
          <h3 className="mb-3">Send to a specific user</h3>
          <p className="muted mb-4">Direct messages bypass campaign throttling. Use sparingly.</p>
          <div className="col gap-4" style={{ maxWidth: 580 }}>
            <div className="field"><label>Recipient</label><input className="input" placeholder="@username, email, or user ID" /></div>
            <div className="field"><label>Template (optional)</label><select className="input"><option>None — write custom</option><option>Welcome series</option><option>Manual support reply</option></select></div>
            <div className="field"><label>Title</label><input className="input" placeholder="Notification title" /></div>
            <div className="field"><label>Body</label><textarea className="textarea" /></div>
            <div className="row gap-2"><button className="btn btn-primary"><I.Send size={14} /> Send now</button><button className="btn btn-secondary">Save draft</button></div>
          </div>
        </div>
      )}

      {composing && <ComposeNotification onClose={() => setComposing(false)} />}
    </div>
  );
}
