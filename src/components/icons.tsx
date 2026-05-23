'use client';

import React from 'react';

interface IconProps {
  size?: number;
  sw?: number;
  fill?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon = ({ d, size = 16, sw = 1.7, fill = "none", className = "", style = {} }: IconProps & { d: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

export const I = {
  Dashboard: (p: IconProps) => <Icon {...p} d="M3 13h7V3H3v10zm0 8h7v-6H3v6zm11 0h7V11h-7v10zm0-18v6h7V3h-7z" />,
  Users:     (p: IconProps) => <Icon {...p} d={<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><circle cx="17" cy="6" r="2.5"/><path d="M16 13c2.5 0 5 2 5 5"/></>} />,
  Flag:      (p: IconProps) => <Icon {...p} d="M4 22V4M4 4l13 3-3 5 3 5-13-3" />,
  Shield:    (p: IconProps) => <Icon {...p} d={<><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"/><path d="m9 12 2 2 4-4"/></>} />,
  Store:     (p: IconProps) => <Icon {...p} d={<><path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 22v-6h6v6"/><path d="M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M9 9c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M15 9c0 1.7 1.3 3 3 3s3-1.3 3-3"/></>} />,
  Dish:      (p: IconProps) => <Icon {...p} d={<><path d="M3 12a9 9 0 0 1 18 0"/><path d="M2 12h20"/><path d="M2 16h20"/><circle cx="9" cy="9" r="1" fill="currentColor" stroke="none"/><circle cx="14" cy="8" r="0.8" fill="currentColor" stroke="none"/></>} />,
  Bell:      (p: IconProps) => <Icon {...p} d={<><path d="M18 16V11a6 6 0 0 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 21h4"/></>} />,
  Badge:     (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="10" r="6"/><path d="M9 14.5 7 22l5-2 5 2-2-7.5"/></>} />,
  Trophy:    (p: IconProps) => <Icon {...p} d={<><path d="M6 4h12v4a6 6 0 0 1-12 0V4z"/><path d="M6 6H4a2 2 0 0 0-2 2 4 4 0 0 0 4 4M18 6h2a2 2 0 0 1 2 2 4 4 0 0 1-4 4"/><path d="M9 17h6v3H9zM8 20h8"/></>} />,
  Chart:     (p: IconProps) => <Icon {...p} d="M3 3v18h18M7 14l3-3 3 3 5-6" />,
  History:   (p: IconProps) => <Icon {...p} d={<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>} />,
  Settings:  (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>} />,
  Search:    (p: IconProps) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>} />,
  Plus:      (p: IconProps) => <Icon {...p} d="M12 5v14M5 12h14" />,
  Minus:     (p: IconProps) => <Icon {...p} d="M5 12h14" />,
  X:         (p: IconProps) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />,
  Check:     (p: IconProps) => <Icon {...p} d="m20 6-11 11-5-5" />,
  Chevron:   (p: IconProps) => <Icon {...p} d="m9 18 6-6-6-6" />,
  ChevronDown:(p: IconProps) => <Icon {...p} d="m6 9 6 6 6-6" />,
  ChevronUp: (p: IconProps) => <Icon {...p} d="m18 15-6-6-6 6" />,
  ArrowUp:   (p: IconProps) => <Icon {...p} d="M12 19V5M5 12l7-7 7 7" />,
  ArrowDown: (p: IconProps) => <Icon {...p} d="M12 5v14M19 12l-7 7-7-7" />,
  ArrowRight:(p: IconProps) => <Icon {...p} d="M5 12h14M12 5l7 7-7 7" />,
  Dots:      (p: IconProps) => <Icon {...p} d={<><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>} />,
  DotsV:     (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></>} />,
  Filter:    (p: IconProps) => <Icon {...p} d="M3 5h18l-7 9v6l-4-2v-4L3 5z" />,
  Sort:      (p: IconProps) => <Icon {...p} d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" />,
  Eye:       (p: IconProps) => <Icon {...p} d={<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></>} />,
  Lock:      (p: IconProps) => <Icon {...p} d={<><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>} />,
  Mail:      (p: IconProps) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>} />,
  Star:      (p: IconProps) => <Icon {...p} fill="currentColor" sw={0} d="m12 2 3 7 7 .8-5.2 4.7 1.5 7L12 17.8 5.7 21.5l1.5-7L2 9.8l7-.8z" />,
  StarO:     (p: IconProps) => <Icon {...p} d="m12 2 3 7 7 .8-5.2 4.7 1.5 7L12 17.8 5.7 21.5l1.5-7L2 9.8l7-.8z" />,
  Heart:     (p: IconProps) => <Icon {...p} d="M12 21s-7-4.5-9.5-9.5C1 8 3 4 7 4c2 0 4 1.5 5 3.5C13 5.5 15 4 17 4c4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />,
  Logout:    (p: IconProps) => <Icon {...p} d="M15 17l5-5-5-5M20 12H9M12 4H5v16h7" />,
  Pin:       (p: IconProps) => <Icon {...p} d={<><path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></>} />,
  Image:     (p: IconProps) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m3 17 5-5 4 4 3-3 6 6"/></>} />,
  Edit:      (p: IconProps) => <Icon {...p} d="M12 20h9M16.5 3.5a2 2 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />,
  Trash:     (p: IconProps) => <Icon {...p} d={<><path d="M3 6h18"/><path d="m5 6 1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2L19 6"/><path d="M10 11v6M14 11v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>} />,
  AI:        (p: IconProps) => <Icon {...p} d={<><path d="M12 2v3M12 19v3M4.2 4.2 6.3 6.3M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8 6.3 17.7M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></>} />,
  Sparkle:   (p: IconProps) => <Icon {...p} d={<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></>} />,
  Calendar:  (p: IconProps) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>} />,
  Clock:     (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  Download:  (p: IconProps) => <Icon {...p} d="M12 3v13M5 12l7 7 7-7M5 21h14" />,
  Upload:    (p: IconProps) => <Icon {...p} d="M12 17V4M5 11l7-7 7 7M5 21h14" />,
  Send:      (p: IconProps) => <Icon {...p} d="m22 2-7 20-4-9-9-4 20-7z" />,
  Globe:     (p: IconProps) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>} />,
  Layers:    (p: IconProps) => <Icon {...p} d="m12 2 10 6-10 6-10-6 10-6zM2 14l10 6 10-6M2 18l10 6 10-6" />,
  Hash:      (p: IconProps) => <Icon {...p} d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />,
  Zap:       (p: IconProps) => <Icon {...p} d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  Refresh:   (p: IconProps) => <Icon {...p} d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />,
  Inbox:     (p: IconProps) => <Icon {...p} d={<><path d="M3 13h6l2 3h2l2-3h6"/><path d="M5 5h14l2 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6l2-8z"/></>} />,
  Flame:     (p: IconProps) => <Icon {...p} d="M12 22c4.4 0 8-3.6 8-8 0-4-3-7-5-9 0 3-2 4-3 4s-2-1-2-3c-2 1-6 4-6 8 0 4.4 3.6 8 8 8z" />,
  Coffee:    (p: IconProps) => <Icon {...p} d={<><path d="M3 8h13v6a5 5 0 0 1-10 0V8M16 11h3a2 2 0 0 1 0 4h-3M5 3v2M9 3v2M13 3v2"/></>} />,
  Pizza:     (p: IconProps) => <Icon {...p} d={<><path d="m12 3 9 7-9 11-9-11 9-7z"/><circle cx="10" cy="11" r="1" fill="currentColor"/><circle cx="13" cy="14" r="1" fill="currentColor"/></>} />,
  External:  (p: IconProps) => <Icon {...p} d="M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />,
  Menu:      (p: IconProps) => <Icon {...p} d="M3 6h18M3 12h18M3 18h18" />,
  Collapse:  (p: IconProps) => <Icon {...p} d="M9 4v16M14 9l-3 3 3 3" />,
};
