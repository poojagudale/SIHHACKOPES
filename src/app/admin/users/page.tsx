'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopbar from '@/components/AdminTopbar';
import EmptyState from '@/components/ui/EmptyState';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import { userService } from '@/services/userService';
import { DEMO_USERS } from '@/services/demoProvider';
import { Search, Users, Plus, Edit2, UserX, X, CheckCircle } from 'lucide-react';

type DemoUser = typeof DEMO_USERS[0];

export default function UsersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'driver', organization: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    userService.getUsers().then((data) => { setUsers(data as DemoUser[]); setLoading(false); });
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    const created = await userService.createUser(newUser);
    setUsers((prev) => [...prev, created as DemoUser]);
    setAddOpen(false);
    setNewUser({ name: '', email: '', role: 'driver', organization: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const roleColors: Record<string, string> = {
    driver: 'bg-primary/10 text-primary',
    partner_rider: 'bg-severity-medium-bg text-severity-medium',
    citizen: 'bg-muted text-muted-foreground',
    officer: 'bg-severity-high-bg text-severity-high',
    police_liaison: 'bg-severity-critical-bg text-severity-critical',
    super_admin: 'bg-severity-low-bg text-severity-low',
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      <div className={`flex-1 flex flex-col min-h-screen sidebar-transition ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'}`}>
        <AdminTopbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 pt-16 px-4 md:px-6 xl:px-8 pb-8 max-w-screen-2xl w-full mx-auto">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{users.length} users registered</p>
            </div>
            <button onClick={() => setAddOpen(true)} className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>

          {saved && <div className="bg-severity-low-bg border border-severity-low/30 rounded-xl p-3 mb-4 text-sm text-severity-low font-medium flex items-center gap-2"><CheckCircle className="w-4 h-4" /> User added successfully.</div>}

          <div className="bg-card border border-border rounded-xl p-4 mb-5 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field w-full pl-9 pr-3 py-2 rounded-lg text-sm" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="input-field px-3 py-2 rounded-lg text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              {['driver', 'partner_rider', 'citizen', 'officer', 'police_liaison', 'super_admin'].map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Last Active</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }, (_, i) => <TableRowSkeleton key={i} cols={7} />)
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7}><EmptyState icon={Users} title="No users found" description="No users match your filters" /></td></tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">{u.name}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${roleColors[u.role] || 'bg-muted text-muted-foreground'}`}>
                            {u.role.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{u.organization}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-severity-low-bg text-severity-low text-[10px] font-semibold rounded-full">{u.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.lastActive).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' })}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <button className="p-1.5 rounded-lg btn-secondary" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg btn-secondary" title="Disable"><UserX className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add User Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Add New User</h2>
              <button onClick={() => setAddOpen(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Enter full name' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'Enter email address' },
                { label: 'Organization', key: 'organization', type: 'text', placeholder: 'Enter organization' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label} *</label>
                  <input type={field.type} className="input-field w-full px-3 py-2 rounded-lg text-sm" placeholder={field.placeholder} value={newUser[field.key as keyof typeof newUser]} onChange={(e) => setNewUser((n) => ({ ...n, [field.key]: e.target.value }))} required />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role *</label>
                <select className="input-field w-full px-3 py-2 rounded-lg text-sm" value={newUser.role} onChange={(e) => setNewUser((n) => ({ ...n, role: e.target.value }))}>
                  {['driver', 'partner_rider', 'citizen', 'officer', 'police_liaison', 'super_admin'].map((r) => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="flex-1 py-2.5 btn-secondary rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 btn-primary rounded-lg text-sm font-semibold">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
