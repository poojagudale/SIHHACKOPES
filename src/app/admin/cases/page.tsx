'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { caseService } from '@/services/caseService';
import { Search, ClipboardList, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE = 8;

export default function CasesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cases, setCases] = useState<Array<{ id: string; eventId: string; title: string; status: string; severity: string; assignedTo?: string; createdAt: string; updatedAt: string; notes: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [severity, setSeverity] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    caseService.getCases().then((data) => { setCases(data as typeof cases); setLoading(false); });
  }, []);

  const filtered = cases.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'All' || c.status === status;
    const matchSev = severity === 'All' || c.severity === severity;
    return matchSearch && matchStatus && matchSev;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Case Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} cases</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search cases..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              {['All', 'OPEN', 'INVESTIGATING', 'PENDING_REVIEW', 'CLOSED'].map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }}>
              {['All', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Case ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={7} />)
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState icon={ClipboardList} title="No cases found" description="No cases match your filters" /></td></tr>
                  ) : (
                    paginated.map((c) => (
                      <tr key={c.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-primary">{c.id}</td>
                        <td className="px-4 py-3 text-xs font-medium text-foreground max-w-[200px] truncate">{c.title}</td>
                        <td className="px-4 py-3"><SeverityBadge severity={c.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} size="sm" /></td>
                        <td className="px-4 py-3"><StatusBadge status={c.status as 'OPEN' | 'INVESTIGATING' | 'PENDING_REVIEW' | 'CLOSED'} size="sm" /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{c.assignedTo || '—'}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' })}</td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/cases/${c.id}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">{filtered.length} cases · Page {page} of {totalPages}</p>
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
