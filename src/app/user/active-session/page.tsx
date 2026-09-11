'use client';

import React, { useState, useEffect, useCallback } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { sessionService } from '@/services/sessionService';
import { locationService, GpsLocation } from '@/services/locationService';

import { MOCK_EVENTS } from '@/data/mockData';
import type { DetectedEvent, Session } from '@/types';
import { Play, Square, Flag, MapPin, Camera, Wifi, Upload, Clock, Navigation, AlertTriangle, Car, Footprints, Shield, CheckCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type SessionState = 'IDLE' | 'ACTIVE' | 'ENDED';

export default function ActiveSessionPage() {
  const [sessionState, setSessionState] = useState<SessionState>('IDLE');
  const [session, setSession] = useState<Session | null>(null);
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [liveEvents, setLiveEvents] = useState<DetectedEvent[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [summary, setSummary] = useState<Session | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (sessionState === 'ACTIVE') {
      timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [sessionState]);

  useEffect(() => {
    if (sessionState !== 'ACTIVE') return;
    const onLocation = (loc: GpsLocation) => {
      setLocation(loc);
      setDistance((d) => d + 0.003);
    };
    locationService.startWatching(onLocation, 5000);
    return () => locationService.stopWatching(onLocation);
  }, [sessionState]);

  // Demo: add events periodically
  useEffect(() => {
    if (sessionState !== 'ACTIVE') return;
    let timer = setInterval(() => {
      const evt = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
      setLiveEvents((prev) => [{ ...evt, id: `live-${Date.now()}`, detectedAt: new Date().toISOString() }, ...prev.slice(0, 9)]);
    }, 12000);
    return () => clearInterval(timer);
  }, [sessionState]);

  async function handleStart() {
    const loc = await locationService.getCurrentLocation();
    setLocation(loc);
    const s = await sessionService.startSession({ vehicleId: 'veh-001', cameraSource: 'PHONE', lat: loc.lat, lng: loc.lng });
    setSession(s);
    setSessionState('ACTIVE');
    setElapsed(0);
    setDistance(0);
    setLiveEvents([]);
  }

  async function handleEnd() {
    if (!session) return;
    const ended = await sessionService.endSession(session.id);
    setSummary({ ...ended, distanceCovered: parseFloat(distance.toFixed(1)), detectionsCount: liveEvents.length });
    setSessionState('ENDED');
    locationService.stopWatching();
  }

  function formatTime(s: number) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  const counters = {
    roadDefects: liveEvents.filter((e) => e.module === 'ROAD_DEFECT').length,
    trafficViolations: liveEvents.filter((e) => e.module === 'TRAFFIC_VIOLATION').length,
    pedestrianRisks: liveEvents.filter((e) => e.module === 'PEDESTRIAN_SAFETY').length,
    incidents: liveEvents.filter((e) => e.module === 'INCIDENT').length,
  };

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Active Session</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Real-time monitoring · Vehicle MH09AB1234</p>
            </div>
            {sessionState === 'IDLE' && (
              <button onClick={handleStart} className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-lg text-sm font-semibold">
                <Play className="w-4 h-4" /> Start Session
              </button>
            )}
            {sessionState === 'ACTIVE' && (
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg text-sm">
                  <Flag className="w-4 h-4" /> Flag Event
                </button>
                <button onClick={handleEnd} className="flex items-center gap-2 px-4 py-2 bg-severity-critical text-white rounded-lg text-sm font-semibold hover:opacity-90">
                  <Square className="w-4 h-4" /> End Trip
                </button>
              </div>
            )}
          </div>

          {/* Trip Summary */}
          {sessionState === 'ENDED' && summary && (
            <div className="bg-severity-low-bg border border-severity-low/30 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-severity-low" />
                <h2 className="text-base font-semibold text-severity-low">Trip Completed</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Duration', value: formatTime(elapsed) },
                  { label: 'Distance', value: `${summary.distanceCovered} km` },
                  { label: 'Events', value: summary.detectionsCount },
                  { label: 'Status', value: 'Uploaded' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSessionState('IDLE'); setSummary(null); }} className="mt-4 btn-secondary px-4 py-2 rounded-lg text-sm">
                Start New Session
              </button>
            </div>
          )}

          {/* Session Status Bar */}
          {sessionState !== 'ENDED' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">
              {[
                { icon: Clock, label: 'Duration', value: formatTime(elapsed), active: sessionState === 'ACTIVE' },
                { icon: Navigation, label: 'Distance', value: `${distance.toFixed(1)} km`, active: sessionState === 'ACTIVE' },
                { icon: MapPin, label: 'GPS', value: location ? 'Active' : 'Searching', active: !!location },
                { icon: Camera, label: 'Camera', value: sessionState === 'ACTIVE' ? 'Active' : 'Idle', active: sessionState === 'ACTIVE' },
                { icon: Wifi, label: 'Internet', value: 'Connected', active: true },
                { icon: Upload, label: 'Queue', value: `${liveEvents.length} items`, active: true },
                { icon: AlertTriangle, label: 'Events', value: liveEvents.length, active: liveEvents.length > 0 },
                { icon: Shield, label: 'Session', value: sessionState, active: sessionState === 'ACTIVE' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1 text-center">
                    <Icon className={`w-4 h-4 ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-xs font-bold text-foreground">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {sessionState !== 'ENDED' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Camera Area */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Camera Feed</span>
                    {sessionState === 'ACTIVE' && (
                      <span className="flex items-center gap-1.5 text-xs text-severity-critical font-semibold">
                        <span className="w-2 h-2 rounded-full bg-severity-critical pulse-dot" /> LIVE
                      </span>
                    )}
                  </div>
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {sessionState === 'ACTIVE' ? (
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                          <Camera className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">Demo Mode — AI Detection Active</p>
                        <p className="text-xs text-muted-foreground mt-1">Connect real camera for live feed</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Start a session to begin monitoring</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detection Counters */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: AlertTriangle, label: 'Road Defects', count: counters.roadDefects, color: 'text-severity-high' },
                    { icon: Car, label: 'Traffic', count: counters.trafficViolations, color: 'text-severity-medium' },
                    { icon: Footprints, label: 'Pedestrian', count: counters.pedestrianRisks, color: 'text-primary' },
                    { icon: Shield, label: 'Incidents', count: counters.incidents, color: 'text-severity-critical' },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <div key={c.label} className="bg-card border border-border rounded-xl p-3 text-center">
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${c.color}`} />
                        <p className="text-2xl font-bold text-foreground">{c.count}</p>
                        <p className="text-[10px] text-muted-foreground">{c.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Event Feed */}
              <div className="bg-card border border-border rounded-xl flex flex-col">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Live Event Feed</span>
                </div>
                <div className="flex-1 overflow-y-auto max-h-96">
                  {liveEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <AlertTriangle className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">{sessionState === 'ACTIVE' ? 'Monitoring... Events will appear here' : 'No active session'}</p>
                    </div>
                  ) : (
                    liveEvents.map((evt) => (
                      <div key={evt.id} className="flex items-start gap-3 p-3 border-b border-border last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">{evt.type.replace(/_/g, ' ')}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{evt.location}</p>
                          <p className="text-[10px] text-muted-foreground">Conf: {evt.confidence}%</p>
                        </div>
                        <SeverityBadge severity={evt.severity} size="sm" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
