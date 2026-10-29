import React, { useState } from 'react';
import { ReportService, InvoiceService, ExpenseService } from '../../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar } from 'lucide-react';

const COLORS = ['#18181b', '#d72020', '#71717a', '#d4d4d8', '#3f3f46'];

export default function Reports() {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(monthStart);
  const [dateTo, setDateTo] = useState(today);
  const [activeTab, setActiveTab] = useState<'financial' | 'sales' | 'services' | 'staff'>('financial');

  const financial = ReportService.getFinancialReport(dateFrom, dateTo);
  const revenueData = ReportService.getRevenueByDay(30);
  const topServices = ReportService.getTopServices();
  const barberPerf = ReportService.getBarberPerformance();
  const invoices = InvoiceService.getAll({ dateFrom, dateTo });

  const paymentMethodData = (() => {
    const methods: Record<string, number> = {};
    invoices.forEach(inv => inv.payments.forEach(p => { methods[p.method] = (methods[p.method] || 0) + p.amount; }));
    return Object.entries(methods).map(([name, value]) => ({ name, value }));
  })();

  const tabs = [
    { id: 'financial', label: 'Financial' },
    { id: 'sales', label: 'Sales' },
    { id: 'services', label: 'Services' },
    { id: 'staff', label: 'Staff' },
  ] as const;

  const exportCSV = () => {
    const headers = 'Invoice,Date,Total,Paid,Status\n';
    const rows = invoices.map(i => `${i.invoiceNumber},${new Date(i.createdAt).toLocaleDateString()},${i.total},${i.paid},${i.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-[13px] text-surface-500">Business performance insights</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 border border-surface-200 text-[13px] font-semibold text-surface-700 hover:bg-surface-50 transition-colors">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-surface-200/60 p-3">
        <Calendar size={15} className="text-surface-400" />
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
          <span className="text-surface-400 text-[12px]">to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
        </div>
        <div className="ml-auto flex gap-0.5 bg-surface-100 p-0.5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-1.5 text-[11px] font-semibold transition-all ${activeTab === tab.id ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial */}
      {activeTab === 'financial' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: financial.revenue, color: 'text-emerald-600' },
              { label: 'Total Expenses', value: financial.totalExpenses, color: 'text-red-600' },
              { label: 'Commissions', value: financial.totalCommissions, color: 'text-amber-600' },
              { label: 'Net Profit', value: financial.netProfit, color: financial.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600' },
            ].map((card, i) => (
              <div key={i} className="bg-white border border-surface-200/60 p-5">
                <p className="text-[11px] text-surface-400 uppercase tracking-wider mb-1">{card.label}</p>
                <p className={`text-[24px] font-bold ${card.color}`}>${card.value.toFixed(0)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-surface-200/60 p-6">
            <h3 className="text-[14px] font-semibold text-surface-900 mb-1">Revenue Trend</h3>
            <p className="text-[12px] text-surface-400 mb-5">Last 30 days</p>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a1a1aa' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: '#18181b', border: 'none', fontSize: '12px' }} formatter={(value: number) => [`$${value}`, '']} />
                  <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#d72020" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-surface-200/60 p-6">
              <h3 className="text-[14px] font-semibold text-surface-900 mb-4">Breakdown</h3>
              <div className="space-y-3 text-[13px]">
                {[
                  { label: 'Revenue', value: financial.revenue, positive: true },
                  { label: 'Discounts', value: -financial.discounts, positive: false },
                  { label: 'Refunds', value: -financial.refunds, positive: false },
                  { label: 'Expenses', value: -financial.totalExpenses, positive: false },
                  { label: 'Commissions', value: -financial.totalCommissions, positive: false },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-surface-500">{row.label}</span>
                    <span className={`font-semibold ${row.positive ? 'text-surface-900' : 'text-red-600'}`}>
                      {row.value >= 0 ? '' : '-'}${Math.abs(row.value).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-surface-200 pt-3 font-bold text-[14px]">
                  <span>Net Profit</span>
                  <span className={financial.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}>${financial.netProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-surface-200/60 p-6">
              <h3 className="text-[14px] font-semibold text-surface-900 mb-4">Payment Methods</h3>
              {paymentMethodData.length === 0 ? (
                <p className="text-[13px] text-surface-400 text-center py-10">No payment data</p>
              ) : (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {paymentMethodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sales */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-surface-200/60 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Invoice</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Date</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Subtotal</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Discount</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Total</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Paid</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Status</th>
            </tr></thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-surface-400">No transactions in this period</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-surface-900">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5 text-surface-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-right">${inv.subtotal.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right text-red-600">${inv.discount.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right font-bold">${inv.total.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right font-semibold">${inv.paid.toFixed(2)}</td>
                  <td className="px-5 py-3.5"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-surface-100 text-surface-600'}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Services */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-surface-200/60 p-6">
            <h3 className="text-[14px] font-semibold text-surface-900 mb-4">Top Services</h3>
            {topServices.length === 0 ? (
              <p className="text-[13px] text-surface-400 text-center py-10">No service data yet</p>
            ) : (
              <div className="space-y-3">
                {topServices.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <span className="w-7 h-7 bg-surface-100 group-hover:bg-surface-900 group-hover:text-white flex items-center justify-center text-[11px] font-bold text-surface-600 transition-all">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-surface-800 truncate">{s.name}</p>
                      <p className="text-[11px] text-surface-400">{s.count} bookings</p>
                    </div>
                    <span className="text-[13px] font-bold text-surface-900">${s.revenue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white border border-surface-200/60 p-6">
            <h3 className="text-[14px] font-semibold text-surface-900 mb-4">Service Revenue</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topServices} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#71717a' }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => `$${value}`} contentStyle={{ background: '#18181b', border: 'none', fontSize: '12px' }} />
                  <Bar dataKey="revenue" fill="#18181b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Staff */}
      {activeTab === 'staff' && (
        <div className="bg-white border border-surface-200/60 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="border-b border-surface-100 bg-surface-50">
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Barber</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Revenue</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Appointments</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Completed</th>
              <th className="text-right px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Commissions</th>
              <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Rate</th>
            </tr></thead>
            <tbody>
              {barberPerf.map(b => (
                <tr key={b.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-surface-700 to-surface-900 text-white flex items-center justify-center text-[10px] font-bold">{b.name.split(' ').map(n => n[0]).join('')}</div>
                      <span className="font-semibold text-surface-900">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold">${b.revenue.toFixed(0)}</td>
                  <td className="px-5 py-3.5 text-right">{b.totalAppointments}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{b.completedAppointments}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-emerald-600">${b.commissions.toFixed(0)}</td>
                  <td className="px-5 py-3.5 text-surface-500">{b.commissionType === 'percentage' ? `${b.commissionValue}%` : `$${b.commissionValue}/svc`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
