'use client';

import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import { eventService } from '@/services/eventService';
import { locationService } from '@/services/locationService';
import type { SeverityLevel, EventType, DetectionModule } from '@/types';
import { Upload, MapPin, CheckCircle, X } from 'lucide-react';

const CATEGORIES: Array<{ value: EventType; label: string; module: DetectionModule }> = [
  { value: 'POTHOLE', label: 'Pothole', module: 'ROAD_DEFECT' },
  { value: 'CRACK', label: 'Road Damage / Crack', module: 'ROAD_DEFECT' },
  { value: 'WATERLOGGING', label: 'Waterlogging', module: 'ROAD_DEFECT' },
  { value: 'MISSING_SIGNAGE', label: 'Missing Signage', module: 'ROAD_DEFECT' },
  { value: 'SIGNAL_VIOLATION', label: 'Traffic Violation', module: 'TRAFFIC_VIOLATION' },
  { value: 'NEAR_MISS', label: 'Pedestrian Risk', module: 'PEDESTRIAN_SAFETY' },
  { value: 'HIT_AND_RUN', label: 'Incident / Emergency', module: 'INCIDENT' },
];

export default function ManualReportPage() {
  const [type, setType] = useState<EventType | ''>('');
  const [severity, setSeverity] = useState<SeverityLevel | ''>('');
  const [description, setDescription] = useState('');
  const [locationDesc, setLocationDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleGetGPS() {
    setGpsLoading(true);
    try {
      const loc = await locationService.getCurrentLocation();
      setGpsCoords({ lat: loc.lat, lng: loc.lng });
      setLocationDesc(`${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`);
    } catch { setLocationDesc('GPS unavailable'); }
    finally { setGpsLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type || !severity) return;
    setSubmitting(true);
    const selectedCat = CATEGORIES.find((c) => c.value === type)!;
    const evt = await eventService.createEvent({
      type,
      module: selectedCat.module,
      severity,
      description,
      location: locationDesc || 'Location not specified',
      lat: gpsCoords?.lat || 16.7050,
      lng: gpsCoords?.lng || 74.2433,
    });
    setSubmitted(evt.id);
    setSubmitting(false);
  }

  if (submitted) return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 md:ml-60 flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-full bg-severity-low-bg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-severity-low" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Report Submitted!</h2>
          <p className="text-sm text-muted-foreground mb-1">Your report has been submitted successfully.</p>
          <p className="text-xs font-mono text-primary mb-6">Tracking ID: {submitted}</p>
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(null)} className="flex-1 py-2.5 btn-secondary rounded-lg text-sm">Submit Another</button>
            <a href="/user/history" className="flex-1 py-2.5 btn-primary rounded-lg text-sm text-center">View History</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-foreground">Manual Report</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Submit an urban issue you've observed</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Category */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Issue Category *</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.value} type="button" onClick={() => setType(cat.value)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-all text-left ${type === cat.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/30 text-foreground hover:border-primary/40'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Severity *</h2>
                <div className="grid grid-cols-4 gap-2">
                  {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as SeverityLevel[]).map((s) => (
                    <button key={s} type="button" onClick={() => setSeverity(s)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all ${severity === s ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/30 text-foreground hover:border-primary/40'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Description</h2>
                <textarea className="input-field w-full px-3 py-2.5 rounded-lg text-sm resize-none" rows={4} placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <button type="submit" disabled={!type || !severity || submitting}
                className="w-full py-3 btn-primary rounded-xl text-sm font-semibold disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>

            {/* Right: Image + GPS */}
            <div className="space-y-5">
              {/* Image Upload */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Evidence Photo</h2>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Evidence preview" className="w-full aspect-video object-cover rounded-lg" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Upload photo or</span>
                    <span className="text-xs text-primary">tap to capture</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              {/* GPS */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Location</h2>
                <button type="button" onClick={handleGetGPS} disabled={gpsLoading}
                  className="flex items-center gap-2 w-full px-3 py-2.5 btn-secondary rounded-lg text-sm mb-3 disabled:opacity-60">
                  <MapPin className="w-4 h-4" />
                  {gpsLoading ? 'Getting GPS...' : gpsCoords ? 'GPS Captured ✓' : 'Get GPS Location'}
                </button>
                <input className="input-field w-full px-3 py-2 rounded-lg text-sm" placeholder="Or describe location..." value={locationDesc} onChange={(e) => setLocationDesc(e.target.value)} />
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
