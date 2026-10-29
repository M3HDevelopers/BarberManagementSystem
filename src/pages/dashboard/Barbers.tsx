import React, { useState } from 'react';
import { BarberService, ReportService } from '../../services/db';
import { Barber } from '../../types';
import { Plus, X, Edit, Star } from 'lucide-react';

export default function Barbers() {
  const [barbers, setBarbers] = useState(BarberService.getAllIncludingInactive());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Barber | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', skills: '', commissionType: 'percentage' as 'percentage' | 'fixed', commissionValue: 0, fixedSalary: 0 });
  const perf = ReportService.getBarberPerformance();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, phone: form.phone, email: form.email || undefined,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      commissionType: form.commissionType, commissionValue: form.commissionValue,
      fixedSalary: form.fixedSalary,
      workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '09:00', end: '18:00' })).concat([{ day: 'Sat', start: '10:00', end: '16:00' }]),
      daysOff: ['Sun'] as string[], active: true,
    };
    if (editing) { BarberService.update(editing.id, data); } else { BarberService.create(data as any); }
    setBarbers(BarberService.getAllIncludingInactive());
    setShowModal(false); setEditing(null);
    setForm({ name: '', phone: '', email: '', skills: '', commissionType: 'percentage', commissionValue: 0, fixedSalary: 0 });
  };

  const openEdit = (b: Barber) => {
    setEditing(b);
    setForm({ name: b.name, phone: b.phone, email: b.email || '', skills: b.skills.join(', '), commissionType: b.commissionType, commissionValue: b.commissionValue, fixedSalary: b.fixedSalary || 0 });
    setShowModal(true);
  };

  const toggleActive = (id: string) => {
    const b = barbers.find(x => x.id === id);
    if (b) { BarberService.update(id, { active: !b.active }); setBarbers(BarberService.getAllIncludingInactive()); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Barbers & Staff</h1>
          <p className="text-[13px] text-surface-500">Manage your team members</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
          <Plus size={15} /> Add Barber
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {barbers.map(b => {
          const p = perf.find(x => x.id === b.id);
          return (
            <div key={b.id} className={`bg-white border border-surface-200/60 p-5 hover-lift transition-all ${!b.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-surface-700 to-surface-900 text-white flex items-center justify-center text-[13px] font-bold shadow-lg shadow-black/10">
                    {b.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-surface-900">{b.name}</h3>
                    <p className="text-[11px] text-surface-400">{b.phone}</p>
                  </div>
                </div>
                <button onClick={() => openEdit(b)} className="p-1.5 text-surface-400 hover:text-surface-900 hover:bg-surface-100 transition-all"><Edit size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {b.skills.map(s => <span key={s} className="px-2 py-0.5 bg-surface-100 text-surface-600 text-[11px] font-medium">{s}</span>)}
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px] mb-4">
                <div className="p-2.5 bg-surface-50 border border-surface-100">
                  <p className="text-surface-400 text-[10px] uppercase tracking-wider">Commission</p>
                  <p className="font-bold text-surface-900 mt-0.5">{b.commissionType === 'percentage' ? `${b.commissionValue}%` : `$${b.commissionValue}/svc`}</p>
                </div>
                <div className="p-2.5 bg-surface-50 border border-surface-100">
                  <p className="text-surface-400 text-[10px] uppercase tracking-wider">Revenue</p>
                  <p className="font-bold text-surface-900 mt-0.5">${p?.revenue.toFixed(0) || '0'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${b.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{b.active ? 'Active' : 'Inactive'}</span>
                <button onClick={() => toggleActive(b.id)} className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold">{b.active ? 'Deactivate' : 'Activate'}</button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 sticky top-0 bg-white z-10">
              <h2 className="text-[16px] font-bold text-surface-900">{editing ? 'Edit Barber' : 'Add Barber'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Phone *</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Skills (comma-separated)</label><input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" placeholder="Haircut, Fade, Beard Trim" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Commission Type</label><select value={form.commissionType} onChange={e => setForm({...form, commissionType: e.target.value as any})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white"><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option></select></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Commission Value</label><input type="number" value={form.commissionValue} onChange={e => setForm({...form, commissionValue: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              </div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Fixed Salary (optional)</label><input type="number" value={form.fixedSalary} onChange={e => setForm({...form, fixedSalary: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-3 border border-surface-200 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
