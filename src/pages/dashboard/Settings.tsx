import * as React from 'react';
import { useState } from 'react';
import { SettingsService, ServiceService } from '../../services/db';
import { Service } from '../../types';

export default function Settings() {
  const [settings, setSettings] = useState(SettingsService.get());
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState(ServiceService.getAllIncludingInactive());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0, duration: 30, category: 'Hair', active: true });
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); SettingsService.update(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleSaveService = (e: React.FormEvent) => { e.preventDefault(); if (editing) ServiceService.update(editing.id, form); else ServiceService.create(form); setServices(ServiceService.getAllIncludingInactive()); setShowModal(false); setEditing(null); };
  return (
    <div className="space-y-6 animate-fade">
      <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Settings</h1>
      <div className="bg-stone-900 p-6">
        <p className="text-[14px] font-medium text-cream-100 mb-5">Shop details</p>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-[12px] text-stone-400 mb-1.5">Name</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
            <div><label className="block text-[12px] text-stone-400 mb-1.5">Phone</label><input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
            <div><label className="block text-[12px] text-stone-400 mb-1.5">Email</label><input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
            <div><label className="block text-[12px] text-stone-400 mb-1.5">Address</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100 transition-colors">Save</button>
            {saved && <span className="text-[12px] text-emerald-400">Saved</span>}
          </div>
        </form>
      </div>
      <div className="bg-stone-900">
        <div className="px-6 py-4 border-b hairline-dark flex items-center justify-between">
          <p className="text-[14px] font-medium text-cream-100">Services</p>
          <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: 0, duration: 30, category: 'Hair', active: true }); setShowModal(true); }} className="px-3 py-1.5 bg-cream-50 text-stone-900 text-[11px] font-medium">Add</button>
        </div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b hairline-dark"><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Name</th><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Category</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Price</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Duration</th><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Action</th></tr></thead>
          <tbody>{services.map(s => (
            <tr key={s.id} className="border-b hairline-dark hover:bg-cream-50/[0.02]">
              <td className="px-5 py-2.5 text-cream-100 font-medium">{s.name}</td>
              <td className="px-5 py-2.5 text-stone-500">{s.category}</td>
              <td className="px-5 py-2.5 text-right text-cream-100 tabular-nums">${s.price}</td>
              <td className="px-5 py-2.5 text-right text-stone-400 tabular-nums">{s.duration}m</td>
              <td className="px-5 py-2.5"><button onClick={() => { setEditing(s); setForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, active: s.active }); setShowModal(true); }} className="text-[11px] text-oxblood-500 hover:text-oxblood-400 font-medium">Edit</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-md border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between"><p className="text-[15px] font-medium text-cream-50">{editing ? 'Edit' : 'Add'} service</p><button onClick={() => setShowModal(false)} className="text-stone-500 text-[13px]">Close</button></div>
            <form onSubmit={handleSaveService} className="p-6 space-y-3">
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none resize-none" /></div>
              <div className="grid grid-cols-3 gap-3"><div><label className="block text-[12px] text-stone-400 mb-1.5">Price</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div><div><label className="block text-[12px] text-stone-400 mb-1.5">Duration</label><input type="number" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div><div><label className="block text-[12px] text-stone-400 mb-1.5">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium mt-2">{editing ? 'Update' : 'Create'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
