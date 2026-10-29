import React, { useState, useEffect } from 'react';
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
    if (editingService) {
      ServiceService.update(editingService.id, serviceForm);
    } else {
      ServiceService.create(serviceForm);
    }
    setServices(ServiceService.getAllIncludingInactive());
    setShowServiceModal(false);
    setEditingService(null);
    setServiceForm({ name: '', description: '', price: 0, duration: 30, category: 'Hair', active: true });
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    ExpenseService.create({ ...expenseForm, recordedBy: 'u1' });
    setShowExpenseModal(false);
    setExpenseForm({ category: '', description: '', amount: 0, supplier: '', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900">Settings</h1>
        <p className="text-sm text-charcoal-500">Configure shop preferences and manage services</p>
      </div>

      {/* Shop Settings */}
      <div className="bg-white border border-charcoal-200 p-6">
        <h2 className="text-lg font-semibold text-charcoal-900 mb-4 flex items-center gap-2"><SettingsIcon size={18} /> Shop Settings</h2>
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Shop Name</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Phone</label><input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Email</label><input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Address</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Buffer Time (minutes)</label><input type="number" value={settings.bufferTime} onChange={e => setSettings({...settings, bufferTime: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
            <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Currency</label><input type="text" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.taxEnabled} onChange={e => setSettings({...settings, taxEnabled: e.target.checked})} className="border-charcoal-300" /> Enable Tax</label>
            {settings.taxEnabled && <input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: Number(e.target.value)})} className="w-20 px-3 py-1.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" placeholder="Rate %" />}
          </div>
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-charcoal-700">Loyalty Points per Dollar</label>
            <input type="number" value={settings.loyaltyPointsPerDollar} onChange={e => setSettings({...settings, loyaltyPointsPerDollar: Number(e.target.value)})} className="w-20 px-3 py-1.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
              <Save size={16} /> Save Settings
            </button>
            {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
          </div>
        </form>
      </div>

      {/* Services Management */}
      <div className="bg-white border border-charcoal-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Services</h2>
          <button onClick={() => setShowServiceModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800">
            <Plus size={14} /> Add Service
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-charcoal-100">
              <th className="text-left py-2 font-medium text-charcoal-500">Name</th>
              <th className="text-left py-2 font-medium text-charcoal-500">Category</th>
              <th className="text-right py-2 font-medium text-charcoal-500">Price</th>
              <th className="text-right py-2 font-medium text-charcoal-500">Duration</th>
              <th className="text-left py-2 font-medium text-charcoal-500">Status</th>
              <th className="text-left py-2 font-medium text-charcoal-500">Actions</th>
            </tr></thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className="border-b border-charcoal-50">
                  <td className="py-2 font-medium text-charcoal-900">{s.name}</td>
                  <td className="py-2 text-charcoal-600">{s.category}</td>
                  <td className="py-2 text-right">${s.price}</td>
                  <td className="py-2 text-right">{s.duration} min</td>
                  <td className="py-2"><span className={`px-2 py-0.5 text-xs font-medium ${s.active ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-600'}`}>{s.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="py-2"><button onClick={() => { setEditingService(s); setServiceForm({ name: s.name, description: s.description, price: s.price, duration: s.duration, category: s.category, active: s.active }); setShowServiceModal(true); }} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white border border-charcoal-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-charcoal-900">Record Expense</h2>
          <button onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800">
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold">{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveService} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label><input type="text" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Description</label><textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900 resize-none" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Price *</label><input type="number" step="0.01" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Duration (min)</label><input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Category</label><input type="text" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={serviceForm.active} onChange={e => setServiceForm({...serviceForm, active: e.target.checked})} className="border-charcoal-300" /> Active</label>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">{editingService ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowServiceModal(false); setEditingService(null); }} className="px-4 py-2.5 border border-charcoal-300 text-sm text-charcoal-700 hover:bg-charcoal-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold">Record Expense</h2>
              <button onClick={() => setShowExpenseModal(false)} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Category *</label><select value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required><option value="">Select</option><option value="Rent">Rent</option><option value="Utilities">Utilities</option><option value="Supplies">Supplies</option><option value="Equipment">Equipment</option><option value="Marketing">Marketing</option><option value="Other">Other</option></select></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Description *</label><input type="text" value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Amount *</label><input type="number" step="0.01" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Supplier</label><input type="text" value={expenseForm.supplier} onChange={e => setExpenseForm({...expenseForm, supplier: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Date</label><input type="date" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              <button type="submit" className="w-full py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">Record Expense</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
