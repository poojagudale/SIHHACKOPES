'use client';

import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { MOCK_EVENTS } from '@/data/mockData';

const EVENT_TYPE_LABELS: Record<string, string> = {
  HIT_AND_RUN: 'Hit & Run',
  POTHOLE: 'Pothole',
  NEAR_MISS: 'Near Miss',
  WRONG_SIDE_DRIVING: 'Wrong-Side Driving',
  WATERLOGGING: 'Waterlogging',
  NO_HELMET: 'No Helmet',
  DAMAGED_MANHOLE: 'Damaged Manhole',
  SIGNAL_VIOLATION: 'Signal Violation',
};

const MODULE_COLORS: Record<string, string> = {
  ROAD_DEFECT: 'text-chart-1',
  TRAFFIC_VIOLATION: 'text-chart-2',
  PEDESTRIAN_SAFETY: 'text-chart-3',
  INCIDENT: 'text-chart-4',
};

const MODULE_LABELS: Record<string, string> = {
  ROAD_DEFECT: 'Road Defect',
  TRAFFIC_VIOLATION: 'Traffic',
  PEDESTRIAN_SAFETY: 'Pedestrian',
  INCIDENT: 'Incident',
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins} IST`;
}

// Show driver's own events only (vehicle MH09AB1234)
const DRIVER_EVENTS = MOCK_EVENTS.filter((e) => e.vehicleReg === 'MH09AB1234');

export default function RecentEventsList() {
  return (
    <div className="bg-card border border-border rounded-xl card-glow overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Recent Detections</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Events from your current session</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          MH09AB1234
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
        {DRIVER_EVENTS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <p className="text-sm font-semibold text-foreground">No detections yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start a session to begin AI detection</p>
          </div>
        ) : (
          DRIVER_EVENTS.map((event) => (
            <div
              key={`driver-evt-${event.id}`}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              {/* Module color bar */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.severity === 'CRITICAL' ? 'bg-severity-critical' :
                    event.severity === 'HIGH' ? 'bg-severity-high' :
                    event.severity === 'MEDIUM'? 'bg-severity-medium' : 'bg-severity-low'
                  }`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {EVENT_TYPE_LABELS[event.type] ?? event.type}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <p className="text-[11px] text-muted-foreground truncate">{event.location}</p>
                    </div>
                  </div>
                  <SeverityBadge severity={event.severity} size="sm" />
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-[10px] font-semibold ${MODULE_COLORS[event.module]}`}>
                    {MODULE_LABELS[event.module]}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{formatTime(event.detectedAt)}</span>
                  <span className="text-[10px] text-primary">{event.confidence}% conf.</span>
                </div>
              </div>

              <button
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                title="View event details"
                aria-label="View event"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-border px-5 py-3">
        <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
          View full detection history
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}