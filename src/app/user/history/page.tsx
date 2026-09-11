'use client';

import React, { useState, useEffect } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { eventService } from '@/services/eventService';
import type { DetectedEvent } from '@/types';
import { Search, ChevronLeft, ChevronRight, FileText, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['All', 'ROAD_DEFECT', 'TRAFFIC_VIOLATION', 'PEDESTRIAN_SAFETY', 'INCIDENT'];
const SEVERITIES = ['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const STATUSES = ['All', 'DETECTED', 'VERIFIED', 'ASSIGNED', 'RESOLVED', 'DISMISSED'];
const PAGE_SIZE = 8;

export default function ReportHistoryPage() {
  const [events, setEvents] = useState<DetectedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    eventService.getEvents().then((data) => { setEvents(data); setLoading(false); });
  }, []);

  const filtered = events.filter((e) => {
    const matchSearch = !search || e.location.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || e.module === category;
    const matchSev = severity === 'All' || e.severity === severity;
    const matchStat = status === 'All' || e.status === status;
    return matchSearch && matchCat && matchSev && matchStat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Report History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">All AI-detected and manually submitted reports</p>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-xl p-4 mb-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search by ID, location, type..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
              </div>
              <select className="input-field px-3 py-2 rounded-lg text-sm" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c.replace(/_/g, ' ')}</option>)}
              </select>
              <select className="input-field px-3 py-2 rounded-lg text-sm" value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }}>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Severities' : s}</option>)}
              </select>
              <select className="input-field px-3 py-2 rounded-lg text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Report ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={7} />)
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState icon={FileText} title="No reports found" description="Try adjusting your filters" /></td></tr>
                  ) : (
                    paginated.map((evt) => (
                      <tr key={evt.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-primary">{evt.id}</td>
                        <td className="px-4 py-3 text-xs text-foreground">{evt.module.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3"><SeverityBadge severity={evt.severity} size="sm" /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{evt.location}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(evt.detectedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-4 py-3"><StatusBadge status={evt.status} size="sm" /></td>
                        <td className="px-4 py-3">
                          <Link href={`/user/report/${evt.id}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">{filtered.length} reports · Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg btn-secondary disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg btn-secondary disabled:opacity-40">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
