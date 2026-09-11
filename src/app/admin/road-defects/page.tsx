'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { eventService } from '@/services/eventService';
import type { DetectedEvent } from '@/types';
import { Search, AlertTriangle, Eye, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

const REPAIR_COSTS: Record<string, { min: number; max: number; method: string; area: string }> = {
  POTHOLE: { min: 2500, max: 4000, method: 'Patch Filling', area: '0.5–1.2 m²' },
  CRACK: { min: 1500, max: 3000, method: 'Crack Sealing', area: '2–5 m' },
  WATERLOGGING: { min: 8000, max: 25000, method: 'Drainage Repair', area: '10–50 m²' },
  MISSING_SIGNAGE: { min: 3000, max: 8000, method: 'Sign Installation', area: 'N/A' },
  DAMAGED_MANHOLE: { min: 5000, max: 15000, method: 'Manhole Replacement', area: 'N/A' },
};

const PAGE_SIZE = 8;

export default function RoadDefectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [events, setEvents] = useState<DetectedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    eventService.getEvents().then((data) => {
      setEvents(data.filter((e) => e.module === 'ROAD_DEFECT'));
      setLoading(false);
    });
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = !search || e.location.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchSev = severity === 'All' || e.severity === severity;
    const matchStat = status === 'All' || e.status === status;
    return matchSearch && matchSev && matchStat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalEstCost = filtered.reduce((sum, e) => {
    const cost = REPAIR_COSTS[e.type];
    return sum + (cost ? (cost.min + cost.max) / 2 : 3000);
  }, 0);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Road Defects</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} defects · Est. repair cost: ₹{totalEstCost.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search defects..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }}>
              {['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {['All', 'DETECTED', 'VERIFIED', 'ASSIGNED', 'RESOLVED'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Event ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Est. Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Repair Method</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={9} />)
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={9}><EmptyState icon={AlertTriangle} title="No road defects" description="No defects match your filters" /></td></tr>
                  ) : (
                    paginated.map((evt) => {
                      const cost = REPAIR_COSTS[evt.type] || { min: 2000, max: 5000, method: 'Assessment Required', area: 'N/A' };
                      return (
                        <tr key={evt.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-primary">{evt.id}</td>
                          <td className="px-4 py-3 text-xs text-foreground">{evt.type.replace(/_/g, ' ')}</td>
                          <td className="px-4 py-3"><SeverityBadge severity={evt.severity} size="sm" /></td>
                          <td className="px-4 py-3 text-xs text-foreground">{evt.confidence}%</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{evt.location}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{cost.min.toLocaleString('en-IN')}–₹{cost.max.toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{cost.method}</td>
                          <td className="px-4 py-3"><StatusBadge status={evt.status} size="sm" /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <a href={`/admin/cases/${evt.caseId || 'new'}`} className="p-1.5 rounded-lg btn-secondary" title="View"><Eye className="w-3.5 h-3.5" /></a>
                              <button className="p-1.5 rounded-lg btn-secondary" title="Assign"><UserPlus className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">{filtered.length} defects · Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg btn-secondary disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg btn-secondary disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
