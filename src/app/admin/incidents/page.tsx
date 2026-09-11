'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';

import EmptyState from '@/components/ui/EmptyState';
import { eventService } from '@/services/eventService';
import type { DetectedEvent } from '@/types';
import { Shield, AlertTriangle, Ambulance, Users, Clock, CheckCircle, ArrowUp } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const INCIDENT_TIMELINE = [
  { time: '14:31:22', event: 'Incident Detected', done: true },
  { time: '14:31:27', event: 'Vehicle Identified', done: true },
  { time: '14:31:35', event: 'Emergency Alert Sent', done: true },
  { time: '14:33:00', event: 'Team Assigned', done: true },
  { time: '—', event: 'Case Resolved', done: false },
];

export default function IncidentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [incidents, setIncidents] = useState<DetectedEvent[]>([]);
  const [selected, setSelected] = useState<DetectedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [dispatched, setDispatched] = useState<Record<string, string[]>>({});

  useEffect(() => {
    eventService.getEvents().then((data) => {
      const inc = data.filter((e) => e.module === 'INCIDENT');
      setIncidents(inc);
      if (inc.length > 0) setSelected(inc[0]);
      setLoading(false);
    });
  }, []);

  function handleDispatch(incidentId: string, service: string) {
    setDispatched((prev) => ({ ...prev, [incidentId]: [...(prev[incidentId] || []), service] }));
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Incident War Room</h1>
            {incidents.length > 0 && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-severity-critical-bg border border-severity-critical/30 rounded-full text-xs font-semibold text-severity-critical">
                <span className="w-2 h-2 rounded-full bg-severity-critical pulse-dot" /> {incidents.length} Active
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : incidents.length === 0 ? (
            <EmptyState icon={Shield} title="No active incidents" description="All clear — no emergency incidents detected" />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Incident List */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Active Incidents</p>
                </div>
                <div className="divide-y divide-border">
                  {incidents.map((inc) => (
                    <button key={inc.id} onClick={() => setSelected(inc)}
                      className={`w-full p-4 text-left hover:bg-muted/30 transition-colors ${selected?.id === inc.id ? 'bg-primary/10' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-primary">{inc.id}</span>
                        <SeverityBadge severity={inc.severity} size="sm" pulse={inc.severity === 'CRITICAL'} />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{inc.type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{inc.location}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Incident Detail */}
              {selected && (
                <div className="xl:col-span-2 space-y-5">
                  {/* Header */}
                  <div className="bg-severity-critical-bg border border-severity-critical/30 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-severity-critical" />
                        <span className="text-base font-bold text-severity-critical">EMERGENCY INCIDENT</span>
                      </div>
                      <SeverityBadge severity={selected.severity} pulse />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{selected.type.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground mt-1">📍 {selected.location} · 🚌 {selected.vehicleReg} · 🎯 {selected.confidence}% confidence</p>
                  </div>

                  {/* Dispatch */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Emergency Dispatch</h2>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'police', label: 'Police', icon: Shield, color: 'text-primary' },
                        { key: 'ambulance', label: 'Ambulance', icon: AlertTriangle, color: 'text-severity-critical' },
                        { key: 'team', label: 'Emergency Team', icon: Users, color: 'text-severity-high' },
                      ].map(({ key, label, icon: Icon, color }) => {
                        const isDispatched = dispatched[selected.id]?.includes(key);
                        return (
                          <button key={key} onClick={() => !isDispatched && handleDispatch(selected.id, key)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isDispatched ? 'border-severity-low bg-severity-low-bg' : 'border-border hover:border-primary/50'}`}>
                            {isDispatched ? <CheckCircle className="w-6 h-6 text-severity-low" /> : <Icon className={`w-6 h-6 ${color}`} />}
                            <span className="text-xs font-semibold text-foreground">{isDispatched ? 'Dispatched' : `Dispatch ${label}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-card border border-border rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-foreground mb-4">Incident Timeline</h2>
                    <div className="space-y-3">
                      {INCIDENT_TIMELINE.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-primary' : 'bg-muted'}`}>
                            {step.done ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5 text-muted-foreground" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.event}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">{step.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-2.5 btn-secondary rounded-lg text-sm flex items-center justify-center gap-2">
                      <ArrowUp className="w-4 h-4" /> Escalate
                    </button>
                    <a href={`/admin/cases/${selected.caseId || 'new'}`} className="flex-1 py-2.5 btn-primary rounded-lg text-sm flex items-center justify-center gap-2">
                      View Case
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
