'use client';

import React, { useState } from 'react';
import { I } from '../icons';
import { Avatar, Badge, StatusBadge } from '../ui';
import { AVATAR_URL } from '@/lib/data';

const FLAGS = [
  { id: "stories",          label: "Stories feature",          desc: "Allow users to post ephemeral food stories. Rolling out at 60%.",                on: true,  rollout: 60 },
  { id: "ai_summaries",     label: "AI rating summaries",      desc: "Auto-summarize the top reviews of a dish under its photo.",                       on: true,  rollout: 100 },
  { id: "map_clusters",     label: "Map cluster v2",           desc: "New clustering algorithm. Currently A/B testing.",                                 on: false, rollout: 20 },
  { id: "voice_review",     label: "Voice reviews",            desc: "Let users record short audio reviews. Beta — staff only.",                        on: false, rollout: 1 },
  { id: "live_kitchens",    label: "Live kitchen broadcasts",  desc: "Restaurants can stream short cooking videos. Disabled.",                          on: false, rollout: 0 },
  { id: "dish_recognition", label: "Dish recognition v3",      desc: "Improved AI dish detection from photos.",                                          on: true,  rollout: 100 },
];

function SettingRow({ label, desc, on: initialOn }: { label: string; desc: string; on?: boolean }) {
  const [on, setOn] = useState(!!initialOn);
  return (
    <div className="between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-soft)" }}>
      <div style={{ flex: 1, paddingRight: 20 }}>
        <b style={{ color: "var(--ink)" }}>{label}</b>
        <div className="muted text-xs mt-1">{desc}</div>
      </div>
      <div className={"toggle " + (on ? "on" : "")} onClick={() => setOn(!on)} />
    </div>
  );
}

