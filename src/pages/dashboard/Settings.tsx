import React, { useState } from 'react';
import { SettingsService, ServiceService, ExpenseService } from '../../services/db';
import { ShopSettings, Service } from '../../types';
import { Save, Plus, X, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(SettingsService.get());
  const [saved, setSaved] = useState(false);
  const [services, setServices] = useState(ServiceService.getAllIncludingInactive());
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: 0, duration: 30, category: 'Hair', active: true });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ category: '', description: '', amount: 0, supplier: '', date: new Date().toISOString().split('T')[0] });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    SettingsService.update(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) ServiceService.update(editingService.id, serviceForm);
    else ServiceService.create(serviceForm);
    setServices(ServiceService.getAllIncludingInactive());
    setShowServiceModal(false); setEditingService(null);
    setServiceForm({ name: '', description: '', price: 0, duration: 30, category: 'Hair', active: true });
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    ExpenseService.create({ ...expenseForm, recordedBy: 'u1' });
    setShowExpenseModal(false);
    setExpenseForm({ category: '', description: '', amount: 0, supplier: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Settings</h1>
        <p className="text-[13px] text-surface-500">Configure shop preferences and manage services</p>
      </div>

      {/* Shop Settings */}
      <div className="bg-white border border-surface-200/60 p-6">
        <h2 className="text-[15px] font-bold text-surface-900 mb-5 flex items-center gap-2"><SettingsIcon size={16} /> Shop Settings</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Shop Name</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Phone</label><input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email</label><input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Address</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Buffer Time (min)</label><input type="number" value={settings.bufferTime} onChange={e => setSettings({...settings, bufferTime: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
            <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Currency</label><input type="text" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={settings.taxEnabled} onChange={e => setSettings({...settings, taxEnabled: e.target.checked})} className="border-surface-300 accent-surface-900" /> Enable Tax</label>
            {settings.taxEnabled && <input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: Number(e.target.value)})} className="w-20 px-3 py-2 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
              <Save size={14} /> Save Settings
            </button>
            {saved && <span className="text-[12px] text-emerald-600 font-semibold animate-fade-in">✓ Saved!</span>}
          </div>
        </form>
      </div>

      {/* Services */}
      <div className="bg-white border border-surface-200/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-surface-900">Services</h2>
          <button onClick={() => setShowServiceModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-900 text-white text-[11px] font-semibold hover:bg-surface-800 transition-colors">
            <Plus size={12} /> Add Service
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-surface-100">
              <th className="text-left py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Name</th>
              <th className="text-left py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Category</th>
              <th className="text-right py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Price</th>
              <th className="text-right py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Duration</th>
              <th className="text-left py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Action</th>
            </tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="py-3 font-semibold text-surface-900">{s.name}</td>
                  <td className="py-3 text-surface-500">{s.category}</td>
                  <td className="py-3 text-right font-bold">${s.price}</td>
                  <td className="py-3 text-right text-surface-500">{s.duration} min</td>
                  <td className="py-3"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.active ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-500'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-3"><button onClick={() => { setEditingService(s); setServiceForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, active: s.active }); setShowServiceModal(true); }} className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white border border-surface-200/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-bold text-surface-900">Record Expense</h2>
          <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-900 text-white text-[11px] font-semibold hover:bg-surface-800 transition-colors">
            <Plus size={12} /> Add Expense
          </button>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-[16px] font-bold text-surface-900">{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Description</label><textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows={2} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 resize-none transition-colors" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Price *</label><input type="number" step="0.01" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Duration</label><input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Category</label><input type="text" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              </div>
              <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={serviceForm.active} onChange={e => setServiceForm({...serviceForm, active: e.target.checked})} className="border-surface-300 accent-surface-900" /> Active</label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">{editingService ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="px-5 py-3 border border-surface-200 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-[16px] font-bold text-surface-900">Record Expense</h2>
              <button onClick={() => setShowExpenseModal(false)} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Category *</label><select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white" required><option value="">Select</option><option value="Rent">Rent</option><option value="Utilities">Utilities</option><option value="Supplies">Supplies</option><option value="Equipment">Equipment</option><option value="Marketing">Marketing</option><option value="Other">Other</option></select></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Description *</label><input type="text" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Amount *</label><input type="number" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Supplier</label><input type="text" value={expenseForm.supplier} onChange={e => setExpenseForm({...expenseForm, supplier: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Date</label><input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              <button type="submit" className="w-full py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">Record Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
