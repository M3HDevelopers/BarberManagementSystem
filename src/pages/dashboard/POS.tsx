import React, { useState, useEffect } from 'react';
import { ServiceService, ProductService, BarberService, CustomerService, InvoiceService } from '../../services/db';
import { Invoice, InvoiceItem, PaymentMethod } from '../../types';
import { Plus, Minus, Trash2, X, CreditCard, DollarSign, Smartphone, Receipt, Check, Search } from 'lucide-react';

export default function POS() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [barberId, setBarberId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');

  const services = ServiceService.getAll();
  const products = ProductService.getAll().filter(p => p.type === 'retail' && p.active);
  const barbers = BarberService.getAll();
  const customers = CustomerService.getAll(1, 1000).data;

  useEffect(() => { setRecentInvoices(InvoiceService.getAll().slice(0, 10)); }, []);

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addItem = (type: 'service' | 'product', itemId: string, name: string, price: number) => {
    const existing = items.find(i => i.itemId === itemId && i.type === type);
    if (existing) {
      setItems(items.map(i => i.itemId === itemId && i.type === type ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i));
    } else {
      setItems([...items, { type, itemId, name, quantity: 1, unitPrice: price, total: price }]);
    }
  };

  const updateQty = (itemId: string, type: string, delta: number) => {
    setItems(items.map(i => {
      if (i.itemId === itemId && i.type === type) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty, total: newQty * i.unitPrice };
      }
      return i;
    }));
  };

  const removeItem = (itemId: string, type: string) => {
    setItems(items.filter(i => !(i.itemId === itemId && i.type === type)));
  };

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const total = Math.max(0, subtotal - discount);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barberId || items.length === 0) return;
    
    const invoice = InvoiceService.create({
      customerId: customerId || 'walk-in',
      barberId,
      items,
      discount,
    });

    if (paymentAmount > 0) {
      InvoiceService.addPayment(invoice.id, paymentAmount, paymentMethod);
    }

    const updated = InvoiceService.getById(invoice.id);
    setCompletedInvoice(updated);
    setItems([]);
    setCustomerId('');
    setBarberId('');
    setDiscount(0);
    setPaymentAmount(0);
    setShowPayment(false);
    setRecentInvoices(InvoiceService.getAll().slice(0, 10));
  };

  if (completedInvoice) {
    return (
      <div className="max-w-md mx-auto py-12 animate-scale-in">
        <div className="bg-white border border-surface-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 mx-auto flex items-center justify-center mb-5">
            <Check size={28} className="text-emerald-600" />
          </div>
          <h2 className="text-[20px] font-bold text-surface-900 mb-1">Payment Complete</h2>
          <p className="text-[13px] text-surface-500 mb-6">Invoice {completedInvoice.invoiceNumber}</p>
          <div className="text-left p-4 bg-surface-50 border border-surface-200 text-[13px] space-y-2 mb-6">
            {completedInvoice.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-surface-600">{item.name} ×{item.quantity}</span>
                <span className="font-medium text-surface-900">${item.total.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-surface-200 pt-2 mt-2 flex justify-between font-bold text-surface-900">
              <span>Total</span><span>${completedInvoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Paid</span><span>${completedInvoice.paid.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setCompletedInvoice(null)} className="w-full px-6 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
            New Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Point of Sale</h1>
          <p className="text-[13px] text-surface-500">Process walk-in and appointment payments</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="text-[13px] text-surface-600 hover:text-surface-900 font-medium transition-colors">
          {showHistory ? '← Back to POS' : 'View Recent Sales'}
        </button>
      </div>

      {showHistory && (
        <div className="bg-white border border-surface-200/60 overflow-x-auto animate-fade-in">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Invoice</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Total</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Paid</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Date</th>
            </tr></thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-surface-900">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5">${inv.total.toFixed(2)}</td>
                  <td className="px-5 py-3.5">${inv.paid.toFixed(2)}</td>
                  <td className="px-5 py-3.5"><span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{inv.status}</span></td>
                  <td className="px-5 py-3.5 text-surface-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!showHistory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Items Selection - Left */}
          <div className="lg:col-span-8 space-y-4">
            {/* Customer & Barber */}
            <div className="bg-white border border-surface-200/60 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Customer</label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white transition-colors">
                    <option value="">Walk-in Customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Barber *</label>
                  <select value={barberId} onChange={e => setBarberId(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white transition-colors" required>
                    <option value="">Select barber</option>
                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
              <input 
                type="text" 
                placeholder="Search services or products..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-surface-200/60 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" 
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-surface-100 p-1">
              <button onClick={() => setActiveTab('services')} className={`flex-1 py-2 text-[12px] font-semibold transition-all ${activeTab === 'services' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
                Services ({services.length})
              </button>
              <button onClick={() => setActiveTab('products')} className={`flex-1 py-2 text-[12px] font-semibold transition-all ${activeTab === 'products' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
                Products ({products.length})
              </button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {activeTab === 'services' ? filteredServices.map(s => (
                <button key={s.id} onClick={() => addItem('service', s.id, s.name, s.price)} className="p-3.5 bg-white border border-surface-200/60 hover:border-surface-900 text-left transition-all hover-lift group">
                  <p className="text-[12px] font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">{s.name}</p>
                  <p className="text-[11px] text-surface-400 mt-0.5">{s.duration} min</p>
                  <p className="text-[15px] font-bold text-surface-900 mt-2">${s.price}</p>
                </button>
              )) : filteredProducts.map(p => (
                <button key={p.id} onClick={() => addItem('product', p.id, p.name, p.sellingPrice)} className="p-3.5 bg-white border border-surface-200/60 hover:border-surface-900 text-left transition-all hover-lift group">
                  <p className="text-[12px] font-semibold text-surface-900 truncate group-hover:text-brand-600 transition-colors">{p.name}</p>
                  <p className="text-[11px] text-surface-400 mt-0.5">{p.quantity} in stock</p>
                  <p className="text-[15px] font-bold text-surface-900 mt-2">${p.sellingPrice}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Cart - Right */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-surface-200/60 sticky top-[88px]">
              <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-surface-900 flex items-center gap-2">
                  <Receipt size={15} className="text-surface-500" /> Current Bill
                </h3>
                <span className="text-[11px] text-surface-400">{items.length} items</span>
              </div>
              
              <div className="p-4 space-y-2 min-h-[240px] max-h-[350px] overflow-y-auto">
                {items.length === 0 ? (
                  <div className="text-center py-10">
                    <Receipt size={28} className="mx-auto text-surface-200 mb-2" />
                    <p className="text-[13px] text-surface-400">No items added</p>
                    <p className="text-[11px] text-surface-300 mt-1">Click items to add them</p>
                  </div>
                ) : items.map(item => (
                  <div key={`${item.type}-${item.itemId}`} className="flex items-center gap-2 p-2.5 bg-surface-50 border border-surface-100 group">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-surface-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-surface-400">${item.unitPrice} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.itemId, item.type, -1)} className="w-6 h-6 flex items-center justify-center bg-white border border-surface-200 hover:bg-surface-100 transition-colors"><Minus size={10} /></button>
                      <span className="w-6 text-center text-[12px] font-bold text-surface-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item.itemId, item.type, 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-surface-200 hover:bg-surface-100 transition-colors"><Plus size={10} /></button>
                      <button onClick={() => removeItem(item.itemId, item.type)} className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-surface-100 space-y-2.5">
                <div className="flex justify-between text-[13px]"><span className="text-surface-500">Subtotal</span><span className="font-medium text-surface-900">${subtotal.toFixed(2)}</span></div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-surface-500">Discount</span>
                  <div className="flex items-center gap-1">
                    <span className="text-surface-400 text-[12px]">$</span>
                    <input type="number" value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-16 px-2 py-1 border border-surface-200 text-[13px] text-right focus:outline-none focus:border-surface-900" />
                  </div>
                </div>
                <div className="flex justify-between text-[18px] font-bold border-t border-surface-200 pt-3">
                  <span className="text-surface-900">Total</span>
                  <span className="text-surface-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 border-t border-surface-100">
                <button 
                  onClick={() => { if (items.length > 0 && barberId) { setPaymentAmount(total); setShowPayment(true); } }} 
                  disabled={items.length === 0 || !barberId} 
                  className="w-full py-3.5 bg-surface-900 text-white font-semibold text-[13px] hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={15} />
                  Process Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-[420px] animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
              <h2 className="text-[16px] font-bold text-surface-900">Process Payment</h2>
              <button onClick={() => setShowPayment(false)} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handlePayment} className="p-6 space-y-5">
              <div className="text-center p-5 bg-surface-900 text-white">
                <p className="text-[11px] text-surface-400 uppercase tracking-wider mb-1">Amount Due</p>
                <p className="text-[32px] font-bold">${total.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Payment Amount</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} step="0.01" className="w-full px-4 py-3 border border-surface-200 text-[14px] focus:outline-none focus:border-surface-900 transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'cash', label: 'Cash', icon: DollarSign },
                    { value: 'card', label: 'Card', icon: CreditCard },
                    { value: 'mobile', label: 'Mobile', icon: Smartphone },
                    { value: 'prepaid', label: 'Prepaid', icon: Receipt },
                  ] as const).map(m => (
                    <button key={m.value} type="button" onClick={() => setPaymentMethod(m.value)} className={`p-3 border text-[12px] font-semibold flex items-center justify-center gap-2 transition-all ${paymentMethod === m.value ? 'border-surface-900 bg-surface-900 text-white' : 'border-surface-200 hover:border-surface-400 text-surface-700'}`}>
                      <m.icon size={14} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-brand-600 text-white font-semibold text-[13px] hover:bg-brand-700 transition-colors">
                Complete Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
