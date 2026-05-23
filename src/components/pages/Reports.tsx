'use client';

import React, { useState, useMemo } from 'react';
import { I } from '../icons';
import { Avatar, Badge, StatusBadge, Severity, Select, Mini, TLRow, HistRow, fmt, ago } from '../ui';
import { REPORTS, DISHES, BADGES, Report } from '@/lib/data';

// ============ Queue row ============
function ReportRow({ r, selected, onClick, checked, onCheck }: {
  r: Report; selected: boolean; onClick: () => void; checked: boolean; onCheck: (v: boolean) => void;
}) {
  return (
    <div onClick={onClick}
         style={{
           padding: "14px 16px",
           borderBottom: "1px solid var(--line-soft)",
           cursor: "pointer",
           background: selected ? "var(--brand-soft)" : "white",
           borderLeft: selected ? "3px solid var(--brand)" : "3px solid transparent",
           transition: "background .08s",
         }}>
      <div className="between mb-2">
        <div className="row gap-2" style={{ alignItems: "center" }}>
          <input type="checkbox" checked={checked} onChange={e => { e.stopPropagation(); onCheck(e.target.checked); }} onClick={e => e.stopPropagation()} style={{ accentColor: "var(--brand)" }} />
          <Severity level={r.severity} />
        </div>
        <span className="muted text-xs tnum">{ago(r.submitted)}</span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{r.targetTitle}</div>
      <div className="text-xs muted truncate" style={{ marginBottom: 8 }}>{r.targetSnippet}</div>
      <div className="row gap-2" style={{ alignItems: "center" }}>
        <Badge kind="brand" size="">{r.category}</Badge>
        <Badge>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <I.AI size={10} />{(r.aiConfidence * 100).toFixed(0)}%
          </span>
        </Badge>
        {r.similarReports > 0 && <Badge>×{r.similarReports + 1} similar</Badge>}
        <span style={{ marginLeft: "auto", color: "var(--mute)", fontSize: 11, fontFamily: "var(--mono)" }}>{r.id}</span>
      </div>
    </div>
  );
}

