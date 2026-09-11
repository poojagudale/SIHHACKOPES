'use client';

import React, { useState, useEffect } from 'react';
import { Activity, MapPin, Clock, Zap, Square, Play, Pause } from 'lucide-react';
import { MOCK_SESSIONS } from '@/data/mockData';

function formatDuration(startIso: string): string {
  const start = new Date(startIso).getTime();
  const now = new Date('2026-09-10T14:37:43+05:30').getTime();
  const diffMs = now - start;
  const hours = Math.floor(diffMs / 3600000);
  const mins = Math.floor((diffMs % 3600000) / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function SessionHeroCard() {
  const session = MOCK_SESSIONS[0];
  const [duration, setDuration] = useState(formatDuration(session.startedAt));
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) setDuration(formatDuration(session.startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, session.startedAt]);

  const isActive = session.status === 'ACTIVE';

  return (
    <div className="relative bg-gradient-to-br from-[rgba(0,212,255,0.08)] via-card to-card border border-[rgba(0,212,255,0.25)] rounded-2xl p-6 overflow-hidden card-glow-primary">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 blob-primary opacity-30 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        {/* Status icon */}
        <div className="flex-shrink-0">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-primary/20' : 'bg-muted'
          }`}>
            <Activity className={`w-8 h-8 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>

        {/* Session info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isActive && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
                Live Session
              </span>
            )}
            {!isActive && (
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                Session Idle
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{session.route}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono font-semibold text-foreground font-tabular">{duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{session.city}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>
                <span className="font-semibold text-foreground font-tabular">{session.detectionsCount}</span> detections
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground font-tabular">{session.distanceCovered.toFixed(1)}</span> km covered
              </span>
            </div>
          </div>
        </div>

        {/* Session controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isActive && (
            <>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-secondary text-sm font-semibold"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-severity-critical-bg border border-severity-critical/30 text-severity-critical text-sm font-semibold hover:bg-severity-critical/20 transition-colors">
                <Square className="w-4 h-4" />
                End Session
              </button>
            </>
          )}
          {!isActive && (
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary text-sm font-semibold">
              <Play className="w-4 h-4" />
              Start Session
            </button>
          )}
        </div>
      </div>

      {/* AI status bar */}
      {isActive && (
        <div className="relative z-10 mt-5 pt-4 border-t border-[rgba(0,212,255,0.15)] flex flex-wrap gap-4">
          {[
            { label: 'Road Defect AI', active: true },
            { label: 'Traffic Monitor', active: true },
            { label: 'Pedestrian Safety', active: true },
            { label: 'Incident Detection', active: !isPaused },
          ].map((mod) => (
            <div key={`ai-mod-${mod.label}`} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${mod.active && !isPaused ? 'bg-primary pulse-dot' : 'bg-muted-foreground'}`} />
              <span className={`text-[11px] font-medium ${mod.active && !isPaused ? 'text-primary' : 'text-muted-foreground'}`}>
                {mod.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}