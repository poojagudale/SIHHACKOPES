'use client';

import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import { Save, CheckCircle } from 'lucide-react';

interface Settings {
  cameraSource: string;
  resolution: string;
  autoStart: boolean;
  cameraFallback: boolean;
  wifiOnly: boolean;
  mobileData: boolean;
  offlineQueue: boolean;
  eventNotifications: boolean;
  emergencyAlerts: boolean;
  systemNotifications: boolean;
  language: string;
}

const DEFAULT_SETTINGS: Settings = {
  cameraSource: 'PHONE', resolution: '1280x720', autoStart: false, cameraFallback: true,
  wifiOnly: false, mobileData: true, offlineQueue: true,
  eventNotifications: true, emergencyAlerts: true, systemNotifications: true,
  language: 'en',
};

export default function UserSettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urbaneye_settings');
      if (saved) try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch {}
    }
    return DEFAULT_SETTINGS;
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof Settings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  function handleSave() {
    if (typeof window !== 'undefined') localStorage.setItem('urbaneye_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function ToggleRow({ label, desc, settingKey }: { label: string; desc?: string; settingKey: keyof Settings }) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
        </div>
        <button type="button" onClick={() => toggle(settingKey)}
          className={`relative w-11 h-6 rounded-full transition-colors ${settings[settingKey] ? 'bg-primary' : 'bg-muted'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[settingKey] ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Configure your app preferences</p>
            </div>
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-severity-low-bg text-severity-low border border-severity-low/30' : 'btn-primary'}`}>
              {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Camera */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Camera</h2>
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Camera Source</label>
                  <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={settings.cameraSource} onChange={(e) => setSettings((s) => ({ ...s, cameraSource: e.target.value }))}>
                    <option value="PHONE">Phone Camera</option>
                    <option value="SYSTEM">System Camera</option>
                    <option value="USB">USB Camera</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Resolution</label>
                  <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={settings.resolution} onChange={(e) => setSettings((s) => ({ ...s, resolution: e.target.value }))}>
                    <option value="640x480">640×480 (SD)</option>
                    <option value="1280x720">1280×720 (HD)</option>
                    <option value="1920x1080">1920×1080 (Full HD)</option>
                  </select>
                </div>
              </div>
              <ToggleRow label="Auto-Start Camera" desc="Start camera when session begins" settingKey="autoStart" />
              <ToggleRow label="Camera Fallback" desc="Use phone camera if primary fails" settingKey="cameraFallback" />
            </div>

            {/* Data */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Data & Upload</h2>
              <ToggleRow label="WiFi Only Upload" desc="Only upload evidence on WiFi" settingKey="wifiOnly" />
              <ToggleRow label="Mobile Data Upload" desc="Allow uploads on mobile data" settingKey="mobileData" />
              <ToggleRow label="Offline Queue" desc="Queue events when offline" settingKey="offlineQueue" />
            </div>

            {/* Notifications */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Notifications</h2>
              <ToggleRow label="Event Notifications" desc="Notify when events are detected" settingKey="eventNotifications" />
              <ToggleRow label="Emergency Alerts" desc="Critical incident notifications" settingKey="emergencyAlerts" />
              <ToggleRow label="System Notifications" desc="App updates and system messages" settingKey="systemNotifications" />
            </div>

            {/* Language */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Language</h2>
              <div className="grid grid-cols-3 gap-2">
                {[{ value: 'en', label: 'English' }, { value: 'hi', label: 'हिंदी' }, { value: 'mr', label: 'मराठी' }].map((lang) => (
                  <button key={lang.value} type="button" onClick={() => setSettings((s) => ({ ...s, language: lang.value }))}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all ${settings.language === lang.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/30 text-foreground hover:border-primary/40'}`}>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
