import type { ComponentType } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  group: string;
  count?: number;
  href: string;
}

// Icons are imported at use-site to avoid circular deps.
// The nav config without icons is used for routing and metadata.
export const NAV_ROUTES: { id: string; label: string; group: string; count?: number; href: string }[] = [
  { id: "dashboard",     label: "Dashboard",          group: "Overview",        href: "/dashboard" },
  { id: "reports",       label: "Moderation Queue",   group: "Trust & Safety",  href: "/reports", count: 124 },
  { id: "content",       label: "Content Moderation", group: "Trust & Safety",  href: "/content" },
  { id: "logs",          label: "Moderation Log",     group: "Trust & Safety",  href: "/logs" },
  { id: "users",         label: "Users",              group: "Catalog",         href: "/users" },
  { id: "restaurants",   label: "Restaurants",        group: "Catalog",         href: "/restaurants" },
  { id: "dishes",        label: "Dishes",             group: "Catalog",         href: "/dishes" },
  { id: "notifications", label: "Notifications",      group: "Engagement",      href: "/notifications" },
  { id: "badges",        label: "Badges",             group: "Engagement",      href: "/badges" },
  { id: "challenges",    label: "Challenges",         group: "Engagement",      href: "/challenges" },
  { id: "analytics",     label: "Analytics",          group: "Insights",        href: "/analytics" },
  { id: "settings",      label: "Settings",           group: "System",          href: "/settings" },
];

export const NAV_GROUPS = ["Overview", "Trust & Safety", "Catalog", "Engagement", "Insights", "System"];
