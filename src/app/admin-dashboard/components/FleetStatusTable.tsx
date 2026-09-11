'use client';

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { MOCK_VEHICLES } from '@/data/mockData';
import type { VehicleStatus } from '@/types';

export default function FleetStatusTable() {
  return (
    <div className="bg-card border border-border rounded-xl card-glow overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Fleet Status</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {MOCK_VEHICLES.filter((v) => v.status !== 'OFFLINE').length} of {MOCK_VEHICLES.length} online
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-active" />
            <span className="text-[10px] text-muted-foreground">
              {MOCK_VEHICLES.filter((v) => v.status === 'SESSION_ACTIVE').length} Live
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card border-b border-border">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Vehicle</th>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Status</th>
              <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Det.</th>
              <th className="px-4 py-2.5 text-right font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">km</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {MOCK_VEHICLES.map((vehicle) => (
              <tr
                key={`fleet-row-${vehicle.id}`}
                className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-mono font-semibold text-foreground tracking-wider">{vehicle.registrationNumber}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                        {vehicle.currentRoute ?? vehicle.city}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={vehicle.status as VehicleStatus} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`font-semibold font-tabular ${vehicle.detectionsToday > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {vehicle.detectionsToday}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-muted-foreground font-tabular">{vehicle.distanceToday.toFixed(1)}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <button className="text-[11px] text-primary hover:underline flex items-center gap-1">
          Manage fleet
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}