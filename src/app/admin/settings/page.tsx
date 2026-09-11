'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import { CheckCircle, AlertTriangle, XCircle, Save } from 'lucide-react';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

function ServiceStatus({ connected, label }: { connected: boolean | null; label: string }) {
  if (connected === null) return <span className="flex items-center gap-1.5 text-xs text-severity-medium"><AlertTriangle className="w-3.5 h-3.5" /> {label}: Warning</span>;
  return connected
    ? <span className="flex items-center gap-1.5 text-xs text-severity-low"><CheckCircle className="w-3.5 h-3.5" /> {label}: Connected</span>
    : <span className="flex items-center gap-1.5 text-xs text-severity-critical"><XCircle className="w-3.5 h-3.5" /> {label}: Disconnected</span>;
}

export default function AdminSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [orgName, setOrgName] = useState('Kolhapur Municipal Corporation');
  const [saved, setSaved] = useState(false);
  const [retention, setRetention] = useState({ evidence: '90', events: '365', audit: '730' });
  const [privacy, setPrivacy] = useState({ privacyMode: false, evidenceAccess: true, dataProtection: true });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Platform configuration and integrations</p>
            </div>
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-severity-low-bg text-severity-low border border-severity-low/30' : 'btn-primary'}`}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* General */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">General</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Organization Name</label>
                  <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Demo Mode</label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${DEMO_MODE ? 'bg-severity-medium-bg' : 'bg-severity-low-bg'}`}>
                    <span className={`w-2 h-2 rounded-full ${DEMO_MODE ? 'bg-severity-medium' : 'bg-severity-low'}`} />
                    <span className="text-xs font-medium text-foreground">{DEMO_MODE ? 'Demo Mode Active (NEXT_PUBLIC_DEMO_MODE=true)' : 'Production Mode (Real API)'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Integration Status */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">API Integration Status</h2>
              <div className="space-y-3">
                <ServiceStatus connected={DEMO_MODE ? null : true} label="Backend API" />
                <ServiceStatus connected={DEMO_MODE ? null : true} label="WebSocket" />
                <ServiceStatus connected={true} label="Map Service (OpenStreetMap)" />
                <ServiceStatus connected={DEMO_MODE ? null : true} label="GPS Service" />
                <ServiceStatus connected={DEMO_MODE ? null : true} label="Notification Service" />
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">API Base URL: <span className="font-mono text-foreground">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1'}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">WebSocket URL: <span className="font-mono text-foreground">{process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'}</span></p>
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Data Retention</h2>
              <div className="space-y-4">
                {[
                  { label: 'Evidence Retention (days)', key: 'evidence' },
                  { label: 'Event Retention (days)', key: 'events' },
                  { label: 'Audit Log Retention (days)', key: 'audit' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label}</label>
                    <input type="number" className="input-field w-full px-3 py-2 rounded-lg text-sm" value={retention[field.key as keyof typeof retention]} onChange={(e) => setRetention((r) => ({ ...r, [field.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Privacy & Security</h2>
              <div className="space-y-3">
                {[
                  { label: 'Privacy Mode', desc: 'Anonymize personal data in logs', key: 'privacyMode' },
                  { label: 'Evidence Access Control', desc: 'Restrict evidence to authorized roles', key: 'evidenceAccess' },
                  { label: 'Data Protection Mode', desc: 'Enable enhanced data protection', key: 'dataProtection' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button onClick={() => setPrivacy((p) => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${privacy[item.key as keyof typeof privacy] ? 'bg-primary' : 'bg-muted'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${privacy[item.key as keyof typeof privacy] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
