import React from 'react';
import dynamic from 'next/dynamic';

const DetectionBreakdownChart = dynamic(() => import('./DetectionBreakdownChart'), { ssr: false });
const EventTimelineChart = dynamic(() => import('./EventTimelineChart'), { ssr: false });

export default function AdminChartsRow() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mt-5">
      <div className="xl:col-span-3">
        <EventTimelineChart />
      </div>
      <div className="xl:col-span-2">
        <DetectionBreakdownChart />
      </div>
    </div>
  );
}