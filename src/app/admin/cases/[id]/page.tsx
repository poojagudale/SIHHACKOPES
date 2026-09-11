'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import SeverityBadge from '@/components/ui/SeverityBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { caseService } from '@/services/caseService';
import { eventService } from '@/services/eventService';
import { ChevronLeft, CheckCircle, Clock, AlertTriangle, User, Send } from 'lucide-react';
import Link from 'next/link';

const CASE_STATUSES = ['OPEN', 'INVESTIGATING', 'PENDING_REVIEW', 'CLOSED'];

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [caseData, setCaseData] = useState<Record<string, unknown> | null>(null);
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; author: string; text: string; time: string }>>([
    { id: 'c1', author: 'Arjun Patil', text: 'Case opened. Evidence reviewed.', time: '14:35' },
    { id: 'c2', author: 'Suresh Jadhav', text: 'Police notified. Awaiting response.', time: '14:40' },
  ]);

  useEffect(() => {
    if (!id) return;
    Promise.all([caseService.getCase(id), eventService.getEvents()]).then(([c, evts]) => {
      setCaseData(c as Record<string, unknown>);
      if (c) {
        const evt = evts.find((e) => e.id === (c as Record<string, unknown>).eventId);
        setEvent(evt as unknown as Record<string, unknown> || null);
      }
      setLoading(false);
    });
  }, [id]);

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [...prev, { id: `c${Date.now()}`, author: 'Arjun Patil', text: comment, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
    setComment('');
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={false} onToggle={() => {}} />
      <div className="flex-1 md:ml-60 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!caseData) return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={false} onToggle={() => {}} />
      <div className="flex-1 md:ml-60 flex items-center justify-center">
        <div className="text-center"><AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="text-sm text-muted-foreground">Case not found</p><Link href="/admin/cases" className="mt-3 btn-primary px-4 py-2 rounded-lg text-sm inline-block">Back to Cases</Link></div>
      </div>
    </div>
  );

  const currentStep = CASE_STATUSES.indexOf(caseData.status as string);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={false} onToggle={() => {}} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <AdminTopbar onMenuToggle={() => {}} sidebarCollapsed={false} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center gap-4">
            <Link href="/admin/cases" className="p-2 rounded-lg btn-secondary"><ChevronLeft className="w-4 h-4" /></Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Case Detail</h1>
              <p className="text-xs font-mono text-muted-foreground">{caseData.id as string}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Evidence */}
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border"><p className="text-sm font-semibold text-foreground">Evidence</p></div>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center"><AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="text-xs text-muted-foreground">AI-captured evidence</p></div>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border"><p className="text-sm font-semibold text-foreground">Comments</p></div>
                <div className="divide-y divide-border max-h-48 overflow-y-auto">
                  {comments.map((c) => (
                    <div key={c.id} className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"><User className="w-3 h-3 text-primary" /></div>
                        <span className="text-xs font-semibold text-foreground">{c.author}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{c.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-7">{c.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddComment} className="p-3 border-t border-border flex gap-2">
                  <input className="input-field flex-1 px-3 py-2 rounded-lg text-xs" placeholder="Add comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                  <button type="submit" className="p-2 btn-primary rounded-lg"><Send className="w-3.5 h-3.5" /></button>
                </form>
              </div>
            </div>

            {/* Case Info */}
            <div className="space-y-5">
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-4">Case Information</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Title', value: caseData.title as string },
                    { label: 'Severity', value: <SeverityBadge severity={caseData.severity as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'} size="sm" /> },
                    { label: 'Status', value: <StatusBadge status={caseData.status as 'OPEN' | 'INVESTIGATING' | 'PENDING_REVIEW' | 'CLOSED'} size="sm" /> },
                    { label: 'Assigned To', value: (caseData.assignedTo as string) || '—' },
                    { label: 'Event ID', value: <span className="font-mono text-xs text-primary">{caseData.eventId as string}</span> },
                    { label: 'Created', value: new Date(caseData.createdAt as string).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground flex-shrink-0">{row.label}</span>
                      <span className="text-xs font-medium text-foreground text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
                {caseData.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-xs text-foreground">{caseData.notes as string}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-3">Actions</h2>
                <div className="grid grid-cols-2 gap-2">
                  {['Assign', 'Reassign', 'Escalate', 'Resolve', 'Close'].map((action) => (
                    <button key={action} className="py-2 btn-secondary rounded-lg text-xs font-medium">{action}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Case Timeline</h2>
              <div className="space-y-4">
                {CASE_STATUSES.map((step, idx) => {
                  const done = idx <= currentStep;
                  const current = idx === currentStep;
                  return (
                    <div key={step} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'bg-primary' : 'bg-muted'} ${current ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''}`}>
                        {done ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.replace(/_/g, ' ')}</p>
                        {current && <p className="text-[10px] text-primary mt-0.5">Current Status</p>}
                        {done && idx < currentStep && <p className="text-[10px] text-muted-foreground mt-0.5">Completed</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
