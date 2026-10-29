import React, { useState, useEffect } from 'react';
import { BarberService, ReportService } from '../../services/db';
import { Barber } from '../../types';
import { Plus, X, Edit, Scissors } from 'lucide-react';

export default function Barbers() {
  const [barbers, setBarbers] = useState(BarberService.getAllIncludingInactive());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', skills: '' as string, commissionType: 'percentage' as 'percentage' | 'fixed', commissionValue: 0, fixedSalary: 0, daysOff: [] as string[] });
  const perf = ReportService.getBarberPerformance();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, phone: form.phone, email: form.email || undefined,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      commissionType: form.commissionType, commissionValue: form.commissionValue,
      fixedSalary: form.fixedSalary,
      workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '09:00', end: '18:00' })).concat([{ day: 'Sat', start: '10:00', end: '16:00' }]),
      daysOff: form.daysOff, active: true,
    };
    if (editing) {
      BarberService.update(editing.id, data);
    } else {
      BarberService.create(data as any);
    }
    setBarbers(BarberService.getAllIncludingInactive());
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', phone: '', email: '', skills: '', commissionType: 'percentage', commissionValue: 0, fixedSalary: 0, daysOff: [] });
  };

  const openEdit = (b: Barber) => {
    setEditing(b);
    setForm({ name: b.name, phone: b.phone, email: b.email || '', skills: b.skills.join(', '), commissionType: b.commissionType, commissionValue: b.commissionValue, fixedSalary: b.fixedSalary || 0, daysOff: b.daysOff });
    setShowModal(true);
  };

  const toggleActive = (id: string) => {
    const b = barbers.find(x => x.id === id);
    if (b) { BarberService.update(id, { active: !b.active }); setBarbers(BarberService.getAllIncludingInactive()); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Barbers & Staff</h1>
          <p className="text-sm text-charcoal-500">Manage your team</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
          <Plus size={16} /> Add Barber
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbers.map(b => {
          const p = perf.find(x => x.id === b.id);
          return (
            <div key={b.id} className={`bg-white border border-charcoal-200 p-5 ${!b.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-charcoal-800 text-white flex items-center justify-center text-sm font-bold">
                    {b.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal-900">{b.name}</h3>
                    <p className="text-xs text-charcoal-500">{b.phone}</p>
                  </div>
                </div>
                <button onClick={() => openEdit(b)} className="text-charcoal-400 hover:text-charcoal-900"><Edit size={16} /></button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex flex-wrap gap-1">
                  {b.skills.map(s => <span key={s} className="px-2 py-0.5 bg-charcoal-100 text-charcoal-700 text-xs">{s}</span>)}
                </div>
                <div className="flex justify-between text-xs text-charcoal-500">
                  <span>Commission: {b.commissionType === 'percentage' ? `${b.commissionValue}%` : `$${b.commissionValue}/service`}</span>
                  {b.fixedSalary ? <span>Salary: ${b.fixedSalary}</span> : null}
                </div>
                {p && (
                  <div className="pt-2 border-t border-charcoal-100 flex justify-between text-xs">
                    <span className="text-charcoal-500">Revenue: <span className="font-medium text-charcoal-900">${p.revenue.toFixed(0)}</span></span>
                    <span className="text-charcoal-500">Completed: <span className="font-medium text-charcoal-900">{p.completedAppointments}</span></span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 ${b.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                  <button onClick={() => toggleActive(b.id)} className="text-xs text-brand-600 hover:text-brand-700">{b.active ? 'Deactivate' : 'Activate'}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Barber' : 'Add Barber'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Phone *</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Skills (comma-separated)</label><input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" placeholder="Haircut, Fade, Beard Trim" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Commission Type</label><select value={form.commissionType} onChange={e => setForm({...form, commissionType: e.target.value as any})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900"><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Commission Value</label><input type="number" value={form.commissionValue} onChange={e => setForm({...form, commissionValue: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              </div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Fixed Salary (optional)</label><input type="number" value={form.fixedSalary} onChange={e => setForm({...form, fixedSalary: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2.5 border border-charcoal-300 text-sm text-charcoal-700 hover:bg-charcoal-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