function FlagsSection() {
  const [flags, setFlags] = useState(FLAGS);
  return (
    <div className="card">
      <div className="card-head"><h4>Feature flags</h4><Badge kind="brand">{flags.filter(f => f.on).length}/{flags.length} enabled</Badge></div>
      <div>
        {flags.map((f, i) => (
          <div key={f.id} className="between" style={{ padding: 18, borderTop: i === 0 ? "none" : "1px solid var(--line-soft)" }}>
            <div style={{ flex: 1 }}>
              <div className="row gap-2 mb-1" style={{ alignItems: "center" }}>
                <b style={{ color: "var(--ink)" }}>{f.label}</b>
                <span className="font-mono text-xs muted">flag.{f.id}</span>
              </div>
              <div className="muted text-sm">{f.desc}</div>
              {f.on && (
                <div className="row gap-3 mt-3" style={{ alignItems: "center", maxWidth: 320 }}>
                  <span className="text-xs muted">Rollout</span>
                  <div style={{ flex: 1, height: 5, background: "var(--paper)", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${f.rollout}%`, height: "100%", background: "var(--brand)", borderRadius: 999 }} />
                  </div>
                  <span className="text-xs tnum fw-600">{f.rollout}%</span>
                </div>
              )}
            </div>
            <div className={"toggle " + (f.on ? "on" : "")} onClick={() => setFlags(flags.map(x => x.id === f.id ? { ...x, on: !x.on } : x))} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AISection() {
  const [thresh, setThresh] = useState({ toxic: 0.7, spam: 0.6, nsfw: 0.5, fake: 0.75 });
  return (
    <>
      <div className="card">
        <div className="card-head"><h4>AI moderation thresholds</h4><Badge kind="ok" pip>Model v4.2.1 healthy</Badge></div>
        <div style={{ padding: 22 }}>
          <p className="muted mb-4">Content scoring above these thresholds is auto-actioned. Lower values are stricter.</p>
          {[
            { id: "toxic", label: "Toxicity / Hate speech",     action: "Auto-remove + warn" },
            { id: "spam",  label: "Spam / Promo",               action: "Hide pending review" },
            { id: "nsfw",  label: "NSFW imagery",               action: "Auto-remove" },
            { id: "fake",  label: "Fake / Coordinated review",  action: "Hide pending review" },
          ].map(t => (
            <div key={t.id} style={{ padding: "14px 0", borderTop: "1px solid var(--line-soft)" }}>
              <div className="between mb-2">
                <div>
                  <b style={{ color: "var(--ink)" }}>{t.label}</b>
                  <div className="muted text-xs">{t.action} above threshold</div>
                </div>
                <div className="font-display tnum" style={{ fontSize: 22, color: "var(--brand)" }}>{thresh[t.id as keyof typeof thresh].toFixed(2)}</div>
              </div>
              <input type="range" min="0" max="1" step="0.01" value={thresh[t.id as keyof typeof thresh]}
                     onChange={e => setThresh({ ...thresh, [t.id]: +e.target.value })}
                     style={{ width: "100%", accentColor: "var(--brand)" }} />
              <div className="between mt-1"><span className="muted text-xs">Strict (0)</span><span className="muted text-xs">Lenient (1)</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-head"><h4>Model behavior</h4></div>
        <div style={{ padding: 22 }}>
          <SettingRow label="Auto-action high-confidence flags" desc="Skip human review when AI confidence is above 0.95." on />
          <SettingRow label="Shadow-test new model versions" desc="Run new model alongside production for 14 days before promoting." on />
          <SettingRow label="Use vision model on all images" desc="Higher cost but better NSFW + off-topic detection." on />
          <SettingRow label="Explain decisions in the queue" desc="Surface AI reasoning + key signals to moderators." on />
        </div>
      </div>
    </>
  );
}

function LimitsSection() {
  return (
    <div className="card">
      <div className="card-head"><h4>Rate limits</h4></div>
      <div style={{ padding: 22 }}>
        {[
          { l: "Ratings per user / day",   v: 25,  unit: "ratings" },
          { l: "Comments per user / hour", v: 60,  unit: "comments" },
          { l: "Reports per user / day",   v: 20,  unit: "reports" },
          { l: "Image uploads / hour",     v: 30,  unit: "images" },
          { l: "Follows per day",          v: 100, unit: "follows" },
          { l: "API requests / minute",    v: 600, unit: "requests" },
        ].map((r, i) => (
          <div key={i} className="between" style={{ padding: "14px 0", borderTop: i === 0 ? "none" : "1px solid var(--line-soft)" }}>
            <div><b style={{ color: "var(--ink)" }}>{r.l}</b></div>
            <div className="row gap-2" style={{ alignItems: "center" }}>
              <input className="input sm" defaultValue={r.v} style={{ width: 80, textAlign: "right" }} />
              <span className="muted text-sm">{r.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplatesSection() {
  return (
    <div className="card">
      <div className="card-head"><h4>Notification templates</h4></div>
      <div style={{ padding: 22 }}>
        <p className="muted mb-3">Centrally edit copy for system notifications. Changes are versioned.</p>
        {["Welcome series · Day 1", "Streak reminder", "Badge unlocked", "Report resolved", "Account suspended"].map(t => (
          <div key={t} className="between" style={{ padding: "12px 0", borderTop: "1px solid var(--line-soft)" }}>
            <div><b style={{ color: "var(--ink)", fontSize: 13.5 }}>{t}</b><div className="muted text-xs">Last edited 2 weeks ago</div></div>
            <button className="btn sm btn-secondary"><I.Edit size={12} /> Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamSection() {
  const team = [
    { name: "Alex Chen",     role: "Owner",            email: "alex@smackcheck.com",  status: "active",  twofa: true,  last: 5 },
    { name: "Marcus Q.",     role: "Senior moderator", email: "marcus@smackcheck.com", status: "active", twofa: true,  last: 18 },
    { name: "Sara Kwon",     role: "Moderator",        email: "sara@smackcheck.com",  status: "active",  twofa: true,  last: 60 },
    { name: "Daria Volk",    role: "Catalog admin",    email: "daria@smackcheck.com", status: "active",  twofa: false, last: 240 },
    { name: "Liu Wei",       role: "Engineer",         email: "wei@smackcheck.com",   status: "active",  twofa: true,  last: 480 },
    { name: "Pending invite",role: "Moderator",        email: "ari@smackcheck.com",   status: "pending", twofa: false, last: null },
  ];
  return (
    <div className="card">
      <div className="card-head">
        <h4>Admin team</h4>
        <button className="btn sm btn-primary"><I.Plus size={12} /> Invite admin</button>
      </div>
      <table className="tbl">
        <thead><tr><th>Member</th><th>Role</th><th>Status</th><th>2FA</th><th>Last seen</th><th></th></tr></thead>
        <tbody>
          {team.map((m, i) => (
            <tr key={i}>
              <td><div className="user-cell"><Avatar name={m.name} src={AVATAR_URL(m.email)} size="md" /><div className="meta"><b>{m.name}</b><span>{m.email}</span></div></div></td>
              <td><Badge kind="brand">{m.role}</Badge></td>
              <td><StatusBadge status={m.status} /></td>
              <td>{m.twofa ? <Badge kind="ok" pip>On</Badge> : <Badge kind="warn" pip>Off</Badge>}</td>
              <td className="muted text-sm">{m.last != null ? m.last + "m ago" : "—"}</td>
              <td><button className="btn-icon" style={{ width: 28, height: 28, border: "none", background: "transparent" }}><I.DotsV size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="card">
      <div className="card-head"><h4>Security</h4></div>
      <div style={{ padding: 22 }}>
        <SettingRow label="Require 2FA for all admins" desc="Block sign-in until 2FA is configured." on />
        <SettingRow label="Single sign-on (Google Workspace)" desc="Force SSO for @smackcheck.com domain." on />
        <SettingRow label="Auto sign-out after 30 minutes idle" desc="Lock admin session for inactivity." on />
        <SettingRow label="Require approval for ban actions" desc="Permanent bans need a second admin&apos;s confirmation." on />
        <SettingRow label="IP allowlist" desc="Restrict admin sign-in to office + VPN ranges." />
      </div>
    </div>
  );
}

function PlatformSection() {
  return (
    <div className="card">
      <div className="card-head"><h4>Platform config</h4></div>
      <div style={{ padding: 22 }}>
        {[
          ["Brand name", "SmackCheck"],
          ["Support email", "help@smackcheck.com"],
          ["DMCA contact", "legal@smackcheck.com"],
          ["Default city for new users", "New York"],
          ["XP per rating", "10"],
          ["XP per photo upload", "5"],
          ["Max ratings shown on dish page", "120"],
        ].map(([l, v]) => (
          <div key={l} className="between" style={{ padding: "14px 0", borderTop: "1px solid var(--line-soft)" }}>
            <div><b style={{ color: "var(--ink)" }}>{l}</b></div>
            <input className="input sm" defaultValue={v} style={{ width: 240 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [section, setSection] = useState("flags");

  const sections = [
    { id: "flags",     label: "Feature flags",             i: I.Zap },
    { id: "ai",        label: "AI moderation",             i: I.Sparkle },
    { id: "limits",    label: "Rate limits",               i: I.Clock },
    { id: "templates", label: "Notification templates",    i: I.Bell },
    { id: "team",      label: "Admin team",                i: I.Users },
    { id: "security",  label: "Security",                  i: I.Lock },
    { id: "platform",  label: "Platform config",           i: I.Settings },
  ];

  return (
    <div className="page" style={{ maxWidth: "100%" }}>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <div className="sub">Feature flags, AI thresholds, rate limits, and admin team.</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "240px 1fr", gap: 24 }}>
        <nav>
          <div className="col gap-1">
            {sections.map(s => {
              const Ic = s.i;
              return (
                <button key={s.id} onClick={() => setSection(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px",
                  background: section === s.id ? "var(--brand-soft)" : "transparent",
                  color: section === s.id ? "var(--brand-ink)" : "var(--ink-3)",
                  border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13.5,
                  fontWeight: section === s.id ? 600 : 500, textAlign: "left", fontFamily: "inherit",
                }}>
                  <Ic size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="col gap-4">
          {section === "flags"     && <FlagsSection />}
          {section === "ai"        && <AISection />}
          {section === "limits"    && <LimitsSection />}
          {section === "templates" && <TemplatesSection />}
          {section === "team"      && <TeamSection />}
          {section === "security"  && <SecuritySection />}
          {section === "platform"  && <PlatformSection />}
        </div>
      </div>
    </div>
  );
}
