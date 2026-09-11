'use client';

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { vehicleService } from '@/services/vehicleService';
import { eventService } from '@/services/eventService';
import { wsService } from '@/services/websocketService';
import type { DetectedEvent } from '@/types';
import { Navigation, AlertTriangle, Car, Footprints, Shield } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface MapVehicle { vehicleId: string; vehicleNumber: string; lat: number; lng: number; speed: number; status: string; }

export default function LiveMapPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [vehicles, setVehicles] = useState<MapVehicle[]>([]);
  const [events, setEvents] = useState<DetectedEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DetectedEvent | null>(null);
  const [layers, setLayers] = useState({ vehicles: true, roadDefects: true, traffic: true, pedestrian: true, incidents: true });
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);

  useEffect(() => {
    vehicleService.getMapVehicles().then(setVehicles);
    eventService.getEvents().then(setEvents);
  }, []);

  useEffect(() => {
    wsService.connect();
    const onVehicleUpdate = (msg: { payload: Record<string, unknown> }) => {
      setVehicles((prev) => prev.map((v) => v.vehicleId === msg.payload.vehicleId ? { ...v, lat: msg.payload.lat as number, lng: msg.payload.lng as number, speed: msg.payload.speed as number } : v));
    };
    const onNewEvent = (msg: { payload: Record<string, unknown> }) => {
      setEvents((prev) => [msg.payload as unknown as DetectedEvent, ...prev.slice(0, 49)]);
    };
    wsService.on('VEHICLE_LOCATION_UPDATED', onVehicleUpdate);
    wsService.on('NEW_EVENT', onNewEvent);
    return () => {
      wsService.off('VEHICLE_LOCATION_UPDATED', onVehicleUpdate);
      wsService.off('NEW_EVENT', onNewEvent);
      wsService.disconnect();
    };
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;
    let map: unknown;
    import('leaflet').then((L) => {
      if (leafletMapRef.current) return;
      // Fix default icon
      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png' });
      map = L.map(mapRef.current!).setView([16.7050, 74.2433], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map as L.Map);
      leafletMapRef.current = map;
    });
    return () => { if (leafletMapRef.current) { (leafletMapRef.current as L.Map).remove(); leafletMapRef.current = null; } };
  }, []);

  const filteredEvents = events.filter((e) => {
    if (e.module === 'ROAD_DEFECT' && !layers.roadDefects) return false;
    if (e.module === 'TRAFFIC_VIOLATION' && !layers.traffic) return false;
    if (e.module === 'PEDESTRIAN_SAFETY' && !layers.pedestrian) return false;
    if (e.module === 'INCIDENT' && !layers.incidents) return false;
    return true;
  });

  const severityColor = (s: string) => ({ CRITICAL: 'bg-severity-critical', HIGH: 'bg-severity-high', MEDIUM: 'bg-severity-medium', LOW: 'bg-severity-low' }[s] || 'bg-muted');

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 flex flex-col">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-border">
            <div>
              <h1 className="text-xl font-bold text-foreground">Live GIS Map</h1>
              <p className="text-xs text-muted-foreground">{vehicles.length} vehicles · {filteredEvents.length} events</p>
            </div>
            <div className="flex items-center gap-2">
              {[
                { key: 'vehicles', icon: Navigation, label: 'Vehicles' },
                { key: 'roadDefects', icon: AlertTriangle, label: 'Defects' },
                { key: 'traffic', icon: Car, label: 'Traffic' },
                { key: 'pedestrian', icon: Footprints, label: 'Pedestrian' },
                { key: 'incidents', icon: Shield, label: 'Incidents' },
              ].map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setLayers((l) => ({ ...l, [key]: !l[key as keyof typeof l] }))}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${layers[key as keyof typeof layers] ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Map */}
            <div className="flex-1 relative">
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <div ref={mapRef} className="w-full h-full min-h-[500px]" style={{ zIndex: 1 }} />

              {/* Overlay legend */}
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur border border-border rounded-xl p-3 z-10">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">SEVERITY</p>
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((s) => (
                  <div key={s} className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${severityColor(s)}`} />
                    <span className="text-[10px] text-foreground">{s}</span>
                  </div>
                ))}
              </div>

              {/* Event list overlay */}
              <div className="absolute top-4 right-4 w-72 bg-card/95 backdrop-blur border border-border rounded-xl overflow-hidden z-10 max-h-96">
                <div className="px-3 py-2.5 border-b border-border">
                  <p className="text-xs font-semibold text-foreground">Recent Events ({filteredEvents.length})</p>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {filteredEvents.slice(0, 10).map((evt) => (
                    <button key={evt.id} onClick={() => setSelectedEvent(evt === selectedEvent ? null : evt)}
                      className={`w-full flex items-start gap-2.5 p-2.5 border-b border-border last:border-0 text-left hover:bg-muted/30 transition-colors ${selectedEvent?.id === evt.id ? 'bg-primary/10' : ''}`}>
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severityColor(evt.severity)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{evt.type.replace(/_/g, ' ')}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{evt.location}</p>
                        <p className="text-[10px] text-muted-foreground">{evt.vehicleReg} · {evt.confidence}%</p>
                      </div>
                      <SeverityBadge severity={evt.severity} size="sm" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Detail Panel */}
            {selectedEvent && (
              <div className="w-80 border-l border-border bg-card p-5 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-foreground">Event Detail</h2>
                  <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  <div><p className="text-[10px] text-muted-foreground">Category</p><p className="text-sm font-medium text-foreground">{selectedEvent.module.replace(/_/g, ' ')}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Type</p><p className="text-sm font-medium text-foreground">{selectedEvent.type.replace(/_/g, ' ')}</p></div>
                  <div className="flex gap-2"><SeverityBadge severity={selectedEvent.severity} /></div>
                  <div><p className="text-[10px] text-muted-foreground">AI Confidence</p><p className="text-sm font-medium text-foreground">{selectedEvent.confidence}%</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Location</p><p className="text-sm font-medium text-foreground">{selectedEvent.location}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Vehicle</p><p className="text-sm font-medium text-foreground">{selectedEvent.vehicleReg}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">GPS</p><p className="text-xs font-mono text-foreground">{selectedEvent.lat.toFixed(5)}, {selectedEvent.lng.toFixed(5)}</p></div>
                </div>
                {selectedEvent.caseId && (
                  <a href={`/admin/cases/${selectedEvent.caseId}`} className="mt-4 block w-full py-2.5 btn-primary rounded-lg text-sm text-center font-semibold">
                    View Case
                  </a>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
