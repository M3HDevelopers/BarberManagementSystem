import React, { useState, useEffect } from 'react';
import { ProductService } from '../../services/db';
import { Product } from '../../types';
import { Plus, X, AlertTriangle, Package, ArrowUpDown } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState(ProductService.getAll());
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockQty, setStockQty] = useState(0);
  const [stockType, setStockType] = useState<'purchase' | 'adjustment' | 'damage'>('purchase');
  const [stockReason, setStockReason] = useState('');
  const [form, setForm] = useState({ name: '', sku: '', category: '', type: 'retail' as 'retail' | 'consumable', purchasePrice: 0, sellingPrice: 0, quantity: 0, reorderLevel: 5, supplier: '', active: true });

  const refresh = () => setProducts(ProductService.getAll());
  const lowStock = products.filter(p => p.quantity <= p.reorderLevel);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      ProductService.update(editing.id, form);
    } else {
      ProductService.create(form);
    }
    refresh();
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', sku: '', category: '', type: 'retail', purchasePrice: 0, sellingPrice: 0, quantity: 0, reorderLevel: 5, supplier: '', active: true });
  };

  const handleStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockProduct && stockQty !== 0) {
      const qty = stockType === 'purchase' ? stockQty : stockType === 'damage' ? -Math.abs(stockQty) : stockQty;
      ProductService.adjustStock(stockProduct.id, qty, stockType, stockReason, 'u1');
      refresh();
      setShowStockModal(false);
      setStockQty(0);
      setStockReason('');
    }
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, category: p.category, type: p.type, purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, quantity: p.quantity, reorderLevel: p.reorderLevel, supplier: p.supplier || '', active: p.active });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Inventory</h1>
          <p className="text-sm text-charcoal-500">{products.length} products • {lowStock.length} low stock alerts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-4">
          <h3 className="text-sm font-semibold text-yellow-800 flex items-center gap-2 mb-2"><AlertTriangle size={14} /> Low Stock Alert</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(p => (
              <span key={p.id} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium">{p.name} ({p.quantity} left)</span>
            ))}
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-charcoal-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal-100 bg-charcoal-50">
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">SKU</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Type</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Category</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Qty</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Purchase</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Sell</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-charcoal-50 hover:bg-charcoal-50">
                <td className="px-4 py-3 font-medium text-charcoal-900">{p.name}</td>
                <td className="px-4 py-3 text-charcoal-600">{p.sku}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium ${p.type === 'retail' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{p.type}</span></td>
                <td className="px-4 py-3 text-charcoal-600">{p.category}</td>
                <td className={`px-4 py-3 text-right font-medium ${p.quantity <= p.reorderLevel ? 'text-red-600' : 'text-charcoal-900'}`}>{p.quantity}</td>
                <td className="px-4 py-3 text-right text-charcoal-600">${p.purchasePrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-medium">${p.sellingPrice.toFixed(2)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-charcoal-100 text-charcoal-600'}`}>{p.active ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                    <button onClick={() => { setStockProduct(p); setShowStockModal(true); }} className="text-xs text-charcoal-600 hover:text-charcoal-900 font-medium flex items-center gap-0.5"><ArrowUpDown size={12} /> Stock</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">SKU *</label><input type="text" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900"><option value="retail">Retail</option><option value="consumable">Consumable</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Purchase Price</label><input type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Selling Price</label><input type="number" step="0.01" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
                <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Reorder Level</label><input type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: Number(e.target.value)})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              </div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Supplier</label><input type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2.5 border border-charcoal-300 text-sm text-charcoal-700 hover:bg-charcoal-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showStockModal && stockProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold">Adjust Stock: {stockProduct.name}</h2>
              <button onClick={() => setShowStockModal(false)} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleStockAdjust} className="p-6 space-y-4">
              <p className="text-sm text-charcoal-600">Current stock: <span className="font-bold">{stockProduct.quantity}</span></p>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Type</label><select value={stockType} onChange={e => setStockType(e.target.value as any)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900"><option value="purchase">Purchase (add)</option><option value="adjustment">Adjustment</option><option value="damage">Damage/Loss (subtract)</option></select></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Quantity</label><input type="number" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <div><label className="block text-sm font-medium text-charcoal-700 mb-1">Reason</label><input type="text" value={stockReason} onChange={e => setStockReason(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required /></div>
              <button type="submit" className="w-full py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">Apply Adjustment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
