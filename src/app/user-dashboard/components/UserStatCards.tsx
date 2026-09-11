import React from 'react';
import { Zap, Route, AlertTriangle, Star } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const STAT_CARDS = [
  {
    id: 'stat-detections',
    label: 'Detections Today',
    value: '23',
    subText: '+4 in last hour',
    icon: Zap,
    iconClass: 'bg-primary/20 text-primary',
    valueClass: 'text-primary',
    trend: 'up',
  },
  {
    id: 'stat-distance',
    label: 'Distance Covered',
    value: '47.2',
    subText: 'km this session',
    icon: Route,
    iconClass: 'bg-severity-low/20 text-severity-low',
    valueClass: 'text-severity-low',
    trend: 'neutral',
  },
  {
    id: 'stat-flagged',
    label: 'Events Flagged',
    value: '3',
    subText: '1 HIGH, 2 MEDIUM',
    icon: AlertTriangle,
    iconClass: 'bg-severity-high/20 text-severity-high',
    valueClass: 'text-severity-high',
    trend: 'up',
  },
  {
    id: 'stat-score',
    label: 'Session Score',
    value: '94',
    subText: 'out of 100 — Excellent',
    icon: Star,
    iconClass: 'bg-severity-medium/20 text-severity-medium',
    valueClass: 'text-severity-medium',
    trend: 'up',
  },
];

export default function UserStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CARDS?.map((card) => {
        const Icon = card?.icon;
        return (
          <div
            key={card?.id}
            className="bg-card border border-border rounded-xl p-5 card-glow hover:translate-y-[-1px] transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {card?.label}
              </p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card?.iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className={`text-3xl font-bold font-tabular mb-1 ${card?.valueClass}`}>
              {card?.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{card?.subText}</p>
          </div>
        );
      })}
    </div>
  );
}