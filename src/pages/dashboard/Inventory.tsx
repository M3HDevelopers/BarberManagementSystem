import React, { useState } from 'react';
import { ProductService } from '../../services/db';
import { Product } from '../../types';

export default function Inventory() {
  const [products, setProducts] = useState(ProductService.getAll());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', category: '', type: 'retail' as 'retail' | 'consumable', purchasePrice: 0, sellingPrice: 0, quantity: 0, reorderLevel: 5 });
  const lowStock = products.filter(p => p.quantity <= p.reorderLevel);
  const refresh = () => setProducts(ProductService.getAll());
  const handleSave = (e: React.FormEvent) => { e.preventDefault(); ProductService.create({ ...form, supplier: '', active: true }); refresh(); setShowModal(false); };
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Inventory</h1><p className="text-[13px] text-stone-500 mt-0.5">{products.length} products · {lowStock.length} low stock</p></div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100">Add</button>
      </div>
      {lowStock.length > 0 && <div className="p-4 bg-oxblood-800/20 border border-oxblood-700/30"><p className="text-[12px] text-oxblood-400 font-medium mb-2">Low stock alert</p><div className="flex flex-wrap gap-1.5">{lowStock.map(p => <span key={p.id} className="px-2 py-0.5 bg-oxblood-800/30 text-oxblood-300 text-[11px]">{p.name} ({p.quantity})</span>)}</div></div>}
      <div className="bg-stone-900 overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead><tr className="border-b hairline-dark"><th className="text-left px-5 py-3 text-[11px] text-stone-500 font-medium">Product</th><th className="text-left px-5 py-3 text-[11px] text-stone-500 font-medium">SKU</th><th className="text-right px-5 py-3 text-[11px] text-stone-500 font-medium">Qty</th><th className="text-right px-5 py-3 text-[11px] text-stone-500 font-medium">Cost</th><th className="text-right px-5 py-3 text-[11px] text-stone-500 font-medium">Price</th></tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id} className="border-b hairline-dark hover:bg-cream-50/[0.02] transition-colors">
              <td className="px-5 py-3 text-cream-100 font-medium">{p.name}</td>
              <td className="px-5 py-3 text-stone-500 font-mono text-[11px]">{p.sku}</td>
              <td className={`px-5 py-3 text-right font-medium tabular-nums ${p.quantity <= p.reorderLevel ? 'text-oxblood-500' : 'text-cream-100'}`}>{p.quantity}</td>
              <td className="px-5 py-3 text-right text-stone-400 tabular-nums">${p.purchasePrice.toFixed(2)}</td>
              <td className="px-5 py-3 text-right text-cream-100 tabular-nums">${p.sellingPrice.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-md border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between"><p className="text-[15px] font-medium text-cream-50">Add product</p><button onClick={() => setShowModal(false)} className="text-stone-500 text-[13px]">Close</button></div>
            <form onSubmit={handleSave} className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-[12px] text-stone-400 mb-1.5">Name</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div><div><label className="block text-[12px] text-stone-400 mb-1.5">SKU</label><input type="text" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-[12px] text-stone-400 mb-1.5">Cost</label><input type="number" step="0.01" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div><div><label className="block text-[12px] text-stone-400 mb-1.5">Price</label><input type="number" step="0.01" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><label className="block text-[12px] text-stone-400 mb-1.5">Quantity</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div><div><label className="block text-[12px] text-stone-400 mb-1.5">Reorder at</label><input type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: Number(e.target.value)})} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium mt-2">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
