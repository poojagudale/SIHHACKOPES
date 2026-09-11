import React from 'react';
import type { SeverityLevel } from '@/types';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { label: string; textClass: string; bgClass: string; dotClass: string }
> = {
  LOW: {
    label: 'LOW',
    textClass: 'text-severity-low',
    bgClass: 'bg-severity-low-bg',
    dotClass: 'bg-severity-low',
  },
  MEDIUM: {
    label: 'MEDIUM',
    textClass: 'text-severity-medium',
    bgClass: 'bg-severity-medium-bg',
    dotClass: 'bg-severity-medium',
  },
  HIGH: {
    label: 'HIGH',
    textClass: 'text-severity-high',
    bgClass: 'bg-severity-high-bg',
    dotClass: 'bg-severity-high',
  },
  CRITICAL: {
    label: 'CRITICAL',
    textClass: 'text-severity-critical',
    bgClass: 'bg-severity-critical-bg',
    dotClass: 'bg-severity-critical',
  },
};

export default function SeverityBadge({ severity, size = 'md', pulse = false }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide ${sizeClasses} ${config.bgClass} ${config.textClass}`}
      style={{ border: `1px solid currentColor`, borderColor: 'transparent', opacity: 1 }}
    >
      <span
        className={`rounded-full flex-shrink-0 ${config.dotClass} ${pulse && severity === 'CRITICAL' ? 'pulse-dot' : ''}`}
        style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6 }}
      />
      {config.label}
    </span>
  );
}