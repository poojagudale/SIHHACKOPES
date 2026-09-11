'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_CREDENTIALS } from '@/data/mockData';
import type { DemoCredential } from '@/types';
import { toast } from 'sonner';

interface DemoCredentialsBoxProps {
  onAutofill: (email: string, password: string) => void;
}

export default function DemoCredentialsBox({ onAutofill }: DemoCredentialsBoxProps) {
  const [expanded, setExpanded] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const ROLE_COLORS: Record<string, string> = {
    driver: 'text-chart-3',
    officer: 'text-primary',
    super_admin: 'text-accent',
    citizen: 'text-chart-5',
    police_liaison: 'text-chart-4',
  };

  return (
    <div className="mt-6 bg-[rgba(255,255,255,0.02)] border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
          <span className="text-xs font-semibold text-foreground">Demo Accounts</span>
          <span className="text-[10px] text-muted-foreground">— click any row to autofill</span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Role</th>
                <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Email</th>
                <th className="px-4 py-2 text-left font-semibold text-muted-foreground">Password</th>
                <th className="px-4 py-2 text-center font-semibold text-muted-foreground">Use</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_CREDENTIALS.map((cred: DemoCredential) => (
                <tr
                  key={`demo-cred-${cred.role}`}
                  className="border-b border-border/50 last:border-0 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  onClick={() => onAutofill(cred.email, cred.password)}
                >
                  <td className="px-4 py-2.5">
                    <span className={`font-semibold ${ROLE_COLORS[cred.role] ?? 'text-foreground'}`}>
                      {cred.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{cred.email}</td>
                  <td className="px-4 py-2.5 font-mono text-muted-foreground">{cred.password}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`${cred.email} / ${cred.password}`, cred.role);
                      }}
                      className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      aria-label={`Copy ${cred.label} credentials`}
                    >
                      {copiedId === cred.role ? (
                        <Check className="w-3.5 h-3.5 text-severity-low" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}