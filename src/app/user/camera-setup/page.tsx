'use client';

import React, { useState, useEffect, useRef } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import { Camera, Usb, Smartphone, CheckCircle, XCircle, AlertCircle, RefreshCw, Save, Play } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type CameraSource = 'PHONE' | 'SYSTEM' | 'USB';

interface CameraConfig {
  source: CameraSource;
  resolution: string;
  fps: number;
  autoStart: boolean;
}

interface CameraStatus {
  connected: boolean;
  permissionGranted: boolean | null;
  deviceName: string;
  health: 'HEALTHY' | 'WARNING' | 'OFFLINE';
  stream: MediaStream | null;
}

export default function CameraSetupPage() {
  const [config, setConfig] = useState<CameraConfig>({ source: 'PHONE', resolution: '1280x720', fps: 30, autoStart: false });
  const [status, setStatus] = useState<CameraStatus>({ connected: false, permissionGranted: null, deviceName: '—', health: 'OFFLINE', stream: null });
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('urbaneye_camera_config') : null;
    if (saved) { try { setConfig(JSON.parse(saved)); } catch {} }
    return () => { status.stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  async function handleTestCamera() {
    setTesting(true);
    if (isDemoMode) {
      await new Promise((r) => setTimeout(r, 1200));
      setStatus({ connected: true, permissionGranted: true, deviceName: 'Demo Camera (HD)', health: 'HEALTHY', stream: null });
      setTesting(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      const track = stream.getVideoTracks()[0];
      setStatus({ connected: true, permissionGranted: true, deviceName: track.label || 'Camera', health: 'HEALTHY', stream });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e: unknown) {
      const isDenied = e instanceof Error && e.name === 'NotAllowedError';
      setStatus({ connected: false, permissionGranted: false, deviceName: '—', health: 'OFFLINE', stream: null });
    } finally { setTesting(false); }
  }

  function handleSave() {
    if (typeof window !== 'undefined') localStorage.setItem('urbaneye_camera_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const sourceOptions = [
    { id: 'PHONE' as CameraSource, label: 'Phone Camera', icon: Smartphone, desc: 'Use device front/rear camera via browser API' },
    { id: 'SYSTEM' as CameraSource, label: 'System Camera', icon: Camera, desc: 'Use system webcam or integrated camera' },
    { id: 'USB' as CameraSource, label: 'USB Camera', icon: Usb, desc: 'Connect external USB camera device' },
  ];

  function StatusIcon({ ok }: { ok: boolean | null }) {
    if (ok === null) return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    return ok ? <CheckCircle className="w-4 h-4 text-severity-low" /> : <XCircle className="w-4 h-4 text-severity-critical" />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Camera Setup</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Configure your camera source for AI detection sessions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Config */}
            <div className="lg:col-span-2 space-y-5">
              {/* Source Selection */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Camera Source</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sourceOptions.map((opt) => {
                    const Icon = opt.icon;
                    const active = config.source === opt.id;
                    return (
                      <button key={opt.id} onClick={() => setConfig((c) => ({ ...c, source: opt.id }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${active ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/40'}`}>
                        <Icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-foreground'}`}>{opt.label}</span>
                        <span className="text-[10px] text-muted-foreground leading-tight">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Camera Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Resolution</label>
                    <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={config.resolution} onChange={(e) => setConfig((c) => ({ ...c, resolution: e.target.value }))}>
                      <option value="640x480">640×480 (SD)</option>
                      <option value="1280x720">1280×720 (HD)</option>
                      <option value="1920x1080">1920×1080 (Full HD)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Frame Rate (FPS)</label>
                    <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={config.fps} onChange={(e) => setConfig((c) => ({ ...c, fps: Number(e.target.value) }))}>
                      <option value={15}>15 FPS</option>
                      <option value={24}>24 FPS</option>
                      <option value={30}>30 FPS</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <input type="checkbox" id="autostart" checked={config.autoStart} onChange={(e) => setConfig((c) => ({ ...c, autoStart: e.target.checked }))} className="w-4 h-4 accent-primary" />
                    <label htmlFor="autostart" className="text-sm text-foreground">Auto-start camera when session begins</label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={handleTestCamera} disabled={testing}
                  className="flex items-center gap-2 px-5 py-2.5 btn-secondary rounded-lg text-sm font-medium disabled:opacity-60">
                  {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  {testing ? 'Testing...' : 'Test Camera'}
                </button>
                <button onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-severity-low-bg text-severity-low border border-severity-low/30' : 'btn-primary'}`}>
                  {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Configuration'}
                </button>
              </div>
            </div>

            {/* Right: Status */}
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Camera Status</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Connection', value: status.connected ? 'Connected' : 'Not Connected', ok: status.connected },
                    { label: 'Permission', value: status.permissionGranted === null ? 'Not Checked' : status.permissionGranted ? 'Granted' : 'Denied', ok: status.permissionGranted },
                    { label: 'Device', value: status.deviceName, ok: status.connected },
                    { label: 'Resolution', value: config.resolution, ok: null },
                    { label: 'FPS', value: `${config.fps} FPS`, ok: null },
                    { label: 'Health', value: status.health, ok: status.health === 'HEALTHY' ? true : status.health === 'WARNING' ? null : false },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground">{row.value}</span>
                        <StatusIcon ok={row.ok} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Preview</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {status.stream ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">{isDemoMode ? 'Demo Mode — No live preview' : 'Click Test Camera to preview'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
