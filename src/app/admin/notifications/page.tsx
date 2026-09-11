'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import EmptyState from '@/components/ui/EmptyState';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';
import { Bell, CheckCheck, AlertTriangle, Info, CheckCircle, AlertOctagon } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  ALERT: { icon: AlertOctagon, color: 'text-severity-critical', bg: 'bg-severity-critical-bg' },
  WARNING: { icon: AlertTriangle, color: 'text-severity-high', bg: 'bg-severity-high-bg' },
  INFO: { icon: Info, color: 'text-primary', bg: 'bg-primary/10' },
  SUCCESS: { icon: CheckCircle, color: 'text-severity-low', bg: 'bg-severity-low-bg' },
};

export default function NotificationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService.getNotifications().then((data) => { setNotifications(data); setLoading(false); });
  }, []);

  async function handleMarkRead(id: string) {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  async function handleMarkAllRead() {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && <span className="px-2.5 py-1 bg-severity-critical text-white text-xs font-bold rounded-full">{unreadCount} unread</span>}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg text-sm">
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-16 bg-card border border-border rounded-xl skeleton-shimmer" />)}</div>
          ) : notifications.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
                const Icon = cfg.icon;
                return (
                  <div key={n.id}
                    className={`bg-card border rounded-xl p-4 flex items-start gap-4 transition-all cursor-pointer hover:bg-muted/20 ${!n.isRead ? 'border-primary/30' : 'border-border'}`}
                    onClick={() => !n.isRead && handleMarkRead(n.id)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                        {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    {!n.isRead && (
                      <button onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }} className="text-xs text-primary hover:underline flex-shrink-0">Mark read</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
