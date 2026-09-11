'use client';

import { DEMO_MODE } from './api';
import { MOCK_EVENTS, MOCK_VEHICLES } from '@/data/mockData';

export type WSEventType =
  | 'NEW_EVENT' |'EVENT_UPDATED' |'VEHICLE_LOCATION_UPDATED' |'VEHICLE_STATUS_UPDATED' |'DEVICE_STATUS_UPDATED' |'EMERGENCY_ALERT' |'CASE_UPDATED' |'NOTIFICATION';

export interface WSMessage {
  type: WSEventType;
  payload: Record<string, unknown>;
  timestamp: string;
}

type MessageHandler = (msg: WSMessage) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<WSEventType, Set<MessageHandler>> = new Map();
  private demoTimers: ReturnType<typeof setInterval>[] = [];
  private connected = false;

  connect() {
    if (DEMO_MODE) {
      this.startDemoSimulator();
      return;
    }
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    this.ws = new WebSocket(wsUrl);
    this.ws.onmessage = (e) => {
      try {
        const msg: WSMessage = JSON.parse(e.data);
        this.dispatch(msg);
      } catch {}
    };
    this.ws.onopen = () => { this.connected = true; };
    this.ws.onclose = () => {
      this.connected = false;
      setTimeout(() => this.connect(), 5000);
    };
  }

  disconnect() {
    this.demoTimers.forEach(clearInterval);
    this.demoTimers = [];
    this.ws?.close();
    this.ws = null;
    this.connected = false;
  }

  on(type: WSEventType, handler: MessageHandler) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
  }

  off(type: WSEventType, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler);
  }

  private dispatch(msg: WSMessage) {
    this.handlers.get(msg.type)?.forEach((h) => h(msg));
  }

  private startDemoSimulator() {
    this.connected = true;
    const eventTypes: WSEventType[] = ['NEW_EVENT', 'VEHICLE_LOCATION_UPDATED', 'EVENT_UPDATED'];
    let eventIndex = 0;

    // Simulate vehicle location updates every 8s
    const locTimer = setInterval(() => {
      const v = MOCK_VEHICLES[Math.floor(Math.random() * 3)];
      this.dispatch({
        type: 'VEHICLE_LOCATION_UPDATED',
        payload: {
          vehicleId: v.id,
          vehicleNumber: v.registrationNumber,
          lat: v.city === 'Kolhapur' ? 16.7050 + (Math.random() - 0.5) * 0.02 : v.city === 'Pune' ? 18.5018 + (Math.random() - 0.5) * 0.02 : 19.1136 + (Math.random() - 0.5) * 0.02,
          lng: v.city === 'Kolhapur' ? 74.2433 + (Math.random() - 0.5) * 0.02 : v.city === 'Pune' ? 73.9252 + (Math.random() - 0.5) * 0.02 : 72.8697 + (Math.random() - 0.5) * 0.02,
          speed: Math.floor(20 + Math.random() * 40),
        },
        timestamp: new Date().toISOString(),
      });
    }, 8000);

    // Simulate new events every 20s
    const newEventTimer = setInterval(() => {
      const evt = MOCK_EVENTS[eventIndex % MOCK_EVENTS.length];
      eventIndex++;
      this.dispatch({
        type: 'NEW_EVENT',
        payload: { ...evt, id: `evt-live-${Date.now()}`, detectedAt: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      });
    }, 20000);

    this.demoTimers.push(locTimer, newEventTimer);
  }

  isConnected() { return this.connected; }
}

export const wsService = new WebSocketService();
