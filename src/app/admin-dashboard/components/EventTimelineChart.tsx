'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { DETECTION_TREND_DATA } from '@/data/mockData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={`tooltip-${entry.dataKey}`} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{String(entry.dataKey).replace(/([A-Z])/g, ' $1')}</span>
          </div>
          <span className="font-semibold text-foreground font-tabular">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function EventTimelineChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 card-glow h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Detection Timeline</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Events by module — last 7 days</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
          7D
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={DETECTION_TREND_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradRoad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradTraffic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradPed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            formatter={(value: string) => (
              <span style={{ color: 'var(--muted-foreground)' }}>
                {value.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            )}
          />
          <Area type="monotone" dataKey="roadDefects" name="roadDefects" stroke="var(--chart-1)" fill="url(#gradRoad)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="trafficViolations" name="trafficViolations" stroke="var(--chart-2)" fill="url(#gradTraffic)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="pedestrianSafety" name="pedestrianSafety" stroke="var(--chart-3)" fill="url(#gradPed)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="incidents" name="incidents" stroke="var(--chart-4)" fill="url(#gradInc)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}