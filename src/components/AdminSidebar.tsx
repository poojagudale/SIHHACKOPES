'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard, Map, Bell, AlertTriangle, Car, Users, BarChart3, Settings,
  ChevronLeft, ChevronRight, Shield, FileText, Navigation, Eye, LogOut,
  Footprints, ClipboardList,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';
import ThemeToggle from '@/components/ThemeToggle';


interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  group: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-admin-dashboard', label: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'nav-live-map', label: 'Live Map', href: '/admin/live-map', icon: Map, group: 'Overview' },
  { id: 'nav-live-alerts', label: 'Live Alerts', href: '/admin/live-alerts', icon: Bell, badge: 3, group: 'Overview' },
  { id: 'nav-road-defects', label: 'Road Defects', href: '/admin/road-defects', icon: AlertTriangle, group: 'Detection' },
  { id: 'nav-traffic', label: 'Traffic Violations', href: '/admin/traffic-violations', icon: Car, group: 'Detection' },
  { id: 'nav-pedestrian', label: 'Pedestrian Safety', href: '/admin/pedestrian-safety', icon: Footprints, group: 'Detection' },
  { id: 'nav-incidents', label: 'Incidents', href: '/admin/incidents', icon: Shield, badge: 1, group: 'Detection' },
  { id: 'nav-cases', label: 'Cases', href: '/admin/cases', icon: ClipboardList, badge: 5, group: 'Response' },
  { id: 'nav-fleet', label: 'Fleet', href: '/admin/fleet', icon: Navigation, group: 'Operations' },
  { id: 'nav-users', label: 'Users', href: '/admin/users', icon: Users, group: 'Operations' },
  { id: 'nav-analytics', label: 'Analytics', href: '/admin/analytics', icon: BarChart3, group: 'Intelligence' },
  { id: 'nav-notifications', label: 'Notifications', href: '/admin/notifications', icon: Bell, group: 'Intelligence' },
  { id: 'nav-audit', label: 'Audit Logs', href: '/admin/audit-logs', icon: FileText, group: 'Intelligence' },
  { id: 'nav-settings', label: 'Settings', href: '/admin/settings', icon: Settings, group: 'System' },
];

const GROUPS = ['Overview', 'Detection', 'Response', 'Operations', 'Intelligence', 'System'];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-30 sidebar-transition ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-border min-h-[64px] ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <AppLogo size={32} />
          {!collapsed && (
            <span className="font-semibold text-sm text-foreground leading-tight">
              UrbanEye<span className="text-primary">AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={`group-${group}`} className="mb-1">
              {!collapsed && (
                <p className="px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </p>
              )}
              {collapsed && <div className="h-3" />}
              {items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 mx-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                      isActive ? 'nav-active' : 'nav-inactive'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white leading-none">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-border p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Arjun Patil</p>
              <p className="text-[10px] text-muted-foreground">Officer</p>
            </div>
          </div>
        )}
        <Link
          href="/sign-up-login-screen"
          className="flex items-center gap-2 px-3 py-2 rounded-lg nav-inactive text-sm w-full"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Link>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3`}>
          {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
          <ThemeToggle />
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-2 rounded-lg nav-inactive text-sm w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}