'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard, Camera, Activity, History, FileText, User, Settings, LogOut, Eye,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const USER_NAV = [
  { id: 'unav-dashboard', label: 'Dashboard', href: '/user-dashboard', icon: LayoutDashboard },
  { id: 'unav-camera', label: 'Camera Setup', href: '/user/camera-setup', icon: Camera },
  { id: 'unav-session', label: 'Active Session', href: '/user/active-session', icon: Activity },
  { id: 'unav-history', label: 'Report History', href: '/user/history', icon: History },
  { id: 'unav-report', label: 'Manual Report', href: '/user/manual-report', icon: FileText },
  { id: 'unav-profile', label: 'My Profile', href: '/user/profile', icon: User },
  { id: 'unav-settings', label: 'Settings', href: '/user/settings', icon: Settings },
];

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-card border-r border-border flex flex-col z-30 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4 border-b border-border min-h-[64px]">
        <AppLogo size={32} />
        <span className="font-semibold text-sm text-foreground">
          UrbanEye<span className="text-primary">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 space-y-0.5 px-2">
        {USER_NAV?.map((item) => {
          const isActive = pathname === item?.href;
          const Icon = item?.icon;
          return (
            <Link
              key={item?.id}
              href={item?.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive ? 'nav-active' : 'nav-inactive'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item?.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Eye className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">Rajan Shinde</p>
            <p className="text-[10px] text-muted-foreground">Driver · MH09AB1234</p>
          </div>
        </div>
        <Link
          href="/sign-up-login-screen"
          className="flex items-center gap-2 px-3 py-2 rounded-lg nav-inactive text-sm w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}