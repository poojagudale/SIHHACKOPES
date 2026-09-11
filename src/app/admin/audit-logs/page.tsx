'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { userService } from '@/services/userService';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function AuditLogsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [logs, setLogs] = useState<Array<{ id: string; userId: string; userName: string; action: string; resource: string; resourceType: string; status: string; ipAddress: string; timestamp: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    userService.getAuditLogs().then((data) => { setLogs(data as typeof logs); setLoading(false); });
  }, []);

  const filtered = logs.filter((l) => !search || l.userName.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const actionColors: Record<string, string> = {
    ACKNOWLEDGED: 'text-primary bg-primary/10',
    ASSIGNED: 'text-severity-medium bg-severity-medium-bg',
    ESCALATED: 'text-severity-high bg-severity-high-bg',
    USER_CREATED: 'text-severity-low bg-severity-low-bg',
    SESSION_STARTED: 'text-primary bg-primary/10',
    STATUS_UPDATED: 'text-muted-foreground bg-muted',
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Immutable system activity log</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-5">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search logs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Resource</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">IP Address</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={6} />)
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={6}><EmptyState icon={FileText} title="No logs found" description="No audit logs match your search" /></td></tr>
                  ) : (
                    paginated.map((log) => (
                      <tr key={log.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">{log.userName}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${actionColors[log.action] || 'text-muted-foreground bg-muted'}`}>{log.action}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{log.resource}</td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{log.ipAddress}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-severity-low-bg text-severity-low text-[10px] font-semibold rounded-full">{log.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">{filtered.length} logs · Page {page} of {totalPages}</p>
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
