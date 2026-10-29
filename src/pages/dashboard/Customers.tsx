import React, { useState, useEffect } from 'react';
import { CustomerService, BarberService, InvoiceService } from '../../services/db';
import { Customer } from '../../types';
import { Search, Plus, X, User, Phone, Mail } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredBarberId: '', notes: '' });
  const barbers = BarberService.getAll();

  const load = () => {
    const result = CustomerService.getAll(page, 20, search);
    setCustomers(result.data);
    setTotal(result.total);
  };

  useEffect(() => { load(); }, [page, search]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    CustomerService.create(form);
    setShowModal(false);
    setForm({ name: '', phone: '', email: '', preferredBarberId: '', notes: '' });
    load();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCustomer) {
      CustomerService.update(selectedCustomer.id, form);
      setSelectedCustomer(null);
      setForm({ name: '', phone: '', email: '', preferredBarberId: '', notes: '' });
      load();
    }
  };

  const openEdit = (c: Customer) => {
    setSelectedCustomer(c);
    setForm({ name: c.name, phone: c.phone, email: c.email || '', preferredBarberId: c.preferredBarberId || '', notes: c.notes || '' });
  };

  const customerInvoices = selectedCustomer ? InvoiceService.getAll().filter(i => i.customerId === selectedCustomer.id) : [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Customers</h1>
          <p className="text-[13px] text-surface-500">{total} total customers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
          <Plus size={15} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200/60 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
      </div>

      {/* Table */}
      <div className="bg-white border border-surface-200/60 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Customer</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Phone</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Email</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Total Spent</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Loyalty</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Preferred</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-surface-400">No customers found</td></tr>
            ) : customers.map(c => (
              <tr key={c.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-surface-600 to-surface-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{c.name.charAt(0)}</div>
                    <span className="font-semibold text-surface-900">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-surface-600">{c.phone}</td>
                <td className="px-5 py-3.5 text-surface-500">{c.email || '—'}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-surface-900">${c.totalSpent.toFixed(0)}</td>
                <td className="px-5 py-3.5 text-right"><span className="text-[12px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5">{c.loyaltyPoints} pts</span></td>
                <td className="px-5 py-3.5 text-surface-600">{barbers.find(b => b.id === c.preferredBarberId)?.name || '—'}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => openEdit(c)} className="text-[12px] text-brand-600 hover:text-brand-700 font-semibold">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-surface-500">Page {page} of {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-[12px] border border-surface-200 disabled:opacity-40 hover:bg-surface-50 transition-colors font-medium">Previous</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="px-3 py-1.5 text-[12px] border border-surface-200 disabled:opacity-40 hover:bg-surface-50 transition-colors font-medium">Next</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {(showModal || selectedCustomer) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 sticky top-0 bg-white z-10">
              <h2 className="text-[16px] font-bold text-surface-900">{selectedCustomer ? 'Edit Customer' : 'New Customer'}</h2>
              <button onClick={() => { setShowModal(false); setSelectedCustomer(null); setForm({ name: '', phone: '', email: '', preferredBarberId: '', notes: '' }); }} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={selectedCustomer ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Preferred Barber</label>
                <select value={form.preferredBarberId} onChange={e => setForm({ ...form, preferredBarberId: e.target.value })} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white">
                  <option value="">None</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 resize-none transition-colors" />
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-surface-50 border border-surface-200">
                  <h3 className="text-[12px] font-semibold text-surface-700 uppercase tracking-wider mb-3">Customer Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div><span className="text-surface-500">Total Spent:</span> <span className="font-bold text-surface-900">${selectedCustomer.totalSpent.toFixed(0)}</span></div>
                    <div><span className="text-surface-500">Loyalty:</span> <span className="font-bold text-amber-600">{selectedCustomer.loyaltyPoints} pts</span></div>
                    <div><span className="text-surface-500">Visits:</span> <span className="font-bold text-surface-900">{customerInvoices.length}</span></div>
                    <div><span className="text-surface-500">Since:</span> <span className="font-medium text-surface-700">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
                  {selectedCustomer ? 'Update Customer' : 'Create Customer'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedCustomer(null); }} className="px-5 py-3 border border-surface-200 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
