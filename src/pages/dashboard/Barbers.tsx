import * as React from 'react';
import { useState } from 'react';
import { BarberService, ReportService } from '../../services/db';
import { Barber } from '../../types';

export default function Barbers() {
  const [barbers, setBarbers] = useState(BarberService.getAllIncludingInactive());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', skills: '', commissionType: 'percentage' as 'percentage' | 'fixed', commissionValue: 0 });
  const perf = ReportService.getBarberPerformance();
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    BarberService.create({ ...form, email: '', skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), fixedSalary: 0, workingHours: ['Mon','Tue','Wed','Thu','Fri'].map(d => ({ day: d, start: '09:00', end: '18:00' })), daysOff: ['Sat','Sun'], active: true } as any);
    setBarbers(BarberService.getAllIncludingInactive()); setShowModal(false);
  };
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Barbers</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100">Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {barbers.map(b => { const p = perf.find(x => x.id === b.id); return (
          <div key={b.id} className="bg-stone-900 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-stone-800 flex items-center justify-center text-[12px] font-bold text-stone-400">{b.name.charAt(0)}</div>
              <div><p className="text-[14px] font-medium text-cream-100">{b.name}</p><p className="text-[11px] text-stone-500">{b.phone}</p></div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">{b.skills.map(s => <span key={s} className="px-2 py-0.5 bg-stone-800 text-stone-400 text-[10px]">{s}</span>)}</div>
            <div className="flex justify-between text-[12px] pt-3 border-t hairline-dark">
              <span className="text-stone-500">Revenue</span><span className="text-cream-100 font-medium tabular-nums">${p?.revenue.toFixed(0) || '0'}</span>
            </div>
          </div>
        ); })}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-md border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between"><p className="text-[15px] font-medium text-cream-50">Add barber</p><button onClick={() => setShowModal(false)} className="text-stone-500 text-[13px]">Close</button></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Skills (comma-separated)</label><input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
