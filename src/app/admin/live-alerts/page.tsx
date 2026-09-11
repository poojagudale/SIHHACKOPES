'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { AlertItemSkeleton } from '@/components/ui/LoadingSkeleton';
import { eventService } from '@/services/eventService';
import { wsService } from '@/services/websocketService';
import type { DetectedEvent } from '@/types';
import { Bell, CheckCircle, Eye, ArrowUp, AlertTriangle } from 'lucide-react';

export default function LiveAlertsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alerts, setAlerts] = useState<DetectedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  useEffect(() => {
    eventService.getEvents().then((data) => {
      setAlerts(data.sort((a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()));
      setLoading(false);
    });
    wsService.connect();
    const onNew = (msg: { payload: Record<string, unknown> }) => {
      setAlerts((prev) => [msg.payload as unknown as DetectedEvent, ...prev]);
    };
    wsService.on('NEW_EVENT', onNew);
    return () => { wsService.off('NEW_EVENT', onNew); };
  }, []);

  async function handleAcknowledge(id: string) {
    await eventService.acknowledgeEvent(id);
    setAcknowledged((prev) => new Set([...prev, id]));
  }

  const filtered = filter === 'All' ? alerts : alerts.filter((a) => a.module === filter);
  const unreadCount = alerts.filter((a) => !acknowledged.has(a.id) && a.severity === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Live Alerts</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-severity-critical text-white text-xs font-bold rounded-full pulse-dot">{unreadCount} Critical</span>
              )}
            </div>
            <div className="flex gap-2">
              {['All', 'ROAD_DEFECT', 'TRAFFIC_VIOLATION', 'PEDESTRIAN_SAFETY', 'INCIDENT'].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${filter === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                  {f === 'All' ? 'All' : f.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }, (_, i) => <AlertItemSkeleton key={i} />)
            ) : filtered.length === 0 ? (
              <EmptyState icon={Bell} title="No alerts" description="All clear — no active alerts" />
            ) : (
              filtered.map((alert) => {
                const isAcked = acknowledged.has(alert.id);
                return (
                  <div key={alert.id}
                    className={`bg-card border rounded-xl p-4 flex items-start gap-4 transition-all ${alert.severity === 'CRITICAL' && !isAcked ? 'border-severity-critical/50 bg-severity-critical-bg/30' : 'border-border'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.severity === 'CRITICAL' ? 'bg-severity-critical-bg' : 'bg-muted'}`}>
                      <AlertTriangle className={`w-5 h-5 ${alert.severity === 'CRITICAL' ? 'text-severity-critical' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm font-semibold text-foreground">{alert.type.replace(/_/g, ' ')}</span>
                        <SeverityBadge severity={alert.severity} size="sm" />
                        <StatusBadge status={alert.status} size="sm" />
                        {isAcked && <span className="text-[10px] text-severity-low font-semibold">✓ Acknowledged</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{alert.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>📍 {alert.location}</span>
                        <span>🚌 {alert.vehicleReg}</span>
                        <span>🎯 {alert.confidence}% confidence</span>
                        <span>🕐 {new Date(alert.detectedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isAcked && (
                        <button onClick={() => handleAcknowledge(alert.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 btn-secondary rounded-lg text-xs">
                          <CheckCircle className="w-3.5 h-3.5" /> Ack
                        </button>
                      )}
                      <a href={`/admin/cases/${alert.caseId || 'new'}`} className="flex items-center gap-1.5 px-3 py-1.5 btn-secondary rounded-lg text-xs">
                        <Eye className="w-3.5 h-3.5" /> View
                      </a>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 btn-secondary rounded-lg text-xs">
                        <ArrowUp className="w-3.5 h-3.5" /> Escalate
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
