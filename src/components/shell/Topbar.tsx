'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { I } from '../icons';
import { Avatar } from '../ui';
import { NAV_ROUTES } from '@/lib/nav';
import { AdminProfile } from '@/lib/adminApi';

interface TopbarProps {
  onCmd: () => void;
  adminUser: AdminProfile | null;
}

function adminDisplayName(user: AdminProfile | null) {
  return user?.name || user?.username || user?.email || 'Admin';
}

export default function Topbar({ onCmd, adminUser }: TopbarProps) {
  const pathname = usePathname();
  const item = NAV_ROUTES.find(n => pathname === n.href || (n.href !== '/' && pathname.startsWith(n.href)));
  const name = adminDisplayName(adminUser);

  return (
    <header className="topbar">
      <div className="crumbs">
        <span>SmackCheck</span>
        <span className="sep">/</span>
        <span>Admin</span>
        <span className="sep">/</span>
        <b>{item ? item.label : pathname.replace('/', '')}</b>
      </div>
      <div className="cmd" onClick={onCmd}>
        <I.Search size={14} />
        <span>Search users, restaurants, reports…</span>
        <div className="kbd">
          <span className="kbd-key">⌘</span>
          <span className="kbd-key">K</span>
        </div>
      </div>
      <button className="icon-btn" title="System status">
        <span style={{ width: 7, height: 7, background: "var(--ok)", borderRadius: 999, boxShadow: "0 0 0 3px rgba(63,122,82,0.18)" }} />
      </button>
      <button className="icon-btn" title="Notifications">
        <I.Bell size={16} />
        <span className="dot" />
      </button>
      <Avatar name={name} src={adminUser?.profile_photo_url || undefined} size="md" />
    </header>
  );
}
