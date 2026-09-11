'use client';

import React from 'react';
import { Clock, MapPin, Zap, Route, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { MOCK_SESSIONS } from '@/data/mockData';
import type { SessionStatus } from '@/types';

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatSessionDuration(start: string, end?: string): string {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : new Date('2026-09-10T14:37:43+05:30').getTime();
  const diffMs = e - s;
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  return `${hours}h ${mins}m`;
}

export default function SessionHistoryTable() {
  return (
    <div className="bg-card border border-border rounded-xl card-glow overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Session History</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Your recent recording sessions</p>
        </div>
        <span className="text-[10px] text-muted-foreground">Last 5 sessions</span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr>
              {['Date', 'Route', 'Duration', 'Distance', 'Detections', 'Status', ''].map((col, i) => (
                <th
                  key={`sh-col-${i}`}
                  className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_SESSIONS.map((session) => (
              <tr
                key={`sh-row-${session.id}`}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-foreground">{formatDate(session.startedAt)}</p>
                  <p className="text-[11px] text-muted-foreground">{session.city}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 max-w-[200px]">
                    <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{session.route}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground font-tabular">
                      {formatSessionDuration(session.startedAt, session.endedAt)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Route className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground font-tabular">
                      {session.distanceCovered.toFixed(1)} km
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-sm font-semibold text-primary font-tabular">
                      {session.detectionsCount}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={session.status as SessionStatus} size="sm" />
                </td>
                <td className="px-5 py-3.5">
                  <button
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                    title="View session report"
                    aria-label="View session"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border">
        {MOCK_SESSIONS.map((session) => (
          <div
            key={`sh-mobile-${session.id}`}
            className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{formatDate(session.startedAt)}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[220px]">{session.route}</p>
              </div>
              <StatusBadge status={session.status as SessionStatus} size="sm" />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatSessionDuration(session.startedAt, session.endedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Route className="w-3 h-3" />
                <span>{session.distanceCovered.toFixed(1)} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-primary font-semibold">{session.detectionsCount} detected</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border px-5 py-3 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          {MOCK_SESSIONS.length} sessions shown
        </span>
        <button className="text-[11px] text-primary hover:underline">
          View all sessions
        </button>
      </div>
    </div>
  );
}