import React from 'react';
import type { VehicleStatus, SessionStatus, EventStatus, CaseStatus } from '@/types';

type AnyStatus = VehicleStatus | SessionStatus | EventStatus | CaseStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  string,
  { label: string; textClass: string; bgClass: string }
> = {
  OFFLINE: { label: 'Offline', textClass: 'text-muted-foreground', bgClass: 'bg-muted' },
  ONLINE: { label: 'Online', textClass: 'text-status-online', bgClass: 'bg-[rgba(34,197,94,0.1)]' },
  SESSION_ACTIVE: { label: 'Live', textClass: 'text-status-active', bgClass: 'bg-[rgba(0,212,255,0.1)]' },
  MAINTENANCE: { label: 'Maintenance', textClass: 'text-status-maintenance', bgClass: 'bg-[rgba(234,179,8,0.1)]' },
  IDLE: { label: 'Idle', textClass: 'text-muted-foreground', bgClass: 'bg-muted' },
  ACTIVE: { label: 'Active', textClass: 'text-status-active', bgClass: 'bg-[rgba(0,212,255,0.1)]' },
  PAUSED: { label: 'Paused', textClass: 'text-status-maintenance', bgClass: 'bg-[rgba(234,179,8,0.1)]' },
  ENDED: { label: 'Ended', textClass: 'text-muted-foreground', bgClass: 'bg-muted' },
  DETECTED: { label: 'Detected', textClass: 'text-severity-critical', bgClass: 'bg-severity-critical-bg' },
  VERIFIED: { label: 'Verified', textClass: 'text-severity-high', bgClass: 'bg-severity-high-bg' },
  ASSIGNED: { label: 'Assigned', textClass: 'text-primary', bgClass: 'bg-[rgba(0,212,255,0.1)]' },
  RESOLVED: { label: 'Resolved', textClass: 'text-severity-low', bgClass: 'bg-severity-low-bg' },
  DISMISSED: { label: 'Dismissed', textClass: 'text-muted-foreground', bgClass: 'bg-muted' },
  OPEN: { label: 'Open', textClass: 'text-severity-critical', bgClass: 'bg-severity-critical-bg' },
  INVESTIGATING: { label: 'Investigating', textClass: 'text-severity-high', bgClass: 'bg-severity-high-bg' },
  PENDING_REVIEW: { label: 'Pending Review', textClass: 'text-severity-medium', bgClass: 'bg-severity-medium-bg' },
  CLOSED: { label: 'Closed', textClass: 'text-severity-low', bgClass: 'bg-severity-low-bg' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    textClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
  };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${sizeClasses} ${config.bgClass} ${config.textClass}`}
    >
      {config.label}
    </span>
  );
}