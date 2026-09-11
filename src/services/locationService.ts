import { DEMO_MODE } from './api';

export interface GpsLocation {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
}

type LocationCallback = (loc: GpsLocation) => void;

// Demo coordinates for Kolhapur area
const DEMO_BASE = { lat: 16.7050, lng: 74.2433 };
let demoOffset = 0;

function getDemoLocation(): GpsLocation {
  demoOffset += 0.0001;
  return {
    lat: DEMO_BASE.lat + Math.sin(demoOffset) * 0.005,
    lng: DEMO_BASE.lng + Math.cos(demoOffset) * 0.005,
    accuracy: 5 + Math.random() * 10,
    timestamp: new Date().toISOString(),
  };
}

class LocationService {
  private watchId: number | null = null;
  private demoTimer: ReturnType<typeof setInterval> | null = null;
  private callbacks: Set<LocationCallback> = new Set();
  private lastLocation: GpsLocation | null = null;

  getCurrentLocation(): Promise<GpsLocation> {
    if (DEMO_MODE) {
      return Promise.resolve(getDemoLocation());
    }
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: new Date(pos.timestamp).toISOString(),
        }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  startWatching(callback: LocationCallback, intervalMs = 5000) {
    this.callbacks.add(callback);
    if (DEMO_MODE) {
      if (!this.demoTimer) {
        this.demoTimer = setInterval(() => {
          const loc = getDemoLocation();
          this.lastLocation = loc;
          this.callbacks.forEach((cb) => cb(loc));
        }, intervalMs);
      }
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.geolocation && !this.watchId) {
      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const loc: GpsLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: new Date(pos.timestamp).toISOString(),
          };
          this.lastLocation = loc;
          this.callbacks.forEach((cb) => cb(loc));
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }
  }

  stopWatching(callback?: LocationCallback) {
    if (callback) this.callbacks.delete(callback);
    else this.callbacks.clear();
    if (this.callbacks.size === 0) {
      if (this.demoTimer) { clearInterval(this.demoTimer); this.demoTimer = null; }
      if (this.watchId !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
    }
  }

  getLastLocation() { return this.lastLocation; }
}

export const locationService = new LocationService();
