import React, { useState } from 'react';
import { ProductService } from '../../services/db';
import { Product } from '../../types';
import { Plus, X, AlertTriangle, ArrowUpDown, Package } from 'lucide-react';

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
    if (editing) ProductService.update(editing.id, form);
    else ProductService.create(form);
    refresh(); setShowModal(false); setEditing(null);
    setForm({ name: '', sku: '', category: '', type: 'retail', purchasePrice: 0, sellingPrice: 0, quantity: 0, reorderLevel: 5, supplier: '', active: true });
  };

  const handleStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (stockProduct && stockQty !== 0) {
      const qty = stockType === 'purchase' ? stockQty : stockType === 'damage' ? -Math.abs(stockQty) : stockQty;
      ProductService.adjustStock(stockProduct.id, qty, stockType, stockReason, 'u1');
      refresh(); setShowStockModal(false); setStockQty(0); setStockReason('');
    }
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, category: p.category, type: p.type, purchasePrice: p.purchasePrice, sellingPrice: p.sellingPrice, quantity: p.quantity, reorderLevel: p.reorderLevel, supplier: p.supplier || '', active: p.active });
    setShowModal(true);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Inventory</h1>
          <p className="text-[13px] text-surface-500">{products.length} products · {lowStock.length} low stock</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800 mb-1">Low Stock Alert</p>
            <div className="flex flex-wrap gap-1.5">
              {lowStock.map(p => (
                <span key={p.id} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-medium">{p.name} ({p.quantity})</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-surface-200/60 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Product</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">SKU</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Type</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Qty</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Cost</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Price</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-surface-900">{p.name}</p>
                  <p className="text-[11px] text-surface-400">{p.category}</p>
                </td>
                <td className="px-5 py-3.5 text-surface-500 font-mono text-[12px]">{p.sku}</td>
                <td className="px-5 py-3.5"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${p.type === 'retail' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>{p.type}</span></td>
                <td className={`px-5 py-3.5 text-right font-bold ${p.quantity <= p.reorderLevel ? 'text-red-600' : 'text-surface-900'}`}>{p.quantity}</td>
                <td className="px-5 py-3.5 text-right text-surface-500">${p.purchasePrice.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right font-semibold text-surface-900">${p.sellingPrice.toFixed(2)}</td>
                <td className="px-5 py-3.5"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-100 text-surface-500'}`}>{p.active ? 'Active' : 'Inactive'}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold">Edit</button>
                    <button onClick={() => { setStockProduct(p); setShowStockModal(true); }} className="text-[11px] text-surface-500 hover:text-surface-900 font-semibold flex items-center gap-0.5"><ArrowUpDown size={10} /> Stock</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 sticky top-0 bg-white z-10">
              <h2 className="text-[16px] font-bold text-surface-900">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">SKU *</label><input type="text" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Category</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white"><option value="retail">Retail</option><option value="consumable">Consumable</option></select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Purchase Price</label><input type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Selling Price</label><input type="number" step="0.01" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
                <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Reorder Level</label><input type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: Number(e.target.value)})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              </div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Supplier</label><input type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" /></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="px-5 py-3 border border-surface-200 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Modal */}
      {showStockModal && stockProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-[16px] font-bold text-surface-900">Adjust Stock</h2>
              <button onClick={() => setShowStockModal(false)} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleStockAdjust} className="p-6 space-y-4">
              <div className="p-3 bg-surface-50 border border-surface-200 text-center">
                <p className="text-[11px] text-surface-400 uppercase tracking-wider">{stockProduct.name}</p>
                <p className="text-[24px] font-bold text-surface-900">Current: {stockProduct.quantity}</p>
              </div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Type</label><select value={stockType} onChange={e => setStockType(e.target.value as any)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white"><option value="purchase">Purchase (add)</option><option value="adjustment">Adjustment</option><option value="damage">Damage/Loss (subtract)</option></select></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Quantity</label><input type="number" value={stockQty} onChange={e => setStockQty(Number(e.target.value))} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <div><label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Reason</label><input type="text" value={stockReason} onChange={e => setStockReason(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required /></div>
              <button type="submit" className="w-full py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">Apply Adjustment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
