'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { eventService } from '@/services/eventService';
import { demoProvider } from '@/services/demoProvider';
import type { DetectedEvent } from '@/types';
import { Footprints, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export default function PedestrianSafetyPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [events, setEvents] = useState<DetectedEvent[]>([]);
  const [hotspots, setHotspots] = useState<Array<{ id: string; location: string; riskScore: number; incidentCount: number; recommendation: string; status: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      eventService.getEvents(),
      demoProvider.getPedestrianData(),
    ]).then(([evts, ped]) => {
      setEvents(evts.filter((e) => e.module === 'PEDESTRIAN_SAFETY'));
      setHotspots(ped);
      setLoading(false);
    });
  }, []);

  const avgRisk = hotspots.length ? Math.round(hotspots.reduce((s, h) => s + h.riskScore, 0) / hotspots.length) : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Pedestrian Safety</h1>
            <p className="text-sm text-muted-foreground mt-0.5">High-risk zones and safety recommendations</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'High Risk Zones', value: hotspots.filter((h) => h.riskScore > 70).length, icon: AlertTriangle, color: 'text-severity-critical' },
              { label: 'Near Miss Events', value: events.length, icon: Footprints, color: 'text-severity-high' },
              { label: 'Avg Risk Score', value: `${avgRisk}/100`, icon: AlertTriangle, color: 'text-severity-medium' },
              { label: 'Recommendations', value: hotspots.length, icon: CheckCircle, color: 'text-severity-low' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
                  <Icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* High Risk Locations */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">High Risk Locations</h2>
              </div>
              <div className="divide-y divide-border">
                {loading ? (
                  <div className="p-5 text-center text-sm text-muted-foreground">Loading...</div>
                ) : hotspots.map((h) => (
                  <div key={h.id} className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-severity-high-bg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-severity-high" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{h.location}</p>
                        <SeverityBadge severity={h.severity} size="sm" />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                        <span>Risk Score: <strong className="text-foreground">{h.riskScore}/100</strong></span>
                        <span>{h.incidentCount} incidents</span>
                      </div>
                      {/* Risk bar */}
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-severity-high" style={{ width: `${h.riskScore}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Safety Recommendations</h2>
              </div>
              <div className="divide-y divide-border">
                {hotspots.map((h) => (
                  <div key={`rec-${h.id}`} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{h.recommendation}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.location}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${h.status === 'COMPLETED' ? 'bg-severity-low-bg text-severity-low' : h.status === 'IN_REVIEW' ? 'bg-severity-medium-bg text-severity-medium' : 'bg-muted text-muted-foreground'}`}>
                        {h.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={h.severity} size="sm" />
                      <span className="text-xs text-muted-foreground">{h.incidentCount} supporting events</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="mt-6 bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Recent Pedestrian Events</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Event ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id} className="border-b border-border hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs text-primary">{evt.id}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{evt.type.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3"><SeverityBadge severity={evt.severity} size="sm" /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{evt.location}</td>
                      <td className="px-4 py-3 text-xs text-foreground">{evt.confidence}%</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(evt.detectedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
