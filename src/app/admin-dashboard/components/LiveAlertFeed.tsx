'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { MOCK_EVENTS } from '@/data/mockData';
import type { SeverityLevel, EventStatus } from '@/types';

const EVENT_TYPE_LABELS: Record<string, string> = {
  HIT_AND_RUN: 'Hit & Run',
  POTHOLE: 'Pothole',
  NEAR_MISS: 'Near Miss',
  WRONG_SIDE_DRIVING: 'Wrong-Side Driving',
  WATERLOGGING: 'Waterlogging',
  NO_HELMET: 'No Helmet',
  DAMAGED_MANHOLE: 'Damaged Manhole',
  SIGNAL_VIOLATION: 'Signal Violation',
  CRACK: 'Road Crack',
  MISSING_SIGNAGE: 'Missing Signage',
  HIGH_RISK_ZONE: 'High Risk Zone',
  RASH_DRIVING: 'Rash Driving',
};

function formatIST(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${hours}:${mins} IST, ${day} ${months[date.getMonth()]}`;
}

export default function LiveAlertFeed() {
  const [filter, setFilter] = useState<'ALL' | SeverityLevel>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = filter === 'ALL'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter((e) => e.severity === filter);

  const handleRefresh = () => {
    setRefreshing(true);
    // BACKEND INTEGRATION: re-fetch /api/events?limit=20&sort=detectedAt:desc
    setTimeout(() => setRefreshing(false), 800);
  };

  const FILTER_TABS: Array<'ALL' | SeverityLevel> = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="bg-card border border-border rounded-xl card-glow overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-severity-critical pulse-dot" />
          <h3 className="text-sm font-semibold text-foreground">Live Alert Feed</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-severity-critical-bg text-severity-critical">
            {MOCK_EVENTS.filter((e) => e.status === 'DETECTED').length} New
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Refresh alerts"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-5 py-2.5 border-b border-border overflow-x-auto scrollbar-thin">
        {FILTER_TABS.map((tab) => (
          <button
            key={`alert-filter-${tab}`}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-150 ${
              filter === tab
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <CheckCircle className="w-8 h-8 text-severity-low mb-3" />
            <p className="text-sm font-semibold text-foreground">No {filter !== 'ALL' ? filter.toLowerCase() : ''} alerts</p>
            <p className="text-xs text-muted-foreground mt-1">All clear for this severity level</p>
          </div>
        ) : (
          filtered.map((event) => (
            <div
              key={`alert-${event.id}`}
              className={`flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group ${
                event.severity === 'CRITICAL' ? 'bg-severity-critical-bg/30' : ''
              }`}
            >
              {/* Severity indicator */}
              <div
                className={`w-1.5 flex-shrink-0 self-stretch rounded-full mt-0.5 ${
                  event.severity === 'CRITICAL' ? 'bg-severity-critical' :
                  event.severity === 'HIGH' ? 'bg-severity-high' :
                  event.severity === 'MEDIUM'? 'bg-severity-medium' : 'bg-severity-low'
                }`}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {EVENT_TYPE_LABELS[event.type] ?? event.type}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <SeverityBadge severity={event.severity} size="sm" pulse={event.severity === 'CRITICAL'} />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground truncate mb-1.5">{event.location}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{event.vehicleReg}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-muted-foreground">{formatIST(event.detectedAt)}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[10px] text-primary">{event.confidence}% conf.</span>
                  </div>
                  <StatusBadge status={event.status as EventStatus} size="sm" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="View event details"
                  aria-label="View event"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-severity-low transition-colors"
                  title="Acknowledge alert"
                  aria-label="Acknowledge"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          Showing {filtered.length} of {MOCK_EVENTS.length} events
        </span>
        <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
          View all alerts
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}