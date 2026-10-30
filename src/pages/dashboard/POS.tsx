import React, { useState } from 'react';
import { ServiceService, ProductService, BarberService, CustomerService, InvoiceService } from '../../services/db';
import { InvoiceItem, PaymentMethod } from '../../types';

export default function POS() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerId, setCustomerId] = useState(''); const [barberId, setBarberId] = useState(''); const [discount, setDiscount] = useState(0);
  const [showPayment, setShowPayment] = useState(false); const [paymentAmount, setPaymentAmount] = useState(0); const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const services = ServiceService.getAll(); const products = ProductService.getAll().filter(p => p.type === 'retail' && p.active);
  const barbers = BarberService.getAll(); const customers = CustomerService.getAll(1, 1000).data;
  const addItem = (type: 'service' | 'product', itemId: string, name: string, price: number) => {
    const existing = items.find(i => i.itemId === itemId && i.type === type);
    if (existing) setItems(items.map(i => i.itemId === itemId && i.type === type ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i));
    else setItems([...items, { type, itemId, name, quantity: 1, unitPrice: price, total: price }]);
  };
  const subtotal = items.reduce((s, i) => s + i.total, 0); const total = Math.max(0, subtotal - discount);
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault(); if (!barberId || items.length === 0) return;
    const invoice = InvoiceService.create({ customerId: customerId || 'walk-in', barberId, items, discount });
    if (paymentAmount > 0) InvoiceService.addPayment(invoice.id, paymentAmount, paymentMethod);
    setItems([]); setCustomerId(''); setBarberId(''); setDiscount(0); setShowPayment(false);
  };
  return (
    <div className="space-y-5 animate-fade">
      <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Point of Sale</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3 bg-stone-900 p-4">
            <div><label className="block text-[11px] text-stone-500 mb-1">Customer</label><select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[12px] text-cream-100 focus:outline-none"><option value="">Walk-in</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-[11px] text-stone-500 mb-1">Barber</label><select value={barberId} onChange={e => setBarberId(e.target.value)} className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-[12px] text-cream-100 focus:outline-none" required><option value="">Select</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
          </div>
          <div className="bg-stone-900 p-4"><p className="text-[12px] text-stone-400 mb-3">Services</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{services.map(s => <button key={s.id} onClick={() => addItem('service', s.id, s.name, s.price)} className="p-2.5 bg-stone-950 border border-stone-800 text-left hover:border-stone-600 transition-colors"><p className="text-[11px] font-medium text-cream-100 truncate">{s.name}</p><p className="text-[11px] text-stone-500 mt-0.5 tabular-nums">${s.price}</p></button>)}</div></div>
          <div className="bg-stone-900 p-4"><p className="text-[12px] text-stone-400 mb-3">Products</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{products.map(p => <button key={p.id} onClick={() => addItem('product', p.id, p.name, p.sellingPrice)} className="p-2.5 bg-stone-950 border border-stone-800 text-left hover:border-stone-600 transition-colors"><p className="text-[11px] font-medium text-cream-100 truncate">{p.name}</p><p className="text-[11px] text-stone-500 mt-0.5 tabular-nums">${p.sellingPrice}</p></button>)}</div></div>
        </div>
        <div className="bg-stone-900 p-4 flex flex-col">
          <p className="text-[13px] font-medium text-cream-100 mb-3">Current bill</p>
          <div className="flex-1 space-y-1.5 min-h-[200px]">
            {items.length === 0 ? <p className="text-[12px] text-stone-600 text-center py-8">No items</p> : items.map(item => (
              <div key={`${item.type}-${item.itemId}`} className="flex items-center justify-between p-2 bg-stone-950/50">
                <div className="flex-1 min-w-0"><p className="text-[12px] text-cream-100 truncate">{item.name}</p><p className="text-[10px] text-stone-500">x{item.quantity}</p></div>
                <span className="text-[12px] text-cream-100 tabular-nums">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t hairline-dark pt-3 mt-3 space-y-1.5">
            <div className="flex justify-between text-[12px]"><span className="text-stone-500">Subtotal</span><span className="text-stone-300 tabular-nums">${subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between text-[12px]"><span className="text-stone-500">Discount</span><input type="number" value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-16 px-2 py-1 bg-stone-950 border border-stone-800 text-[12px] text-cream-100 text-right focus:outline-none" /></div>
            <div className="flex justify-between text-[16px] font-medium pt-2 border-t hairline-dark"><span className="text-cream-100">Total</span><span className="text-cream-50 tabular-nums">${total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => { if (items.length > 0 && barberId) { setPaymentAmount(total); setShowPayment(true); } }} disabled={items.length === 0 || !barberId} className="mt-4 w-full py-3 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100 disabled:opacity-40 transition-colors">Process payment</button>
        </div>
      </div>
      {showPayment && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-sm border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between"><p className="text-[15px] font-medium text-cream-50">Payment</p><button onClick={() => setShowPayment(false)} className="text-stone-500 text-[13px]">Close</button></div>
            <form onSubmit={handlePayment} className="p-6 space-y-4">
              <div className="text-center p-4 bg-stone-950"><p className="text-[24px] font-medium text-cream-50 tabular-nums">${total.toFixed(2)}</p></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Amount</label><input type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} step="0.01" className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" /></div>
              <div><label className="block text-[12px] text-stone-400 mb-2">Method</label><div className="grid grid-cols-2 gap-2">{(['cash','card','mobile','prepaid'] as PaymentMethod[]).map(m => <button key={m} type="button" onClick={() => setPaymentMethod(m)} className={`p-2.5 border text-[12px] font-medium capitalize ${paymentMethod === m ? 'border-cream-50 bg-cream-50 text-stone-900' : 'border-stone-800 text-stone-400 hover:border-stone-600'}`}>{m}</button>)}</div></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium">Complete</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
