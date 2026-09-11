'use client';

import React, { useState } from 'react';
import UserSidebar from '@/components/UserSidebar';
import UserTopbar from '@/components/UserTopbar';
import { userService } from '@/services/userService';
import { DEMO_USERS } from '@/services/demoProvider';
import { User, Phone, Car, Shield, Edit2, Save, X } from 'lucide-react';

const CURRENT_USER = DEMO_USERS?.[0];

export default function UserProfilePage() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(CURRENT_USER?.name);
  const [phone, setPhone] = useState(CURRENT_USER?.phone);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await userService?.updateMe({ name, phone });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-60">
        <UserTopbar onMenuToggle={() => {}} />
        <main className="flex-1 pt-16 md:pt-0 px-4 md:px-6 xl:px-8 pb-10 max-w-screen-xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your account information</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg text-sm">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 btn-secondary rounded-lg text-sm"><X className="w-4 h-4" /> Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
          </div>

          {saved && (
            <div className="bg-severity-low-bg border border-severity-low/30 rounded-xl p-3 mb-5 text-sm text-severity-low font-medium">
              Profile updated successfully.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Avatar Card */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <p className="text-sm text-muted-foreground capitalize mt-0.5">{CURRENT_USER?.role?.replace(/_/g, ' ')}</p>
              <span className="mt-3 px-3 py-1 bg-severity-low-bg text-severity-low text-xs font-semibold rounded-full">Active</span>
              <div className="mt-4 w-full pt-4 border-t border-border space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Badge: {CURRENT_USER?.badgeNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Car className="w-3.5 h-3.5" />
                  <span>Vehicle: MH09AB1234</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-foreground mb-5">Account Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                  {editing ? (
                    <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={name} onChange={(e) => setName(e?.target?.value)} />
                  ) : (
                    <p className="text-sm font-medium text-foreground">{name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                  <p className="text-sm font-medium text-foreground">{CURRENT_USER?.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone</label>
                  {editing ? (
                    <input className="input-field w-full px-3 py-2 rounded-lg text-sm" value={phone} onChange={(e) => setPhone(e?.target?.value)} />
                  ) : (
                    <p className="text-sm font-medium text-foreground">{phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role</label>
                  <p className="text-sm font-medium text-foreground capitalize">{CURRENT_USER?.role?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Driver ID</label>
                  <p className="text-sm font-medium text-foreground">{CURRENT_USER?.driverId}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Organization</label>
                  <p className="text-sm font-medium text-foreground">{CURRENT_USER?.organization}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Badge Number</label>
                  <p className="text-sm font-medium text-foreground">{CURRENT_USER?.badgeNumber}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Account Status</label>
                  <span className="px-2.5 py-1 bg-severity-low-bg text-severity-low text-xs font-semibold rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
