'use client';

import React, { useState, useMemo, useRef } from 'react';
import { I } from '../icons';
import { Avatar, Badge, StatusBadge, Stars, Mini, TLRow, DetailRow, Th, fmt, ago } from '../ui';
import { USERS, DISHES, BADGES, REPORTS, User } from '@/lib/data';

function UserDrawer({ u, onClose }: { u: User | null; onClose: () => void }) {
  const [tab, setTab] = useState("overview");
  const lastUserRef = useRef<User>(USERS[0]);

  if (u) lastUserRef.current = u;
  const user = u || lastUserRef.current;

  return (
    <>
      <div className={"drawer-scrim " + (u ? "open" : "")} onClick={onClose} />
      <div className={"drawer " + (u ? "open" : "")}>
        <div className="drawer-head">
          <div className="row gap-3" style={{ alignItems: "center" }}>
            <button className="icon-btn" onClick={onClose} style={{ width: 30, height: 30 }}><I.X size={14} /></button>
            <span className="font-mono text-xs muted">{user.id}</span>
            <StatusBadge status={user.status} />
          </div>
          <div className="row gap-1">
            <button className="icon-btn" style={{ width: 30, height: 30 }} title="Open full page"><I.External size={14} /></button>
            <button className="icon-btn" style={{ width: 30, height: 30 }}><I.DotsV size={14} /></button>
          </div>
        </div>

        <div className="drawer-body">
          <div className="row gap-4 mb-4" style={{ alignItems: "center" }}>
            <Avatar name={user.name} src={user.avatar} size="xl" />
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 26, marginBottom: 4 }}>{user.name}</h2>
              <div className="muted">@{user.username}</div>
              <div className="row gap-2 mt-3">
                {user.verified && <Badge kind="info" pip>Verified taster</Badge>}
                <Badge kind="brand">Level {user.level}</Badge>
                <Badge>{user.role}</Badge>
              </div>
            </div>
          </div>

          <div className="grid mb-4" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
            <Mini label="XP" value={fmt(user.xp)} />
            <Mini label="Ratings" value={fmt(user.ratings)} />
            <Mini label="Badges" value={user.badges} />
            <Mini label="Reports" value={user.reports} danger={user.reports > 3} />
          </div>

          <div className="card mb-4" style={{ padding: 16 }}>
            <div className="between mb-2">
              <div>
                <div className="eyebrow">Progress to Level {user.level + 1}</div>
                <div className="font-display" style={{ fontSize: 18, color: "var(--ink)" }}>{fmt(user.xp)} <span className="muted text-sm" style={{ fontFamily: "var(--sans)" }}>/ {fmt((user.level + 1) * 1500)} XP</span></div>
              </div>
              <div className="row gap-2 mt-1">
                <I.Flame size={14} style={{ color: "var(--brand-2)" }} />
                <span className="text-sm fw-600">12 day streak</span>
              </div>
            </div>
            <div style={{ height: 6, background: "var(--paper)", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
              <div style={{ width: `${Math.min(100, (user.xp / ((user.level + 1) * 1500)) * 100)}%`, height: "100%", background: "linear-gradient(90deg, var(--brand), var(--brand-2))", borderRadius: 999 }} />
            </div>
          </div>

          <div className="tabs">
            {[
              ["overview",   "Overview"],
              ["ratings",    "Ratings",    user.ratings],
              ["badges",     "Badges",     user.badges],
              ["reports",    "Reports",    user.reports],
              ["moderation", "History"],
            ].map(([id, label, c]) => (
              <div key={id as string} className={"tab " + (tab === id ? "on" : "")} onClick={() => setTab(id as string)}>
                {label}{c != null && <span className="count">{fmt(c as number)}</span>}
              </div>
            ))}
          </div>

          {tab === "overview" && (
            <div className="col gap-4">
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Joined" value={user.joined} />
              <DetailRow label="Location" value={user.location} />
              <DetailRow label="Last active" value={ago(user.lastActive)} />
              <DetailRow label="Account ID" value={<span className="font-mono">{user.id}</span>} />
              <DetailRow label="Verification" value={user.verified ? "Verified · ID + email" : "Email only"} />
              <DetailRow label="Subscription" value="Free tier" />
            </div>
          )}

          {tab === "ratings" && (
            <div className="col gap-3">
              {DISHES.slice(0, 6).map(d => (
                <div key={d.id} className="row gap-3" style={{ padding: 12, background: "var(--paper)", borderRadius: 10 }}>
                  <img src={d.img} alt="" style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink)" }}>{d.name}</div>
                    <div className="muted text-xs">{d.restaurant}</div>
                    <div className="row gap-2 mt-2"><Stars value={d.rating} /><span className="text-xs muted">· {ago((d.id.charCodeAt(2) + 2) * 100)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "badges" && (
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {BADGES.slice(0, user.badges < 6 ? user.badges : 6).map(b => (
                <div key={b.id} style={{ background: "var(--paper)", border: "1px solid var(--line)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{b.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: "var(--ink)" }}>{b.name}</div>
                  <div className="text-xs muted mt-1">+{b.xp} XP</div>
                </div>
              ))}
            </div>
          )}

          {tab === "reports" && (
            <div className="col gap-3">
              {user.reports === 0 ? (
                <div className="empty"><div className="ico"><I.Check size={20} /></div><div className="muted">No reports — clean history.</div></div>
              ) : (
                REPORTS.slice(0, Math.min(user.reports, 4)).map(r => (
                  <div key={r.id} style={{ padding: 12, background: "var(--paper)", borderRadius: 10 }}>
                    <div className="between mb-2"><span className={`sev ${r.severity}`}><span className="bars"><i /><i /><i /></span>{r.severity}</span><span className="muted text-xs">{ago(r.submitted)}</span></div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>{r.category}</div>
                    <div className="muted text-xs truncate mt-1">{r.targetSnippet}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "moderation" && (
            <div className="timeline">
              <TLRow dot="warn" icon={<I.Shield size={12} />} body={<><b>Warning issued</b><div className="desc">Rude comment on rating — by Marcus Q.</div></>} time="2w ago" />
              <TLRow dot="ok" icon={<I.Check size={12} />} body={<><b>Account verified</b><div className="desc">ID + email — by Sara Kwon</div></>} time="3m ago" />
              <TLRow dot="" icon={<I.Plus size={12} />} body={<><b>Account created</b><div className="desc">Via Google OAuth</div></>} time={user.joined} />
            </div>
          )}
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost"><I.Mail size={14} /> Message</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-secondary" style={{ color: "var(--warn)", borderColor: "#ecdcc1" }}><I.Shield size={14} /> Warn</button>
          <button className="btn btn-secondary" style={{ color: "var(--warn)", borderColor: "#ecdcc1" }}><I.Clock size={14} /> Suspend</button>
          <button className="btn btn-danger-solid"><I.Lock size={14} /> Ban</button>
        </div>
      </div>
    </>
  );
}

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: "xp", dir: "desc" });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = USERS.filter(u => {
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (q) {
        const lc = q.toLowerCase();
        return u.name.toLowerCase().includes(lc) || u.username.toLowerCase().includes(lc) || u.email.toLowerCase().includes(lc);
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sort.key];
      const bv = (b as Record<string, unknown>)[sort.key];
      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
      return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [q, statusFilter, roleFilter, sort]);

  const counts = useMemo(() => USERS.reduce((acc: Record<string, number>, u) => { acc[u.status] = (acc[u.status] || 0) + 1; return acc; }, {}), []);

  const toggleSort = (key: string) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Users</h1>
          <div className="sub">{fmt(USERS.length * 17651)} accounts · {counts.active || 0} active · {counts.banned || 0} banned</div>
        </div>
        <div className="row">
          <button className="btn btn-secondary"><I.Download size={14} /> Export CSV</button>
          <button className="btn btn-primary"><I.Plus size={14} /> Invite admin</button>
        </div>
      </div>

      <div className="card mb-4" style={{ padding: 14 }}>
        <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
          <div className="input-icon" style={{ flex: "1 1 280px", maxWidth: 380 }}>
            <I.Search size={14} />
            <input className="input" placeholder="Search by name, @username, email…" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <select className="input" style={{ width: "auto" }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="warned">Warned</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <select className="input" style={{ width: "auto" }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="creator">Creator</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-secondary sm"><I.Filter size={12} /> More filters</button>
          <div style={{ flex: 1 }} />
          <div className="muted text-xs">Showing <b style={{ color: "var(--ink)" }}>{filtered.length}</b> of {USERS.length}</div>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <div className="mb-3" style={{ background: "var(--brand-soft)", border: "1px solid var(--brand-line)", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <Badge kind="brand">{selectedRows.length} selected</Badge>
          <button className="btn sm btn-secondary"><I.Mail size={12} /> Email</button>
          <button className="btn sm btn-secondary"><I.Shield size={12} /> Warn</button>
          <button className="btn sm btn-danger"><I.Lock size={12} /> Suspend</button>
          <button className="btn sm btn-ghost" onClick={() => setSelectedRows([])} style={{ marginLeft: "auto" }}>Clear</button>
        </div>
      )}

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 38 }}>
                <input type="checkbox" style={{ accentColor: "var(--brand)" }}
                       checked={selectedRows.length === filtered.length && filtered.length > 0}
                       onChange={e => setSelectedRows(e.target.checked ? filtered.map(u => u.id) : [])} />
              </th>
              <Th onClick={() => toggleSort("name")} active={sort.key === "name"} dir={sort.dir}>User</Th>
              <Th onClick={() => toggleSort("status")} active={sort.key === "status"} dir={sort.dir}>Status</Th>
              <Th onClick={() => toggleSort("level")} active={sort.key === "level"} dir={sort.dir} align="right">Level</Th>
              <Th onClick={() => toggleSort("xp")} active={sort.key === "xp"} dir={sort.dir} align="right">XP</Th>
              <Th onClick={() => toggleSort("ratings")} active={sort.key === "ratings"} dir={sort.dir} align="right">Ratings</Th>
              <Th onClick={() => toggleSort("reports")} active={sort.key === "reports"} dir={sort.dir} align="right">Reports</Th>
              <Th>Location</Th>
              <Th onClick={() => toggleSort("lastActive")} active={sort.key === "lastActive"} dir={sort.dir}>Last active</Th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className={selectedRows.includes(u.id) ? "selected" : ""} onClick={() => setSelectedUser(u)}>
                <td onClick={e => e.stopPropagation()}>
                  <input type="checkbox" style={{ accentColor: "var(--brand)" }}
                         checked={selectedRows.includes(u.id)}
                         onChange={e => setSelectedRows(e.target.checked ? [...selectedRows, u.id] : selectedRows.filter(id => id !== u.id))} />
                </td>
                <td>
                  <div className="user-cell">
                    <Avatar name={u.name} src={u.avatar} size="md" />
                    <div className="meta">
                      <b>{u.name} {u.verified && <I.Check size={11} style={{ color: "var(--info)" }} />}</b>
                      <span>@{u.username} · {u.email}</span>
                    </div>
                  </div>
                </td>
                <td><StatusBadge status={u.status} /></td>
                <td style={{ textAlign: "right" }} className="tnum">
                  <span style={{ background: "var(--brand-soft)", color: "var(--brand-ink)", padding: "2px 8px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Lv {u.level}</span>
                </td>
                <td style={{ textAlign: "right" }} className="tnum">{fmt(u.xp)}</td>
                <td style={{ textAlign: "right" }} className="tnum">{fmt(u.ratings)}</td>
                <td style={{ textAlign: "right" }} className="tnum">
                  <span style={{ color: u.reports > 3 ? "var(--danger)" : u.reports > 0 ? "var(--warn)" : "var(--mute)", fontWeight: u.reports > 0 ? 600 : 400 }}>{u.reports}</span>
                </td>
                <td className="muted text-sm">{u.location}</td>
                <td className="muted text-sm">{ago(u.lastActive)}</td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="btn-icon" style={{ width: 28, height: 28, border: "none", background: "transparent" }}><I.DotsV size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="tbl-foot">
          <div>Showing 1–{filtered.length} of {fmt(USERS.length * 17651)}</div>
          <div className="pager">
            <button disabled><I.Chevron size={12} style={{ transform: "rotate(180deg)" }} /></button>
            <button className="on">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>…</button>
            <button>1480</button>
            <button><I.Chevron size={12} /></button>
          </div>
        </div>
      </div>

      <UserDrawer u={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
