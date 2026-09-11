'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { eventService } from '@/services/eventService';
import type { DetectedEvent } from '@/types';
import { MapPin, Clock, AlertTriangle, CheckCircle, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const STATUS_STEPS = ['DETECTED', 'VERIFIED', 'ASSIGNED', 'RESOLVED'];

export default function ReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<DetectedEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  useEffect(() => {
    if (id) eventService.getEvent(id).then((e) => { setEvent(e); setLoading(false); });
  }, [id]);

  async function handleDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!disputeReason || !disputeDesc) return;
    await eventService.disputeEvent(id, disputeReason, disputeDesc);
    setDisputeSubmitted(true);
    setDisputeOpen(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 md:ml-60 flex items-center justify-center">
        <div className="text-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-muted-foreground">Loading report...</p></div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 md:ml-60 flex items-center justify-center">
        <div className="text-center"><AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">Report not found</p><Link href="/user/history" className="mt-3 btn-primary px-4 py-2 rounded-lg text-sm inline-block">Back to History</Link></div>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(event.status);

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6 flex items-center gap-4">
            <Link href="/user/history" className="p-2 rounded-lg btn-secondary">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Report Detail</h1>
              <p className="text-xs text-muted-foreground font-mono">{event.id}</p>
            </div>
          </div>

          {disputeSubmitted && (
            <div className="bg-severity-low-bg border border-severity-low/30 rounded-xl p-4 mb-5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-severity-low" />
              <p className="text-sm text-severity-low font-medium">Dispute submitted successfully. Our team will review it.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evidence */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Evidence Image</p>
                    <p className="text-xs text-muted-foreground mt-1">AI-captured at detection time</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Event Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Category', value: event.module.replace(/_/g, ' ') },
                    { label: 'Type', value: event.type.replace(/_/g, ' ') },
                    { label: 'AI Confidence', value: `${event.confidence}%` },
                    { label: 'Vehicle', value: event.vehicleReg },
                    { label: 'Latitude', value: event.lat.toFixed(6) },
                    { label: 'Longitude', value: event.lng.toFixed(6) },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-xs text-muted-foreground">{row.label}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{row.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground">{event.description}</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> {new Date(event.detectedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                  </div>
                </div>
              </div>

              {/* Dispute */}
              {!disputeSubmitted && (
                <button onClick={() => setDisputeOpen(true)} className="w-full py-2.5 btn-secondary rounded-xl text-sm font-medium">
                  Dispute This Report
                </button>
              )}
            </div>

            {/* Status + Severity */}
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Status</h2>
                <div className="flex gap-2 mb-4">
                  <SeverityBadge severity={event.severity} />
                  <StatusBadge status={event.status} />
                </div>
                {/* Timeline */}
                <div className="space-y-3">
                  {STATUS_STEPS.map((step, idx) => {
                    const done = idx <= currentStep;
                    const current = idx === currentStep;
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${done ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} ${current ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}>
                          {done ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</p>
                          {current && <p className="text-[10px] text-primary">Current Status</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Dispute Modal */}
      {disputeOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Dispute Report</h2>
              <button onClick={() => setDisputeOpen(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleDispute} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Reason *</label>
                <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} required>
                  <option value="">Select reason...</option>
                  <option value="INCORRECT_DETECTION">Incorrect Detection</option>
                  <option value="WRONG_LOCATION">Wrong Location</option>
                  <option value="ALREADY_FIXED">Already Fixed</option>
                  <option value="FALSE_POSITIVE">False Positive</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description *</label>
                <textarea className="input-field w-full px-3 py-2 rounded-lg text-sm resize-none" rows={4} placeholder="Describe why you are disputing this report..." value={disputeDesc} onChange={(e) => setDisputeDesc(e.target.value)} required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setDisputeOpen(false)} className="flex-1 py-2.5 btn-secondary rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 btn-primary rounded-lg text-sm font-semibold">Submit Dispute</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
