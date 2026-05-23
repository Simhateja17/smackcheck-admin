'use client';

import React from 'react';
import { I } from './icons';

// ============ Avatar ============
interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '';
  className?: string;
}
export const Avatar = ({ name = "", src, size = "md", className = "" }: AvatarProps) => {
  const initials = (name || "?").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
  const hue = (name || "").split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 360;
  const bg = `linear-gradient(135deg, hsl(${hue} 28% 60%), hsl(${(hue + 30) % 360} 32% 42%))`;
  return (
    <div className={`avatar ${size} ${className}`} style={src ? {} : { background: bg }}>
      {src ? <img src={src} alt={name} /> : initials}
    </div>
  );
};

// ============ Badge ============
interface BadgeProps {
  children: React.ReactNode;
  kind?: string;
  className?: string;
  pip?: boolean;
  size?: string;
  style?: React.CSSProperties;
}
export const Badge = ({ children, kind = "", className = "", pip = false, size = "", style }: BadgeProps) => (
  <span className={`badge ${kind} ${size} ${className}`} style={style}>
    {pip && <span className="pip" />}
    {children}
  </span>
);

// ============ StatusBadge ============
interface StatusBadgeProps {
  status: string;
}
export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<string, { kind: string; label: string }> = {
    open:      { kind: "danger", label: "Open" },
    reviewing: { kind: "warn",   label: "Reviewing" },
    resolved:  { kind: "ok",     label: "Resolved" },
    dismissed: { kind: "",       label: "Dismissed" },
    approved:  { kind: "ok",     label: "Approved" },
    pending:   { kind: "warn",   label: "Pending" },
    hidden:    { kind: "",       label: "Hidden" },
    rejected:  { kind: "danger", label: "Rejected" },
    active:    { kind: "ok",     label: "Active" },
    banned:    { kind: "danger", label: "Banned" },
    suspended: { kind: "warn",   label: "Suspended" },
    warned:    { kind: "warn",   label: "Warned" },
    verified:  { kind: "info",   label: "Verified" },
    new:       { kind: "brand",  label: "New" },
    scheduled: { kind: "info",   label: "Scheduled" },
    sent:      { kind: "ok",     label: "Sent" },
    draft:     { kind: "",       label: "Draft" },
  };
  const c = map[status] || { kind: "", label: status };
  return <Badge kind={c.kind} pip>{c.label}</Badge>;
};

// ============ Severity ============
interface SeverityProps {
  level: string;
}
export const Severity = ({ level }: SeverityProps) => (
  <span className={`sev ${level}`}>
    <span className="bars"><i /><i /><i /></span>
    {level}
  </span>
);

// ============ Sparkline ============
interface SparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}
export const Sparkline = ({ data = [], width = 80, height = 28, color = "var(--brand)", fill = false }: SparklineProps) => {
  if (!data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const path = "M " + points.join(" L ");
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width={width} height={height} className="spark-line">
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={path} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ============ Stars ============
interface StarsProps {
  value?: number;
  size?: number;
}
export const Stars = ({ value = 0, size = 12 }: StarsProps) => (
  <span style={{ display: "inline-flex", gap: 1.5, color: "var(--brand-2)" }}>
    {[1, 2, 3, 4, 5].map(n =>
      n <= Math.round(value)
        ? <I.Star key={n} size={size} />
        : <I.StarO key={n} size={size} />
    )}
  </span>
);

// ============ fmt ============
export const fmt = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
};

// ============ ago ============
export const ago = (mins: number): string => {
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  if (mins < 1440) return Math.floor(mins / 60) + "h ago";
  const d = Math.floor(mins / 1440);
  if (d < 7) return d + "d ago";
  return Math.floor(d / 7) + "w ago";
};

// ============ Select ============
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}
export const Select = ({ value, onChange, options }: SelectProps) => (
  <div style={{ position: "relative" }}>
    <select value={value} onChange={e => onChange(e.target.value)}
            style={{
              appearance: "none",
              background: "white",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "6px 26px 6px 10px",
              fontSize: 12.5,
              color: "var(--ink-2)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
    <I.ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--mute)" }} />
  </div>
);

// ============ Mini (used in Reports & Users drawers) ============
interface MiniProps {
  label: string;
  value: React.ReactNode;
  danger?: boolean;
}
export const Mini = ({ label, value, danger }: MiniProps) => (
  <div style={{ background: "var(--paper)", borderRadius: 8, padding: "8px 10px" }}>
    <div className="text-xs muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    <div className="font-display tnum" style={{ fontSize: 18, color: danger ? "var(--danger)" : "var(--ink)" }}>{value}</div>
  </div>
);

// ============ TLRow (timeline row) ============
interface TLRowProps {
  dot?: string;
  icon: React.ReactNode;
  body: React.ReactNode;
  time: string;
}
export const TLRow = ({ dot = "", icon, body, time }: TLRowProps) => (
  <div className="tl-row">
    <div className={"tl-dot " + dot}>{icon}</div>
    <div className="tl-body">{body}</div>
    <div className="tl-time">{time}</div>
  </div>
);

// ============ HistRow ============
interface HistRowProps {
  time: string;
  action: string;
  reason: string;
}
export const HistRow = ({ time, action, reason }: HistRowProps) => (
  <div className="row gap-3" style={{ padding: "8px 0", borderTop: "1px solid var(--line-soft)" }}>
    <div style={{ width: 6, height: 6, background: "var(--warn)", borderRadius: 999, marginTop: 6 }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>{action}</div>
      <div className="muted text-xs">{reason}</div>
    </div>
    <div className="muted text-xs" style={{ whiteSpace: "nowrap" }}>{time}</div>
  </div>
);

// ============ DetailRow (used in Users & Restaurants drawers) ============
interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}
export const DetailRow = ({ label, value }: DetailRowProps) => (
  <div className="between" style={{ padding: "8px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "flex-start" }}>
    <span className="muted text-sm" style={{ width: 130, flex: "none" }}>{label}</span>
    <span style={{ fontSize: 13, color: "var(--ink-2)", textAlign: "right", fontWeight: 500 }}>{value}</span>
  </div>
);

// ============ Th (sortable table header) ============
interface ThProps {
  children?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  dir?: 'asc' | 'desc';
  align?: string;
  style?: React.CSSProperties;
}
export const Th = ({ children, onClick, active, dir, align, style }: ThProps) => (
  <th onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", textAlign: (align as React.CSSProperties['textAlign']) || "left", userSelect: "none", ...style }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
      {onClick && (
        <span style={{ opacity: active ? 1 : 0.3, transition: "opacity .12s" }}>
          {active && dir === "asc" ? <I.ChevronUp size={11} /> : <I.ChevronDown size={11} />}
        </span>
      )}
    </span>
  </th>
);
