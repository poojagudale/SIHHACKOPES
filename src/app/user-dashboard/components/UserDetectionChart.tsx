'use client';

import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { USER_DETECTION_BREAKDOWN } from '@/data/mockData';

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
      <p className="font-semibold text-foreground">{payload[0].payload.type}</p>
      <p className="text-muted-foreground mt-0.5">
        <span className="font-bold text-foreground font-tabular">{payload[0].value}</span> events
      </p>
    </div>
  );
}

const total = USER_DETECTION_BREAKDOWN.reduce((sum, d) => sum + d.count, 0);

export default function UserDetectionChart() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 card-glow h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Today's Detections</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Breakdown by AI module</p>
      </div>

      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="35%"
            outerRadius="85%"
            data={USER_DETECTION_BREAKDOWN}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="count" cornerRadius={4} background={{ fill: 'var(--muted)' }} />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-foreground font-tabular">{total}</span>
          <span className="text-[11px] text-muted-foreground">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {USER_DETECTION_BREAKDOWN.map((item) => (
          <div key={`user-legend-${item.type}`} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
              <span className="text-[11px] text-muted-foreground">{item.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: item.fill,
                  }}
                />
              </div>
              <span className="text-[11px] font-semibold text-foreground font-tabular w-4 text-right">
                {item.count}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}