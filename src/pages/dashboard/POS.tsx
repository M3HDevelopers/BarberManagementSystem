import React, { useState, useEffect } from 'react';
import { ServiceService, ProductService, BarberService, CustomerService, InvoiceService } from '../../services/db';
import { Invoice, InvoiceItem, PaymentMethod } from '../../types';
import { Plus, Minus, Trash2, X, CreditCard, DollarSign, Smartphone, Receipt } from 'lucide-react';

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

  const services = ServiceService.getAll();
  const products = ProductService.getAll().filter(p => p.type === 'retail' && p.active);
  const barbers = BarberService.getAll();
  const customers = CustomerService.getAll(1, 1000).data;

  useEffect(() => { setRecentInvoices(InvoiceService.getAll().slice(0, 10)); }, []);

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
      <div className="max-w-lg mx-auto py-8">
        <div className="bg-white border border-charcoal-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto flex items-center justify-center mb-4">
            <Receipt size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-charcoal-900 mb-1">Payment Complete</h2>
          <p className="text-sm text-charcoal-500 mb-4">Invoice {completedInvoice.invoiceNumber}</p>
          <div className="text-left p-4 bg-charcoal-50 border border-charcoal-200 text-sm space-y-1 mb-6">
            {completedInvoice.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.name} x{item.quantity}</span>
                <span>${item.total.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-charcoal-200 pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span><span>${completedInvoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Paid</span><span>${completedInvoice.paid.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setCompletedInvoice(null)} className="px-6 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">
            New Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Point of Sale</h1>
          <p className="text-sm text-charcoal-500">Process walk-in and appointment payments</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-charcoal-600 hover:text-charcoal-900 font-medium">
          {showHistory ? 'Hide History' : 'View Recent'}
        </button>
      </div>

      {showHistory && (
        <div className="bg-white border border-charcoal-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-charcoal-100 bg-charcoal-50">
              <th className="text-left px-4 py-2 font-medium text-charcoal-600">Invoice</th>
              <th className="text-left px-4 py-2 font-medium text-charcoal-600">Total</th>
              <th className="text-left px-4 py-2 font-medium text-charcoal-600">Paid</th>
              <th className="text-left px-4 py-2 font-medium text-charcoal-600">Status</th>
              <th className="text-left px-4 py-2 font-medium text-charcoal-600">Date</th>
            </tr></thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id} className="border-b border-charcoal-50">
                  <td className="px-4 py-2 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-2">${inv.total.toFixed(2)}</td>
                  <td className="px-4 py-2">${inv.paid.toFixed(2)}</td>
                  <td className="px-4 py-2"><span className={`px-2 py-0.5 text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{inv.status}</span></td>
                  <td className="px-4 py-2 text-charcoal-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer & Barber */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-charcoal-600 mb-1">Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900">
                <option value="">Walk-in Customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-charcoal-600 mb-1">Barber *</label>
              <select value={barberId} onChange={e => setBarberId(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required>
                <option value="">Select barber</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white border border-charcoal-200 p-4">
            <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {services.map(s => (
                <button key={s.id} onClick={() => addItem('service', s.id, s.name, s.price)} className="p-2 border border-charcoal-200 hover:border-charcoal-900 text-left transition-colors">
                  <p className="text-xs font-medium text-charcoal-900 truncate">{s.name}</p>
                  <p className="text-xs text-charcoal-500">${s.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-charcoal-200 p-4">
            <h3 className="text-sm font-semibold text-charcoal-900 mb-3">Products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {products.map(p => (
                <button key={p.id} onClick={() => addItem('product', p.id, p.name, p.sellingPrice)} className="p-2 border border-charcoal-200 hover:border-charcoal-900 text-left transition-colors">
                  <p className="text-xs font-medium text-charcoal-900 truncate">{p.name}</p>
                  <p className="text-xs text-charcoal-500">${p.sellingPrice}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white border border-charcoal-200 p-4 flex flex-col">
          <h3 className="text-sm font-semibold text-charcoal-900 mb-3 flex items-center gap-2"><Receipt size={16} /> Current Bill</h3>
          
          <div className="flex-1 space-y-2 min-h-[200px]">
            {items.length === 0 ? (
              <p className="text-sm text-charcoal-400 text-center py-8">No items added</p>
            ) : items.map(item => (
              <div key={`${item.type}-${item.itemId}`} className="flex items-center justify-between p-2 border border-charcoal-100">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-900 truncate">{item.name}</p>
                  <p className="text-xs text-charcoal-500">${item.unitPrice} each</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button onClick={() => updateQty(item.itemId, item.type, -1)} className="w-6 h-6 flex items-center justify-center border border-charcoal-200 hover:bg-charcoal-100"><Minus size={12} /></button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQty(item.itemId, item.type, 1)} className="w-6 h-6 flex items-center justify-center border border-charcoal-200 hover:bg-charcoal-100"><Plus size={12} /></button>
                  <button onClick={() => removeItem(item.itemId, item.type)} className="w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-50 ml-1"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-charcoal-200 pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-charcoal-500">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-charcoal-500">Discount</span>
              <input type="number" value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-20 px-2 py-1 border border-charcoal-300 text-sm text-right focus:outline-none focus:border-charcoal-900" />
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-charcoal-200 pt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => { if (items.length > 0 && barberId) { setPaymentAmount(total); setShowPayment(true); } }} disabled={items.length === 0 || !barberId} className="mt-4 w-full py-3 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Process Payment
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold text-charcoal-900">Process Payment</h2>
              <button onClick={() => setShowPayment(false)} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handlePayment} className="p-6 space-y-4">
              <div className="p-4 bg-charcoal-50 border border-charcoal-200">
                <p className="text-2xl font-bold text-charcoal-900 text-center">${total.toFixed(2)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Payment Amount</label>
                <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} step="0.01" className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['cash', 'card', 'mobile', 'prepaid'] as PaymentMethod[]).map(m => (
                    <button key={m} type="button" onClick={() => setPaymentMethod(m)} className={`p-3 border text-sm font-medium capitalize transition-colors ${paymentMethod === m ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-charcoal-200 hover:border-charcoal-400'}`}>
                      {m === 'cash' && <DollarSign size={14} className="inline mr-1" />}
                      {m === 'card' && <CreditCard size={14} className="inline mr-1" />}
                      {m === 'mobile' && <Smartphone size={14} className="inline mr-1" />}
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800">
                Complete Payment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
