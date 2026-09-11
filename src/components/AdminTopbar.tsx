'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Search, Menu } from 'lucide-react';

interface AdminTopbarProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
}

export default function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-20 flex items-center px-4 gap-3">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg nav-inactive md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-input border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Search events, vehicles, cases…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
        />
        <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
      </div>

      <div className="flex-1 md:flex-none" />

      {/* Live indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)]">
        <span className="w-2 h-2 rounded-full bg-primary pulse-dot" />
        <span className="text-xs font-semibold text-primary">LIVE</span>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg nav-inactive" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
      </button>

      {/* Time */}
      <div className="hidden lg:flex flex-col items-end">
        <span className="text-xs font-semibold text-foreground font-tabular">14:37 IST</span>
        <span className="text-[10px] text-muted-foreground">10 Sep 2026</span>
      </div>

      {/* Switch to User */}
      <Link
        href="/user-dashboard"
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-secondary text-xs"
      >
        User Panel
      </Link>
    </header>
  );
}