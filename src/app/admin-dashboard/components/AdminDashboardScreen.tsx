'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import AdminKPIGrid from './AdminKPIGrid';
import LiveAlertFeed from './LiveAlertFeed';
import FleetStatusTable from './FleetStatusTable';
import AdminChartsRow from './AdminChartsRow';

export default function AdminDashboardScreen() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen sidebar-transition ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <AdminTopbar
          onMenuToggle={() => setSidebarCollapsed((c) => !c)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 2xl:px-10 pb-8 max-w-screen-2xl w-full mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Real-time urban intelligence — Kolhapur · Pune · Mumbai
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-severity-critical-bg border border-severity-critical/30 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-severity-critical pulse-dot" />
                <span className="text-xs font-semibold text-severity-critical">1 Critical Unacknowledged</span>
              </div>
              <select className="input-field px-3 py-1.5 text-sm rounded-lg text-sm">
                <option>Last 1 hour</option>
                <option>Last 6 hours</option>
                <option>Today</option>
                <option>Last 7 days</option>
              </select>
            </div>
          </div>

          {/* KPI Grid */}
          <AdminKPIGrid />

          {/* Charts Row */}
          <AdminChartsRow />

          {/* Bottom row: Alerts + Fleet */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mt-5">
            <div className="xl:col-span-3">
              <LiveAlertFeed />
            </div>
            <div className="xl:col-span-2">
              <FleetStatusTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}