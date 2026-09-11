'use client';

import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { Bell, Menu, Shield } from 'lucide-react';

interface UserTopbarProps {
  onMenuToggle?: () => void;
}

export default function UserTopbar({ onMenuToggle }: UserTopbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-md border-b border-border z-20 flex items-center px-4 gap-3 md:hidden">
      <div className="flex items-center gap-2">
        <AppLogo size={28} />
        <span className="font-semibold text-sm text-foreground">
          UrbanEye<span className="text-primary">AI</span>
        </span>
      </div>
      <div className="flex-1" />
      <button className="relative p-2 rounded-lg nav-inactive" aria-label="Notifications">
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
      </button>
      <Link href="/admin-dashboard" className="p-2 rounded-lg nav-inactive" aria-label="Admin Panel">
        <Shield className="w-5 h-5" />
      </Link>
      <button onClick={onMenuToggle} className="p-2 rounded-lg nav-inactive" aria-label="Menu">
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}