// ============ AI Panel ============
function AIPanel({ r, onClose }: { r: Report; onClose: () => void }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #fffaf6, #f8efe9)", border: "1px solid #e9d8cd", borderRadius: 14, padding: 18, marginBottom: 18, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: 999, background: "radial-gradient(circle, rgba(187,91,92,0.12), transparent 60%)" }} />
      <div className="between mb-3" style={{ position: "relative" }}>
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--brand)", color: "white", display: "grid", placeItems: "center" }}>
            <I.Sparkle size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              SmackCheck AI Analysis
              <Badge kind="brand" size="">v4.2.1</Badge>
            </div>
            <div className="muted text-xs">Trained on 1.4M human-labeled moderation decisions</div>
          </div>
        </div>
        <button className="icon-btn" onClick={onClose} style={{ width: 28, height: 28 }}><I.X size={13} /></button>
      </div>

      <div className="row gap-4 mb-3" style={{ flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px" }}>
          <div className="eyebrow mb-2">Label</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{r.aiLabel}</div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div className="eyebrow mb-2">Confidence</div>
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <div style={{ flex: 1, height: 6, background: "white", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${r.aiConfidence * 100}%`, height: "100%", background: r.aiConfidence > 0.8 ? "var(--danger)" : r.aiConfidence > 0.6 ? "var(--warn)" : "var(--ok)", borderRadius: 999 }} />
            </div>
            <div className="font-display tnum" style={{ fontSize: 18, color: "var(--ink)" }}>{(r.aiConfidence * 100).toFixed(0)}%</div>
          </div>
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <div className="eyebrow mb-2">Recommended</div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--brand-ink)" }}>
            {r.aiAction.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
          </div>
        </div>
      </div>

      <div style={{ background: "white", border: "1px solid #efe1d6", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>
        <b style={{ color: "var(--ink)" }}>Reasoning:</b>{" "}
        {r.category === "Hate speech" && "Contains a slur targeting ethnicity. Phrase pattern matches our high-confidence hate-speech dictionary (severity 4/4). Past 30 days: user has 2 prior warnings."}
        {r.category === "Harassment" && "Implied threat (\"camping outside\") combined with PII solicitation (\"DM me your address\"). Coordinated harassment risk: medium. Recommend hiding pending review."}
        {r.category === "Spam" && "Promotional template repeated across 4 stories in 12 hours from same account cluster. Promo code + multiple @mentions matches our coordinated-promo signature."}
        {r.category === "Misinformation" && "Impersonation claim (\"I'm the head chef\") + food-safety allegation lacking evidence. Multiple users flagged. Recommend hiding while we contact the restaurant."}
        {r.category === "Wrong info" && "Low-severity data quality issue. Hours and address may be stale. Recommend routing to the catalog team rather than moderation."}
        {r.category === "NSFW image" && "Vision model detected content unrelated to food. Off-topic content policy applies. Recommend automatic removal with warning."}
        {r.category === "Fake review" && "Account posted 14 5-star ratings within 9 minutes across geographically distant venues. Behavioral signature matches known fake-review ring."}
      </div>

      <div className="row gap-2 mt-3">
        <button className="btn sm btn-primary"><I.Check size={12} /> Accept recommendation</button>
        <button className="btn sm btn-secondary"><I.Eye size={12} /> See signals</button>
        <button className="btn sm btn-ghost"><I.ArrowDown size={12} /> Flag as wrong</button>
      </div>
    </div>
  );
}

// ============ Report detail (center) ============
function ReportDetail({ r, aiOpen, setAiOpen }: { r: Report; aiOpen: boolean; setAiOpen: (v: boolean) => void }) {
  const [notes, setNotes] = useState(r.resolvedAction || "");

  return (
    <div style={{ padding: "24px 32px 40px" }}>
      <div className="between mb-4">
        <div className="row gap-3" style={{ alignItems: "center" }}>
          <span className="font-mono text-xs muted">{r.id}</span>
          <span style={{ color: "var(--mute-2)" }}>·</span>
          <StatusBadge status={r.status} />
          <Severity level={r.severity} />
        </div>
        <div className="row gap-2">
          <button className="btn sm btn-secondary"><I.ArrowUp size={12} /> Escalate</button>
          <button className="btn sm btn-secondary"><I.External size={12} /> Open in app</button>
          <button className="btn sm btn-ghost" style={{ width: 28, padding: 0 }}><I.DotsV size={14} /></button>
        </div>
      </div>

      <h1 style={{ fontSize: 32, marginBottom: 6 }}>{r.targetTitle}</h1>
      <div className="row gap-3 mb-6" style={{ alignItems: "center", color: "var(--mute)", fontSize: 13 }}>
        <span><b style={{ color: "var(--ink-3)", fontWeight: 500 }}>{r.category}</b></span>
        <span>·</span>
        <span>Reported {ago(r.submitted)}</span>
        {r.reporter && <><span>·</span><span>by @{r.reporter.username}</span></>}
        {r.similarReports > 0 && <><span>·</span><span>{r.similarReports + 1} similar reports</span></>}
      </div>

      {aiOpen && <AIPanel r={r} onClose={() => setAiOpen(false)} />}

      <div className="card mb-4" style={{ overflow: "hidden" }}>
        <div className="card-head">
          <div className="row gap-2" style={{ alignItems: "center" }}>
            <I.Eye size={14} style={{ color: "var(--mute)" }} />
            <h4>Reported content</h4>
            <Badge>{r.targetType}</Badge>
          </div>
          <div className="row gap-2">
            <button className="btn sm btn-ghost"><I.External size={12} /> Original</button>
          </div>
        </div>
        <div style={{ padding: 20 }}>
          {r.targetType === "image" || r.targetMedia ? (
            <div style={{ display: "grid", gridTemplateColumns: r.targetMedia && r.targetSnippet ? "200px 1fr" : "1fr", gap: 16, alignItems: "start" }}>
              {r.targetMedia && (
                <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "var(--paper)" }}>
                  <img src={r.targetMedia} alt="" style={{ width: "100%", display: "block", aspectRatio: "1 / 1", objectFit: "cover", filter: r.severity === "critical" || r.severity === "high" ? "blur(8px)" : "none" }} />
                  {(r.severity === "critical" || r.severity === "high") && (
                    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: "white", background: "rgba(40,20,20,0.5)" }}>
                      <div style={{ textAlign: "center" }}>
                        <I.Eye size={20} />
                        <div style={{ fontSize: 11, marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Click to reveal</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {r.targetSnippet && (
                <blockquote style={{ margin: 0, padding: "14px 18px", borderLeft: "3px solid var(--brand-2)", background: "var(--paper)", borderRadius: "0 10px 10px 0", color: "var(--ink-2)", fontSize: 14.5, lineHeight: 1.55, fontStyle: "italic" }}>
                  &ldquo;{r.targetSnippet}&rdquo;
                </blockquote>
              )}
            </div>
          ) : (
            <blockquote style={{ margin: 0, padding: "16px 20px", borderLeft: "3px solid var(--brand-2)", background: "var(--paper)", borderRadius: "0 10px 10px 0", color: "var(--ink-2)", fontSize: 15, lineHeight: 1.55, fontStyle: "italic" }}>
              &ldquo;{r.targetSnippet}&rdquo;
            </blockquote>
          )}

          {(r.restaurant || r.dish) && (
            <div className="row gap-4 mt-4" style={{ paddingTop: 14, borderTop: "1px solid var(--line-soft)", color: "var(--ink-3)", fontSize: 12.5 }}>
              {r.restaurant && <div className="row gap-2" style={{ alignItems: "center" }}><I.Store size={13} /><span>{r.restaurant}</span></div>}
              {r.dish && <div className="row gap-2" style={{ alignItems: "center" }}><I.Dish size={13} /><span>{r.dish}</span></div>}
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-head"><h4>Reporter&apos;s reason</h4></div>
        <div style={{ padding: 20 }}>
          <div className="row gap-3 mb-3" style={{ alignItems: "center" }}>
            {r.reporter ? (
              <>
                <Avatar name={r.reporter.name} src={r.reporter.avatar} size="md" />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>{r.reporter.name}</div>
                  <div className="muted text-xs">@{r.reporter.username} · Lv {r.reporter.level} · {r.reporter.ratings} ratings</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 36, height: 36, borderRadius: 999, background: "var(--brand-soft)", display: "grid", placeItems: "center", color: "var(--brand)" }}><I.AI size={18} /></div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 13.5 }}>Auto-flagged by AI</div>
                  <div className="muted text-xs">No human reporter · vision + LLM moderation</div>
                </div>
              </>
            )}
          </div>
          <div style={{ color: "var(--ink-2)", fontSize: 14 }}>{r.reasonText}</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 16 }}>
        <div className="card">
          <div className="card-head"><h4>Moderator notes</h4></div>
          <div style={{ padding: 20 }}>
            <textarea className="textarea" placeholder="Add a note for the moderation log…"
                      value={notes} onChange={e => setNotes(e.target.value)} />
            <div className="row gap-2 mt-3">
              <button className="btn sm btn-secondary">Save note</button>
              <button className="btn sm btn-ghost">Add template</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h4>Moderation timeline</h4></div>
          <div style={{ padding: "8px 20px 16px" }}>
            <div className="timeline">
              <TLRow dot="danger" icon={<I.Flag size={12} />} body={<><b>Report filed</b><div className="desc">{r.reporter ? `by @${r.reporter.username}` : "auto-flagged by AI"}</div></>} time={ago(r.submitted)} />
              <TLRow dot="warn" icon={<I.AI size={12} />} body={<><b>AI analysis complete</b><div className="desc">{(r.aiConfidence * 100).toFixed(0)}% confidence — {r.aiLabel}</div></>} time={ago(r.submitted - 2)} />
              {r.similarReports > 0 && <TLRow dot="" icon={<I.Layers size={12} />} body={<><b>{r.similarReports} similar reports linked</b><div className="desc">Auto-grouped by pattern</div></>} time={ago(r.submitted - 5)} />}
              {r.status === "resolved" && <TLRow dot="ok" icon={<I.Check size={12} />} body={<><b>Resolved</b><div className="desc">{r.resolvedAction} — by {r.resolvedBy}</div></>} time={ago(r.resolvedAt!)} />}
              {r.status === "dismissed" && <TLRow dot="" icon={<I.X size={12} />} body={<><b>Dismissed</b><div className="desc">{r.resolvedAction} — by {r.resolvedBy}</div></>} time={ago(r.resolvedAt!)} />}
            </div>
          </div>
        </div>
      </div>

      {r.status !== "resolved" && r.status !== "dismissed" && (
        <div style={{ position: "sticky", bottom: 0, background: "white", border: "1px solid var(--line)", borderRadius: 14, padding: 16, boxShadow: "var(--sh-3)" }}>
          <div className="between mb-3">
            <div>
              <div className="eyebrow">Take action</div>
              <div className="muted text-xs mt-1">All actions are logged. The user will be notified per their preferences.</div>
            </div>
            <div className="row gap-2">
              <button className="btn sm btn-ghost"><I.Refresh size={12} /> Mark as reviewing</button>
            </div>
          </div>
          <div className="row gap-2" style={{ flexWrap: "wrap" }}>
            <button className="btn btn-danger-solid"><I.X size={14} /> Remove content</button>
            <button className="btn btn-secondary"><I.Eye size={14} /> Hide content</button>
            <button className="btn btn-secondary"><I.Shield size={14} /> Warn user</button>
            <button className="btn btn-secondary"><I.Clock size={14} /> Suspend 7 days</button>
            <button className="btn btn-secondary" style={{ color: "var(--danger)", borderColor: "#ecc9c7" }}><I.Lock size={14} /> Ban user</button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-secondary"><I.Check size={14} /> Approve / Dismiss</button>
            <button className="btn btn-primary"><I.ArrowRight size={14} /> Apply &amp; next</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Right context pane ============
function ReportContext({ r }: { r: Report }) {
  const u = r.reportedUser;
  return (
    <div>
      <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid var(--line)" }}>
        <div className="eyebrow mb-2">Reported user</div>
        {u ? (
          <>
            <div className="row gap-3" style={{ alignItems: "center", marginBottom: 12 }}>
              <Avatar name={u.name} src={u.avatar} size="lg" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: 15 }}>{u.name}</div>
                <div className="muted text-xs">@{u.username}</div>
                <div className="row gap-2 mt-2">
                  <StatusBadge status={u.status} />
                  {u.verified && <Badge kind="info" pip>Verified</Badge>}
                </div>
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <Mini label="Level" value={u.level} />
              <Mini label="XP" value={fmt(u.xp)} />
              <Mini label="Ratings" value={fmt(u.ratings)} />
              <Mini label="Badges" value={u.badges} />
              <Mini label="Reports" value={u.reports} danger={u.reports > 3} />
              <Mini label="Joined" value={u.joined.slice(0, 7)} />
            </div>
          </>
        ) : (
          <div className="empty" style={{ padding: 20 }}>
            <div className="muted text-sm">No specific user attached to this report.</div>
          </div>
        )}
      </div>

      {u && (
        <>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <div className="between mb-3">
              <div className="eyebrow">Recent ratings</div>
              <span className="muted text-xs">last 30 days</span>
            </div>
            <div className="col gap-3">
              {DISHES.slice(0, 3).map(d => (
                <div key={d.id} className="row gap-3" style={{ alignItems: "center" }}>
                  <img src={d.img} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 12.5, color: "var(--ink)" }} className="truncate">{d.name}</div>
                    <div className="muted text-xs">{d.restaurant}</div>
                  </div>
                  <div className="row gap-1" style={{ alignItems: "center" }}>
                    <I.Star size={10} style={{ color: "var(--brand-2)" }} />
                    <span className="tnum text-xs fw-600">{d.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <div className="eyebrow mb-3">Moderation history</div>
            <div className="col gap-2">
              <HistRow time="2 weeks ago" action="Warned" reason="Rude comment on rating" />
              <HistRow time="2 months ago" action="Removed content" reason="Spam-promo story" />
              <HistRow time="3 months ago" action="Warned" reason="Off-topic ratings" />
            </div>
          </div>

          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <div className="eyebrow mb-3">Top badges</div>
            <div className="row gap-2" style={{ flexWrap: "wrap" }}>
              {BADGES.slice(0, 4).map(b => (
                <div key={b.id} title={b.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 10px", background: "var(--paper)", borderRadius: 10, border: "1px solid var(--line)", width: 64 }}>
                  <div style={{ fontSize: 20 }}>{b.emoji}</div>
                  <div className="text-xs truncate" style={{ width: "100%", textAlign: "center", color: "var(--ink-3)", fontWeight: 500 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div className="eyebrow mb-3">Quick actions</div>
            <div className="col gap-2">
              <button className="btn btn-secondary w-full" style={{ justifyContent: "flex-start" }}><I.Mail size={14} /> Send message</button>
              <button className="btn btn-secondary w-full" style={{ justifyContent: "flex-start" }}><I.History size={14} /> View full profile</button>
              <button className="btn btn-secondary w-full" style={{ justifyContent: "flex-start", color: "var(--danger)" }}><I.Lock size={14} /> Suspend account</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============ Reports page ============
export default function Reports() {
  const [filter, setFilter] = useState({
    status: "open",
    severity: "all",
    category: "all",
    type: "all",
    q: "",
    sort: "severity",
  });
  const [selectedId, setSelectedId] = useState(REPORTS[0].id);
  const [bulk, setBulk] = useState<string[]>([]);
  const [showAIPanel, setShowAIPanel] = useState(true);

  const filtered = useMemo(() => {
    let list = REPORTS.filter(r => {
      if (filter.status !== "all" && r.status !== filter.status) return false;
      if (filter.severity !== "all" && r.severity !== filter.severity) return false;
      if (filter.category !== "all" && r.category !== filter.category) return false;
      if (filter.type !== "all" && r.targetType !== filter.type) return false;
      if (filter.q) {
        const lc = filter.q.toLowerCase();
        if (!(r.targetTitle.toLowerCase().includes(lc) || r.targetSnippet.toLowerCase().includes(lc) || r.id.toLowerCase().includes(lc))) return false;
      }
      return true;
    });
    if (filter.sort === "severity") {
      const order: Record<string, number> = { critical: 0, high: 1, med: 2, low: 3 };
      list = [...list].sort((a, b) => order[a.severity] - order[b.severity]);
    } else if (filter.sort === "newest") {
      list = [...list].sort((a, b) => a.submitted - b.submitted);
    } else if (filter.sort === "ai") {
      list = [...list].sort((a, b) => b.aiConfidence - a.aiConfidence);
    }
    return list;
  }, [filter]);

  const selected = REPORTS.find(r => r.id === selectedId) || filtered[0];

  const counts = useMemo(() => {
    return REPORTS.reduce((acc: Record<string, number>, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, { open: 0, reviewing: 0, resolved: 0, dismissed: 0 });
  }, []);

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "grid", gridTemplateColumns: "380px 1fr 340px", overflow: "hidden" }}>
      {/* LEFT: queue list */}
      <div style={{ borderRight: "1px solid var(--line)", background: "white", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "18px 18px 12px", borderBottom: "1px solid var(--line)" }}>
          <div className="between mb-3">
            <h2 style={{ fontSize: 22 }}>Moderation Queue</h2>
            <button className="icon-btn" title="Refresh"><I.Refresh size={15} /></button>
          </div>
          <div className="input-icon">
            <I.Search size={14} />
            <input className="input sm" placeholder="Search reports, IDs, content…"
                   value={filter.q} onChange={e => setFilter({ ...filter, q: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid var(--line)", background: "var(--card-2)" }}>
          {[
            { id: "open",      label: "Open",      c: counts.open || 0 },
            { id: "reviewing", label: "Reviewing", c: counts.reviewing || 0 },
            { id: "resolved",  label: "Resolved",  c: counts.resolved || 0 },
            { id: "dismissed", label: "Dismissed", c: counts.dismissed || 0 },
          ].map(t => (
            <div key={t.id} onClick={() => setFilter({ ...filter, status: t.id })}
                 style={{
                   flex: 1, padding: "10px 8px", textAlign: "center", cursor: "pointer",
                   fontSize: 12, fontWeight: 500,
                   color: filter.status === t.id ? "var(--brand-ink)" : "var(--mute)",
                   background: filter.status === t.id ? "white" : "transparent",
                   borderBottom: filter.status === t.id ? "2px solid var(--brand)" : "2px solid transparent",
                   marginBottom: -1,
                 }}>
              {t.label}{" "}
              <span style={{
                marginLeft: 4, fontSize: 11,
                background: filter.status === t.id ? "var(--brand-soft)" : "var(--paper)",
                padding: "1px 6px", borderRadius: 999,
                color: filter.status === t.id ? "var(--brand-ink)" : "var(--ink-3)",
                fontWeight: 600,
              }}>{t.c}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, padding: "10px 14px", borderBottom: "1px solid var(--line)", overflowX: "auto" }} className="no-scrollbar">
          <Select value={filter.severity} onChange={v => setFilter({ ...filter, severity: v })}
                  options={[["all","All severity"],["critical","Critical"],["high","High"],["med","Medium"],["low","Low"]]} />
          <Select value={filter.category} onChange={v => setFilter({ ...filter, category: v })}
                  options={[["all","All categories"],["Hate speech","Hate speech"],["Harassment","Harassment"],["Spam","Spam"],["Misinformation","Misinformation"],["NSFW image","NSFW"],["Fake review","Fake review"],["Wrong info","Wrong info"]]} />
          <Select value={filter.type} onChange={v => setFilter({ ...filter, type: v })}
                  options={[["all","All types"],["comment","Comments"],["rating","Ratings"],["story","Stories"],["image","Images"],["restaurant","Restaurants"],["dish","Dishes"]]} />
        </div>

        {bulk.length > 0 && (
          <div style={{ padding: "10px 14px", background: "var(--brand-soft)", borderBottom: "1px solid var(--brand-line)", display: "flex", alignItems: "center", gap: 8 }}>
            <Badge kind="brand">{bulk.length} selected</Badge>
            <button className="btn sm btn-secondary" onClick={() => alert("Approved " + bulk.length + " reports")}><I.Check size={12} /> Approve all</button>
            <button className="btn sm btn-danger" onClick={() => alert("Removed content from " + bulk.length + " reports")}><I.X size={12} /> Remove</button>
            <button className="btn sm btn-ghost" onClick={() => setBulk([])} style={{ marginLeft: "auto" }}>Clear</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map(r => (
            <ReportRow key={r.id} r={r} selected={r.id === selectedId}
                       onClick={() => setSelectedId(r.id)}
                       checked={bulk.includes(r.id)}
                       onCheck={v => setBulk(v ? [...bulk, r.id] : bulk.filter(x => x !== r.id))} />
          ))}
          {!filtered.length && (
            <div className="empty">
              <div className="ico"><I.Inbox size={20} /></div>
              <h4>Nothing in the queue</h4>
              <div className="muted text-sm mt-1">All reports matching these filters have been handled.</div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: report detail */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0, overflow: "auto", background: "var(--paper)" }}>
        {selected ? <ReportDetail r={selected} aiOpen={showAIPanel} setAiOpen={setShowAIPanel} /> : (
          <div className="empty"><div className="ico"><I.Flag size={20} /></div><h4>No report selected</h4></div>
        )}
      </div>

      {/* RIGHT: context */}
      <div style={{ borderLeft: "1px solid var(--line)", background: "white", overflowY: "auto" }}>
        {selected && <ReportContext r={selected} />}
      </div>
    </div>
  );
}
