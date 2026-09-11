'use client';

import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import SessionHeroCard from './SessionHeroCard';
import UserStatCards from './UserStatCards';
import RecentEventsList from './RecentEventsList';
import SessionHistoryTable from './SessionHistoryTable';
import UserDetectionChart from './UserDetectionChart';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function UserDashboardScreen() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />

      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => setMobileMenuOpen((o) => !o)} />

        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 2xl:px-10 pb-10 max-w-screen-2xl w-full mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Vehicle MH09AB1234 · Kolhapur City Bus Service
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin-dashboard"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-secondary text-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Session hero */}
          <SessionHeroCard />

          {/* Stat cards */}
          <div className="mt-5">
            <UserStatCards />
          </div>

          {/* Middle row: detection chart + recent events */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mt-5">
            <div className="xl:col-span-2">
              <UserDetectionChart />
            </div>
            <div className="xl:col-span-3">
              <RecentEventsList />
            </div>
          </div>

          {/* Session history */}
          <div className="mt-5">
            <SessionHistoryTable />
          </div>
        </main>
      </div>
    </div>
  );
}