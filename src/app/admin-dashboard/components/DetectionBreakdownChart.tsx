'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from 'recharts';
import { MODULE_BREAKDOWN_DATA } from '@/data/mockData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-bold text-foreground font-tabular">{payload[0].value}</span> events
      </p>
    </div>
  );
}

export default function DetectionBreakdownChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 card-glow h-full">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">Module Breakdown</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Total detections by AI module — all time</p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={MODULE_BREAKDOWN_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="module"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) => v.split(' ')[0]}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {MODULE_BREAKDOWN_DATA.map((entry) => (
              <Cell key={`cell-${entry.module}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {MODULE_BREAKDOWN_DATA.map((item) => (
          <div key={`legend-${item.module}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.fill }} />
              <span className="text-[11px] text-muted-foreground">{item.module}</span>
            </div>
            <span className="text-[11px] font-semibold text-foreground font-tabular">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}