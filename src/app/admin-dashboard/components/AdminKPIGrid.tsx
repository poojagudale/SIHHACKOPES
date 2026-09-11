'use client';

import React from 'react';
import {
  Car,
  AlertTriangle,
  Construction,
  Camera,
  Users,
  ClipboardCheck,
  Footprints,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface KPICardData {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
  variant: 'default' | 'critical' | 'primary' | 'warning' | 'success';
  span?: 'single' | 'double';
}

const KPI_DATA: KPICardData[] = [
  {
    id: 'kpi-active-vehicles',
    label: 'Active Vehicles',
    value: '34',
    subValue: 'of 47 fleet total',
    trend: 'up',
    trendValue: '+3 from yesterday',
    icon: Car,
    variant: 'primary',
    span: 'double',
  },
  {
    id: 'kpi-critical-alerts',
    label: 'Critical Alerts (1hr)',
    value: '1',
    subValue: 'Unacknowledged',
    trend: 'down',
    trendValue: '−2 from last hour',
    icon: AlertTriangle,
    variant: 'critical',
  },
  {
    id: 'kpi-road-defects',
    label: 'Road Defects Today',
    value: '27',
    subValue: 'Potholes, cracks, flooding',
    trend: 'up',
    trendValue: '+8 vs yesterday',
    icon: Construction,
    variant: 'warning',
  },
  {
    id: 'kpi-traffic-violations',
    label: 'Traffic Violations',
    value: '44',
    subValue: 'Captured today',
    trend: 'down',
    trendValue: '−17 vs yesterday',
    icon: Camera,
    variant: 'default',
  },
  {
    id: 'kpi-pedestrian-events',
    label: 'Pedestrian Events',
    value: '16',
    subValue: 'Near-miss + risk zones',
    trend: 'up',
    trendValue: '+5 vs yesterday',
    icon: Footprints,
    variant: 'warning',
  },
  {
    id: 'kpi-active-sessions',
    label: 'Active Sessions',
    value: '3',
    subValue: 'Live recording now',
    trend: 'neutral',
    trendValue: 'Same as 1hr ago',
    icon: Activity,
    variant: 'primary',
  },
  {
    id: 'kpi-open-cases',
    label: 'Open Cases',
    value: '12',
    subValue: '3 pending review',
    trend: 'up',
    trendValue: '+2 since morning',
    icon: ClipboardCheck,
    variant: 'default',
  },
  {
    id: 'kpi-resolution-rate',
    label: 'Case Resolution Rate',
    value: '87%',
    subValue: '7-day rolling average',
    trend: 'up',
    trendValue: '+4% this week',
    icon: Users,
    variant: 'success',
  },
];

const VARIANT_STYLES: Record<string, { card: string; icon: string; value: string }> = {
  default: {
    card: 'bg-card border-border',
    icon: 'bg-muted text-muted-foreground',
    value: 'text-foreground',
  },
  critical: {
    card: 'bg-severity-critical-bg border-severity-critical/30 card-glow-critical',
    icon: 'bg-severity-critical/20 text-severity-critical',
    value: 'text-severity-critical',
  },
  primary: {
    card: 'bg-[rgba(0,212,255,0.04)] border-[rgba(0,212,255,0.2)] card-glow-primary',
    icon: 'bg-primary/20 text-primary',
    value: 'text-primary',
  },
  warning: {
    card: 'bg-severity-medium-bg border-severity-medium/20',
    icon: 'bg-severity-medium/20 text-severity-medium',
    value: 'text-severity-medium',
  },
  success: {
    card: 'bg-severity-low-bg border-severity-low/20',
    icon: 'bg-severity-low/20 text-severity-low',
    value: 'text-severity-low',
  },
};

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
  if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
}

export default function AdminKPIGrid() {
  // Grid plan: 8 cards → grid-cols-4 → row 1: hero spans 2 cols + 2 regular, row 2: 4 regular
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {KPI_DATA.map((kpi) => {
        const styles = VARIANT_STYLES[kpi.variant];
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`rounded-xl border p-5 flex flex-col gap-3 transition-all duration-200 hover:translate-y-[-1px] card-glow ${styles.card} ${
              kpi.span === 'double' ? 'sm:col-span-2' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                  {kpi.label}
                </p>
                {kpi.subValue && (
                  <p className="text-[11px] text-muted-foreground">{kpi.subValue}</p>
                )}
              </div>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 ${styles.icon}`}>
                <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
              </div>
            </div>

            <p className={`text-4xl font-bold font-tabular leading-none ${styles.value}`}>
              {kpi.value}
            </p>

            <div className={`flex items-center gap-1 text-[11px] font-medium ${
              kpi.trend === 'up' ? 'text-severity-low' :
              kpi.trend === 'down'? 'text-severity-critical' : 'text-muted-foreground'
            }`}>
              <TrendIcon trend={kpi.trend} />
              <span>{kpi.trendValue}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}