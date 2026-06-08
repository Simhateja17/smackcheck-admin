'use client';

import React, { useState } from 'react';
import { I } from '@/components/icons';
import { Avatar, Badge, Sparkline, Stars, StatusBadge, fmt } from '@/components/ui';
import {
  AdminChallenge,
  AdminDish,
  AdminModerationAction,
  AdminNotification,
  AdminProfile,
  AdminRestaurant,
  adminApi,
} from '@/lib/adminApi';
import { ApiState, useAdminQuery } from '@/lib/useAdminQuery';

function minutesAgo(iso?: string | null) {
  if (!iso) return 'unknown';
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

function displayName(user?: AdminProfile | null) {
  return user?.name || user?.username || user?.email || 'Unknown user';
}

function StatCard({ label, value, hint, spark }: { label: string; value: number | string; hint?: string; spark?: number[] }) {
  return (
    <div className="stat">
      <div className="label">{label}</div>
      <div className="val tnum">{typeof value === 'number' ? fmt(value) : value}</div>
      {hint && <div className="muted text-xs">{hint}</div>}
      {spark && <div className="spark"><Sparkline data={spark} width={70} height={28} fill /></div>}
    </div>
  );
}

function PageHead({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <div className="sub">{subtitle}</div>
      </div>
      {action && <div className="row">{action}</div>}
    </div>
  );
}

function EmptyRows({ label }: { label: string }) {
  return <div className="empty"><div className="muted">{label}</div></div>;
}

function isAdminDish(row: AdminRestaurant | AdminDish): row is AdminDish {
  return 'restaurant_id' in row || 'restaurants' in row;
}

function catalogSubtitle(row: AdminRestaurant | AdminDish) {
  if (isAdminDish(row)) return row.restaurants?.name || row.restaurant_id || 'Dish';
  return row.city || row.cuisine || 'Restaurant';
}

function defaultCatalogStatus(row: AdminRestaurant | AdminDish) {
  return isAdminDish(row) ? 'approved' : 'verified';
}

function CatalogUser({ user }: { user?: AdminProfile | null }) {
  const name = displayName(user);
  const secondary = user?.username
    ? `@${user.username}`
    : user?.email || '';

  return (
    <div className="row gap-2" style={{ alignItems: 'center' }}>
      <Avatar name={name} src={user?.profile_photo_url || undefined} />
      <div>
        <div className="fw-600">{name}</div>
        {secondary && secondary !== name && <div className="muted text-xs">{secondary}</div>}
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, danger = false }: { children: React.ReactNode; onClick: () => Promise<void>; danger?: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      className={`btn sm ${danger ? 'btn-danger' : 'btn-secondary'}`}
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await onClick();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Saving...' : children}
    </button>
  );
}

export function LiveDashboard() {
  const query = useAdminQuery(() => adminApi.dashboard(), []);
  const stats = query.data?.stats;

  return (
    <div className="page">
      <PageHead title="Dashboard" subtitle="Live admin overview from the shared backend." />
      <ApiState loading={query.loading} error={query.error} />
      {stats && (
        <>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 18 }}>
            <StatCard label="Total users" value={stats.totalUsers ?? 0} hint={`${fmt(stats.newUsers7d ?? 0)} new this week`} />
            <StatCard label="Active 24h" value={stats.activeUsers24h ?? 0} hint="based on last rating activity" />
            <StatCard label="Ratings 24h" value={stats.ratings24h ?? 0} hint={`${fmt(stats.totalRatings ?? 0)} total`} />
            <StatCard label="Pending reports" value={stats.pendingReports ?? 0} hint={`${fmt(stats.moderationQueue ?? 0)} in queue`} />
            <StatCard label="Restaurants" value={stats.totalRestaurants ?? 0} />
            <StatCard label="Hidden content" value={stats.hiddenContent ?? 0} hint="safe transition, not deleted" />
          </div>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: 18 }}>
            <div className="card">
              <div className="card-head"><h4>Recent reports</h4><Badge kind="warn" pip>Live</Badge></div>
              <div className="card-body">
                {query.data?.recentReports?.length ? query.data.recentReports.map(report => (
                  <div key={report.id} className="between" style={{ padding: '10px 0', borderTop: '1px solid var(--line-soft)' }}>
                    <div>
                      <div className="fw-600">{report.reason}</div>
                      <div className="muted text-xs">{report.target_type} · {minutesAgo(report.created_at)}</div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                )) : <EmptyRows label="No recent reports." />}
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h4>Recent admin actions</h4><Badge>Audit trail</Badge></div>
              <div className="card-body">
                {query.data?.recentActions?.length ? query.data.recentActions.map(action => (
                  <div key={action.id} className="between" style={{ padding: '10px 0', borderTop: '1px solid var(--line-soft)' }}>
                    <div>
                      <div className="fw-600">{action.action} · {action.target_type}</div>
                      <div className="muted text-xs">{action.reason || action.target_id}</div>
                    </div>
                    <div className="muted text-xs">{minutesAgo(action.created_at)}</div>
                  </div>
                )) : <EmptyRows label="No admin actions yet." />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function LiveUsers() {
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const query = useAdminQuery(() => adminApi.users('?limit=50'), [refresh]);
  const users = query.data?.users ?? [];

  const runUserAction = async (user: AdminProfile, action: 'warn' | 'suspend' | 'ban' | 'restore') => {
    const labels = {
      warn: 'send a warning notification to',
      suspend: 'restrict',
      ban: 'ban',
      restore: 'restore',
    };
    const name = displayName(user);
    const confirmed = window.confirm(`Are you sure you want to ${labels[action]} ${name}?`);
    if (!confirmed) return;

    const defaultReason = {
      warn: 'Please follow SmackCheck community guidelines.',
      suspend: 'Repeated policy violations.',
      ban: 'Serious or repeated policy violation.',
      restore: 'Account reviewed and restored.',
    }[action];
    const reason = window.prompt('Reason shown in admin logs and user notification:', defaultReason);
    if (reason === null) return;

    try {
      const result = await adminApi.userAction(user.id, { action, reason: reason.trim() || defaultReason });
      const nextStatus = (result as { user?: AdminProfile | null }).user?.account_status || user.account_status || 'active';
      setMessage(`${name}: ${action} applied. Current status: ${nextStatus}. Notification created in the app.`);
      setRefresh(v => v + 1);
    } catch (err) {
      setMessage(`${name}: failed to apply ${action}. ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="page">
      <PageHead title="Users" subtitle="Real accounts from Supabase profiles. Actions are reversible status changes." />
      {message && (
        <div className="card mb-4" style={{ padding: 14, borderColor: message.includes('failed') ? 'var(--danger)' : 'var(--brand-line)' }}>
          <div className="row gap-2" style={{ alignItems: 'center' }}>
            <I.Shield size={14} />
            <span style={{ color: message.includes('failed') ? 'var(--danger)' : 'var(--ink)' }}>{message}</span>
          </div>
        </div>
      )}
      <ApiState loading={query.loading} error={query.error} />
      {!query.loading && !query.error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>User</th><th>Status</th><th>Level</th><th>XP</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="row gap-3" style={{ alignItems: 'center' }}>
                      <Avatar name={displayName(user)} src={user.profile_photo_url || undefined} />
                      <div><div className="fw-600">{displayName(user)}</div><div className="muted text-xs">{user.email || user.id}</div></div>
                    </div>
                  </td>
                  <td><StatusBadge status={user.account_status || 'active'} /></td>
                  <td className="tnum">{user.level ?? 1}</td>
                  <td className="tnum">{fmt(user.xp ?? 0)}</td>
                  <td className="muted text-xs">{minutesAgo(user.created_at)}</td>
                  <td>
                    <div className="row gap-2">
                      <ActionButton onClick={() => runUserAction(user, 'warn')}>Warn</ActionButton>
                      <ActionButton onClick={() => runUserAction(user, 'suspend')}>Suspend</ActionButton>
                      <ActionButton danger onClick={() => runUserAction(user, 'ban')}>Ban</ActionButton>
                      <ActionButton onClick={() => runUserAction(user, 'restore')}>Restore</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={6}><EmptyRows label="No users found." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LiveReports() {
  const [refresh, setRefresh] = useState(0);
  const query = useAdminQuery(() => adminApi.reports('?limit=50'), [refresh]);
  const reports = query.data?.reports ?? [];

  return (
    <div className="page">
      <PageHead title="Reports" subtitle="Report queue from the shared backend. Actions resolve reports without deleting data." />
      <ApiState loading={query.loading} error={query.error} />
      {!query.loading && !query.error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Reason</th><th>Target</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td><div className="fw-600">{report.reason}</div><div className="muted text-xs">{report.details || report.id}</div></td>
                  <td><Badge>{report.target_type}</Badge><div className="muted text-xs mt-1">{report.target_id}</div></td>
                  <td><StatusBadge status={report.status} /></td>
                  <td className="muted text-xs">{minutesAgo(report.created_at)}</td>
                  <td>
                    <div className="row gap-2">
                      <ActionButton onClick={async () => { await adminApi.reportAction(report.id, { action: 'hide', reason: 'Hidden after admin review' }); setRefresh(v => v + 1); }}>Hide</ActionButton>
                      <ActionButton danger onClick={async () => { await adminApi.reportAction(report.id, { action: 'reject', reason: 'Rejected after admin review' }); setRefresh(v => v + 1); }}>Remove</ActionButton>
                      <ActionButton onClick={async () => { await adminApi.reportAction(report.id, { action: 'approve', reason: 'Dismissed after admin review' }); setRefresh(v => v + 1); }}>Dismiss</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!reports.length && <tr><td colSpan={5}><EmptyRows label="No reports found." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LiveContent() {
  const [type, setType] = useState('rating');
  const [refresh, setRefresh] = useState(0);
  const query = useAdminQuery(() => adminApi.content(`?type=${type}&limit=50`), [type, refresh]);
  const items = query.data?.items ?? [];

  return (
    <div className="page">
      <PageHead
        title="Content moderation"
        subtitle="Ratings, comments, and stories can be hidden or restored without deleting them."
        action={<select className="input" value={type} onChange={event => setType(event.target.value)} style={{ width: 'auto' }}><option value="rating">Ratings</option><option value="comment">Comments</option><option value="story">Stories</option></select>}
      />
      <ApiState loading={query.loading} error={query.error} />
      {!query.loading && !query.error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Content</th><th>User</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="fw-600">{item.dishes?.name || item.comment || item.id}</div>
                    <div className="muted text-xs">{item.restaurants?.name || item.comment || item.image_url || 'No preview'}</div>
                    {typeof item.rating === 'number' && <Stars value={item.rating} />}
                  </td>
                  <td>{displayName(item.profiles)}</td>
                  <td><StatusBadge status={item.content_status || 'approved'} /></td>
                  <td className="muted text-xs">{minutesAgo(item.created_at)}</td>
                  <td>
                    <div className="row gap-2">
                      <ActionButton onClick={async () => { await adminApi.contentAction(type, item.id, { action: 'hide', reason: 'Hidden from content queue' }); setRefresh(v => v + 1); }}>Hide</ActionButton>
                      <ActionButton danger onClick={async () => { await adminApi.contentAction(type, item.id, { action: 'reject', reason: 'Rejected from content queue' }); setRefresh(v => v + 1); }}>Reject</ActionButton>
                      <ActionButton onClick={async () => { await adminApi.contentAction(type, item.id, { action: 'restore', reason: 'Restored from content queue' }); setRefresh(v => v + 1); }}>Restore</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5}><EmptyRows label="No content found." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CatalogPage<T extends AdminRestaurant | AdminDish>({
  title,
  subtitle,
  rows,
  loading,
  error,
  onStatus,
}: {
  title: string;
  subtitle: string;
  rows: T[];
  loading: boolean;
  error: string | null;
  onStatus: (id: string, status: string) => Promise<void>;
}) {
  return (
    <div className="page">
      <PageHead title={title} subtitle={subtitle} />
      <ApiState loading={loading} error={error} />
      {!loading && !error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Name</th><th>User</th><th>Status</th><th>Rating</th><th>Reviews</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <div className="fw-600">{row.name || row.id}</div>
                    <div className="muted text-xs">{catalogSubtitle(row)}</div>
                  </td>
                  <td><CatalogUser user={row.first_reviewer} /></td>
                  <td><StatusBadge status={row.catalog_status || defaultCatalogStatus(row)} /></td>
                  <td>{typeof row.average_rating === 'number' ? <Stars value={row.average_rating} /> : '-'}</td>
                  <td className="tnum">{fmt(row.review_count ?? 0)}</td>
                  <td className="muted text-xs">{minutesAgo(row.created_at)}</td>
                  <td>
                    <div className="row gap-2">
                      <ActionButton onClick={() => onStatus(row.id, 'hidden')}>Hide</ActionButton>
                      <ActionButton onClick={() => onStatus(row.id, 'verified')}>Verify</ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={7}><EmptyRows label="No catalog rows found." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LiveRestaurants() {
  const [refresh, setRefresh] = useState(0);
  const query = useAdminQuery(() => adminApi.restaurants('?limit=50'), [refresh]);
  return (
    <CatalogPage
      title="Restaurants"
      subtitle="Restaurant catalog from the backend. Hidden restaurants stay in the database."
      rows={query.data?.restaurants ?? []}
      loading={query.loading}
      error={query.error}
      onStatus={async (id, status) => {
        await adminApi.restaurantStatus(id, { status, reason: `Restaurant marked ${status}` });
        setRefresh(v => v + 1);
      }}
    />
  );
}

export function LiveDishes() {
  const [refresh, setRefresh] = useState(0);
  const query = useAdminQuery(() => adminApi.dishes('?limit=50'), [refresh]);
  return (
    <CatalogPage
      title="Dishes"
      subtitle="Dish catalog from the backend. Hidden dishes stay recoverable."
      rows={query.data?.dishes ?? []}
      loading={query.loading}
      error={query.error}
      onStatus={async (id, status) => {
        await adminApi.dishStatus(id, { status: status === 'verified' ? 'approved' : status, reason: `Dish marked ${status}` });
        setRefresh(v => v + 1);
      }}
    />
  );
}

export function LiveNotifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [sending, setSending] = useState(false);
  const query = useAdminQuery(() => adminApi.notifications('?limit=50'), [refresh]);
  const rows = query.data?.notifications ?? [];

  return (
    <div className="page">
      <PageHead title="Notifications" subtitle="Broadcasts are inserted by the shared backend and sent through push." />
      <div className="card mb-4" style={{ padding: 16 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr auto', alignItems: 'end' }}>
          <div className="field"><label>Title</label><input className="input" value={title} onChange={event => setTitle(event.target.value)} /></div>
          <div className="field"><label>Body</label><input className="input" value={body} onChange={event => setBody(event.target.value)} /></div>
          <button
            className="btn btn-primary"
            disabled={sending || !title || !body}
            onClick={async () => {
              setSending(true);
              try {
                await adminApi.broadcast({ title, body });
                setTitle('');
                setBody('');
                setRefresh(v => v + 1);
              } finally {
                setSending(false);
              }
            }}
          >
            <I.Send size={14} /> {sending ? 'Sending...' : 'Send broadcast'}
          </button>
        </div>
      </div>
      <ApiState loading={query.loading} error={query.error} />
      {!query.loading && !query.error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Title</th><th>Body</th><th>User</th><th>Sent</th></tr></thead>
            <tbody>
              {rows.map((row: AdminNotification) => (
                <tr key={row.id}><td className="fw-600">{row.title}</td><td>{row.body}</td><td className="font-mono text-xs">{row.user_id}</td><td>{minutesAgo(row.created_at)}</td></tr>
              ))}
              {!rows.length && <tr><td colSpan={4}><EmptyRows label="No broadcasts yet." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LiveBadges() {
  const query = useAdminQuery(() => adminApi.badges(), []);
  const badges = query.data?.badges ?? [];
  return (
    <div className="page">
      <PageHead title="Badges" subtitle="Badge definitions from the backend." />
      <ApiState loading={query.loading} error={query.error} />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {badges.map(badge => (
          <div key={badge.id} className="card" style={{ padding: 18 }}>
            <Badge kind="brand">{badge.category || 'badge'}</Badge>
            <h3 className="mt-3">{badge.name || badge.id}</h3>
            <div className="muted text-sm">{badge.description || 'No description yet.'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveChallenges() {
  const query = useAdminQuery(() => adminApi.challenges(), []);
  const challenges = query.data?.challenges ?? [];
  return (
    <div className="page">
      <PageHead title="Challenges" subtitle="Challenge definitions from the backend." />
      <ApiState loading={query.loading} error={query.error} />
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {challenges.map((challenge: AdminChallenge) => (
          <div key={challenge.id} className="card" style={{ padding: 18 }}>
            <StatusBadge status={challenge.is_active ? 'active' : 'draft'} />
            <h3 className="mt-3">{challenge.title || challenge.name || challenge.id}</h3>
            <div className="muted text-sm">{challenge.description || challenge.action_type || 'No description yet.'}</div>
            <div className="row gap-2 mt-3"><Badge>{challenge.target_count ?? 0} target</Badge><Badge kind="brand">{challenge.xp_reward ?? 0} XP</Badge></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LiveLogs() {
  const query = useAdminQuery(() => adminApi.logs('?limit=100'), []);
  const logs = query.data?.logs ?? [];
  return (
    <div className="page">
      <PageHead title="Audit logs" subtitle="Every admin safety action is recorded here." />
      <ApiState loading={query.loading} error={query.error} />
      {!query.loading && !query.error && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Action</th><th>Target</th><th>Reason</th><th>Moderator</th><th>Time</th></tr></thead>
            <tbody>
              {logs.map((log: AdminModerationAction) => (
                <tr key={log.id}>
                  <td><Badge kind="brand">{log.action}</Badge></td>
                  <td>{log.target_type}<div className="muted text-xs font-mono">{log.target_id}</div></td>
                  <td>{log.reason || '-'}</td>
                  <td>{displayName(log.profiles)}</td>
                  <td>{minutesAgo(log.created_at)}</td>
                </tr>
              ))}
              {!logs.length && <tr><td colSpan={5}><EmptyRows label="No audit logs yet." /></td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function LiveAnalytics() {
  const query = useAdminQuery(() => adminApi.analytics(), []);
  const data = query.data;
  return (
    <div className="page">
      <PageHead title="Analytics" subtitle="30-day counts from the shared backend." />
      <ApiState loading={query.loading} error={query.error} />
      {data && (
        <>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 18 }}>
            <StatCard label="New users" value={data.newUsers.reduce((sum, value) => sum + value, 0)} spark={data.newUsers} />
            <StatCard label="Ratings" value={data.ratings.reduce((sum, value) => sum + value, 0)} spark={data.ratings} />
            <StatCard label="Reports" value={data.reports.reduce((sum, value) => sum + value, 0)} spark={data.reports} />
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h4>Daily trend</h4>
            <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
              {data.days.map((day, index) => (
                <div key={day} style={{ background: 'var(--paper)', borderRadius: 8, padding: 8 }}>
                  <div className="muted text-xs">{day.slice(5)}</div>
                  <div className="tnum fw-600">{data.ratings[index] ?? 0}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
