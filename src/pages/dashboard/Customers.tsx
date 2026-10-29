import React, { useState, useEffect } from 'react';
import { CustomerService, BarberService, InvoiceService, ServiceService } from '../../services/db';
import { Customer, Barber } from '../../types';
import { Search, Plus, X, User, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Customers</h1>
          <p className="text-sm text-charcoal-500">{total} total customers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
          <Plus size={16} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
        <input type="text" placeholder="Search by name, phone, email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
      </div>

      {/* Table */}
      <div className="bg-white border border-charcoal-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-100 bg-charcoal-50">
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Email</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Total Spent</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Loyalty Points</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Preferred Barber</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-charcoal-400">No customers found</td></tr>
            ) : customers.map(c => (
              <tr key={c.id} className="border-b border-charcoal-50 hover:bg-charcoal-50 cursor-pointer" onClick={() => openEdit(c)}>
                <td className="px-4 py-3 font-medium text-charcoal-900">{c.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{c.phone}</td>
                <td className="px-4 py-3 text-charcoal-600">{c.email || '—'}</td>
                <td className="px-4 py-3 font-medium">${c.totalSpent.toFixed(0)}</td>
                <td className="px-4 py-3">{c.loyaltyPoints}</td>
                <td className="px-4 py-3 text-charcoal-600">{barbers.find(b => b.id === c.preferredBarberId)?.name || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={e => { e.stopPropagation(); openEdit(c); }} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-charcoal-500">Page {page} of {Math.ceil(total / 20)}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-charcoal-300 disabled:opacity-50 hover:bg-charcoal-50">Previous</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 20)} className="px-3 py-1.5 text-sm border border-charcoal-300 disabled:opacity-50 hover:bg-charcoal-50">Next</button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showModal || selectedCustomer) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold text-charcoal-900">{selectedCustomer ? 'Edit Customer' : 'New Customer'}</h2>
              <button onClick={() => { setShowModal(false); setSelectedCustomer(null); setForm({ name: '', phone: '', email: '', preferredBarberId: '', notes: '' }); }} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={selectedCustomer ? handleUpdate : handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Phone *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Preferred Barber</label>
                <select value={form.preferredBarberId} onChange={e => setForm({ ...form, preferredBarberId: e.target.value })} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900">
                  <option value="">None</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900 resize-none" />
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-charcoal-50 border border-charcoal-200">
                  <h3 className="text-sm font-semibold text-charcoal-900 mb-2">Customer Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-charcoal-500">Total Spent:</span> <span className="font-medium">${selectedCustomer.totalSpent.toFixed(0)}</span></div>
                    <div><span className="text-charcoal-500">Loyalty Points:</span> <span className="font-medium">{selectedCustomer.loyaltyPoints}</span></div>
                    <div><span className="text-charcoal-500">Visits:</span> <span className="font-medium">{customerInvoices.length}</span></div>
                    <div><span className="text-charcoal-500">Since:</span> <span className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
                  {selectedCustomer ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowModal(false); setSelectedCustomer(null); }} className="px-4 py-2.5 border border-charcoal-300 text-sm text-charcoal-700 hover:bg-charcoal-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
