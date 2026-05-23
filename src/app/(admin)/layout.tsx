'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/shell/Sidebar';
import Topbar from '@/components/shell/Topbar';
import CommandPalette from '@/components/shell/CommandPalette';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('sc_admin_auth') !== '1') {
      router.replace('/login');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('sc_admin_auth');
    router.push('/login');
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--paper)" }}>
        <div style={{ fontFamily: "var(--display)", fontSize: 22, color: "var(--mute)" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="app" style={{ "--sidebar-w": (collapsed ? "72px" : "248px") } as React.CSSProperties}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <main className="main">
        <Topbar onCmd={() => setCmdOpen(true)} />
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </main>
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  );
}
