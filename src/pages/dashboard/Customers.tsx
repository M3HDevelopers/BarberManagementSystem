import React, { useState, useEffect } from 'react';
import { CustomerService, BarberService } from '../../services/db';
import { Customer } from '../../types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const barbers = BarberService.getAll();
  const load = () => setCustomers(CustomerService.getAll(1, 50, search).data);
  useEffect(() => { load(); }, [search]);
  const handleCreate = (e: React.FormEvent) => { e.preventDefault(); CustomerService.create(form); setShowModal(false); setForm({ name: '', phone: '', email: '' }); load(); };

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Customers</h1>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100 transition-colors">Add</button>
      </div>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full max-w-sm px-4 py-2.5 bg-stone-900 border border-stone-800 text-[13px] text-cream-100 focus:outline-none focus:border-stone-600" />
      <div className="bg-stone-900">
        <table className="w-full text-[13px]">
          <thead><tr className="border-b hairline-dark"><th className="text-left px-5 py-3 text-[11px] text-stone-500 font-medium">Name</th><th className="text-left px-5 py-3 text-[11px] text-stone-500 font-medium">Phone</th><th className="text-right px-5 py-3 text-[11px] text-stone-500 font-medium">Spent</th><th className="text-right px-5 py-3 text-[11px] text-stone-500 font-medium">Loyalty</th></tr></thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b hairline-dark hover:bg-cream-50/[0.02] transition-colors">
                <td className="px-5 py-3 text-cream-100 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-stone-400 tabular-nums">{c.phone}</td>
                <td className="px-5 py-3 text-right text-cream-100 tabular-nums">${c.totalSpent}</td>
                <td className="px-5 py-3 text-right text-stone-400 tabular-nums">{c.loyaltyPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-md border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between"><p className="text-[15px] font-medium text-cream-50">New customer</p><button onClick={() => setShowModal(false)} className="text-stone-500 text-[13px]">Close</button></div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Phone</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
