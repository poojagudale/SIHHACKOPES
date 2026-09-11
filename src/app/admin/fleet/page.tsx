'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types';
import { Search, Navigation, Eye, Battery, X } from 'lucide-react';

function DeviceHealth({ value, label }: { value: number; label: string }) {
  const color = value > 60 ? 'bg-severity-low' : value > 30 ? 'bg-severity-medium' : 'bg-severity-critical';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted rounded-full h-1.5"><div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
      <span className="text-[10px] text-muted-foreground w-8 text-right">{value}%</span>
    </div>
  );
}

export default function FleetPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<Vehicle | null>(null);

  useEffect(() => {
    vehicleService.getVehicles().then((data) => { setVehicles(data); setLoading(false); });
  }, []);

  const filtered = vehicles.filter((v) => {
    const matchSearch = !search || v.registrationNumber.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Demo device health values
  const deviceHealth: Record<string, { battery: number; storage: number; internet: number; camera: number; gps: number }> = {
    'veh-001': { battery: 78, storage: 45, internet: 95, camera: 100, gps: 98 },
    'veh-002': { battery: 62, storage: 67, internet: 88, camera: 100, gps: 95 },
    'veh-003': { battery: 45, storage: 30, internet: 72, camera: 85, gps: 90 },
    'veh-004': { battery: 15, storage: 80, internet: 0, camera: 0, gps: 0 },
    'veh-005': { battery: 88, storage: 22, internet: 92, camera: 100, gps: 97 },
    'veh-006': { battery: 5, storage: 90, internet: 0, camera: 0, gps: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Fleet Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{vehicles.length} vehicles registered</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 mb-5 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {['All', 'SESSION_ACTIVE', 'ONLINE', 'OFFLINE', 'MAINTENANCE'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">City</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Battery</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Detections</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Last Seen</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={8} />)
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8}><EmptyState icon={Navigation} title="No vehicles" description="No vehicles match your filters" /></td></tr>
                  ) : (
                    filtered.map((v) => {
                      const health = deviceHealth[v.id] || { battery: 50, storage: 50, internet: 50, camera: 50, gps: 50 };
                      return (
                        <tr key={v.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <p className="text-xs font-mono font-semibold text-foreground">{v.registrationNumber}</p>
                            <p className="text-[10px] text-muted-foreground">{v.id}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.type}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.city}</td>
                          <td className="px-4 py-3"><StatusBadge status={v.status} size="sm" /></td>
                          <td className="px-4 py-3 w-28"><DeviceHealth value={health.battery} label="Battery" /></td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground">{v.detectionsToday}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(v.lastSeen).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setSelected(v)} className="p-1.5 rounded-lg btn-secondary" title="View Details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Vehicle Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-foreground">{selected.registrationNumber}</h2>
                <p className="text-xs text-muted-foreground">{selected.type} · {selected.city}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2"><StatusBadge status={selected.status} /></div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Vehicle ID', value: selected.id },
                  { label: 'Driver ID', value: selected.driverId },
                  { label: 'Route', value: selected.currentRoute || '—' },
                  { label: 'Detections Today', value: selected.detectionsToday },
                  { label: 'Distance Today', value: `${selected.distanceToday} km` },
                  { label: 'Last Seen', value: new Date(selected.lastSeen).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }) },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[10px] text-muted-foreground">{row.label}</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-foreground mb-3">Device Health</p>
                {Object.entries(deviceHealth[selected.id] || { battery: 50, storage: 50, internet: 50, camera: 50, gps: 50 }).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground w-16 capitalize">{key}</span>
                    <div className="flex-1 bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${val > 60 ? 'bg-severity-low' : val > 30 ? 'bg-severity-medium' : 'bg-severity-critical'}`} style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs text-foreground w-8 text-right">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
