'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { analyticsService } from '@/services/analyticsService';
import { DETECTION_TREND_DATA, MODULE_BREAKDOWN_DATA } from '@/data/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, AlertTriangle, Car, Footprints, Shield, CheckCircle, BarChart3 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export default function AnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState<Record<string, number> | null>(null);
  const [hotspots, setHotspots] = useState<Array<{ rank: number; location: string; eventCount: number; riskScore: number; category: string }>>([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsService.getDashboard(), analyticsService.getHotspots()]).then(([dash, hot]) => {
      setDashboard(dash);
      setHotspots(hot);
      setLoading(false);
    });
  }, []);

  const kpis = dashboard ? [
    { label: 'Total Reports', value: dashboard.totalReports, icon: BarChart3, color: 'text-primary' },
    { label: 'Road Defects', value: dashboard.todayDefects, icon: AlertTriangle, color: 'text-severity-high' },
    { label: 'Traffic Violations', value: dashboard.trafficViolations, icon: Car, color: 'text-severity-medium' },
    { label: 'Pedestrian Risks', value: dashboard.pedestrianRisks, icon: Footprints, color: 'text-primary' },
    { label: 'Open Cases', value: dashboard.openCases, icon: Shield, color: 'text-severity-critical' },
    { label: 'Resolved Cases', value: dashboard.resolvedCases, icon: CheckCircle, color: 'text-severity-low' },
    { label: 'Open Incidents', value: dashboard.openIncidents, icon: Shield, color: 'text-severity-critical' },
    { label: 'Est. Repair Cost', value: `₹${(dashboard.estimatedRepairCost / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-severity-medium' },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Urban intelligence insights</p>
            </div>
            <div className="flex gap-2">
              {['today', 'week', 'month'].map((r) => (
                <button key={r} onClick={() => setTimeRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${timeRange === r ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                  {r === 'today' ? 'Today' : r === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {loading ? (
              Array.from({ length: 8 }, (_, i) => <div key={i} className="bg-card border border-border rounded-xl p-4 h-20 skeleton-shimmer" />)
            ) : (
              kpis.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="bg-card border border-border rounded-xl p-4">
                    <Icon className={`w-4 h-4 mb-2 ${kpi.color}`} />
                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
            {/* Event Trend */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Event Trend (7 Days)</h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DETECTION_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="roadDefects" stroke="var(--chart-1)" strokeWidth={2} dot={false} name="Road Defects" />
                  <Line type="monotone" dataKey="trafficViolations" stroke="var(--chart-2)" strokeWidth={2} dot={false} name="Traffic" />
                  <Line type="monotone" dataKey="pedestrianSafety" stroke="var(--chart-3)" strokeWidth={2} dot={false} name="Pedestrian" />
                  <Line type="monotone" dataKey="incidents" stroke="var(--chart-4)" strokeWidth={2} dot={false} name="Incidents" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Module Breakdown */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Category Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={MODULE_BREAKDOWN_DATA} dataKey="count" nameKey="module" cx="50%" cy="50%" outerRadius={80} label={({ module, percent }) => `${module?.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {MODULE_BREAKDOWN_DATA.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Daily Detection Volume</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={DETECTION_TREND_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                  <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="roadDefects" fill="var(--chart-1)" name="Road Defects" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="trafficViolations" fill="var(--chart-2)" name="Traffic" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hotspots */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Top Hotspots</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">#</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Location</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Events</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hotspots.map((h) => (
                      <tr key={h.rank} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-2.5 text-xs font-bold text-primary">#{h.rank}</td>
                        <td className="px-4 py-2.5 text-xs text-foreground">{h.location}</td>
                        <td className="px-4 py-2.5 text-xs font-semibold text-foreground">{h.eventCount}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-1.5"><div className="h-1.5 rounded-full bg-severity-high" style={{ width: `${h.riskScore}%` }} /></div>
                            <span className="text-xs text-foreground">{h.riskScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
