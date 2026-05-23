'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { I } from '../icons';
import { Avatar } from '../ui';
import { NAV_ROUTES, NAV_GROUPS } from '@/lib/nav';
import { AVATAR_URL } from '@/lib/data';

// Map nav ids to icon components
const NAV_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  dashboard:     I.Dashboard,
  reports:       I.Flag,
  content:       I.Shield,
  logs:          I.History,
  users:         I.Users,
  restaurants:   I.Store,
  dishes:        I.Dish,
  notifications: I.Bell,
  badges:        I.Badge,
  challenges:    I.Trophy,
  analytics:     I.Chart,
  settings:      I.Settings,
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ collapsed, setCollapsed, onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar" style={collapsed ? { width: 72 } : {}}>
      <div className="sb-brand" onClick={() => setCollapsed(!collapsed)} title="Toggle sidebar">
        <div className="mark">s</div>
        {!collapsed && <div className="word">Smack<b>Check</b></div>}
        {!collapsed && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--mute)", border: "1px solid var(--line)", padding: "2px 6px", borderRadius: 5, letterSpacing: "0.06em" }}>
            ADMIN
          </span>
        )}
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: collapsed ? "8px 8px" : "8px 14px" }} className="no-scrollbar">
        {NAV_GROUPS.map(g => {
          const items = NAV_ROUTES.filter(n => n.group === g);
          if (!items.length) return null;
          return (
            <div className="sb-section" key={g} style={{ padding: collapsed ? "10px 0" : "12px 0 4px" }}>
              {!collapsed && <div className="label">{g}</div>}
              <div className="sb-nav">
                {items.map(n => {
                  const Ic = NAV_ICONS[n.id];
                  const isActive = pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href));
                  return (
                    <Link
                      key={n.id}
                      href={n.href}
                      className={"sb-item " + (isActive ? "active" : "")}
                      title={collapsed ? n.label : ""}
                      style={{
                        textDecoration: "none",
                        ...(collapsed ? { justifyContent: "center", padding: "10px" } : {}),
                      }}
                    >
                      <span className="icon">{Ic && <Ic size={18} />}</span>
                      {!collapsed && <span>{n.label}</span>}
                      {!collapsed && n.count != null && <span className="count">{n.count}</span>}
                      {collapsed && n.count != null && (
                        <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, borderRadius: 999, background: "var(--brand)" }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sb-footer" style={collapsed ? { flexDirection: "column", gap: 8 } : {}}>
        <Avatar name="Alex Chen" src={AVATAR_URL("alexadmin")} size="md" />
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>Alex Chen</div>
            <div style={{ fontSize: 11.5, color: "var(--mute)" }}>Senior Moderator</div>
          </div>
        )}
        <button className="icon-btn" style={{ width: 28, height: 28 }} title="Sign out" onClick={onLogout}>
          <I.Logout size={14} />
        </button>
      </div>
    </aside>
  );
}
