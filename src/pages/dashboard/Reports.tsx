import React, { useState } from 'react';
import { ReportService, InvoiceService } from '../../services/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(monthStart); const [dateTo, setDateTo] = useState(today);
  const financial = ReportService.getFinancialReport(dateFrom, dateTo);
  const revenueData = ReportService.getRevenueByDay(30);
  const invoices = InvoiceService.getAll({ dateFrom, dateTo });
  const barberPerf = ReportService.getBarberPerformance();
  const exportCSV = () => {
    const headers = 'Invoice,Date,Total,Paid,Status\n';
    const rows = invoices.map(i => `${i.invoiceNumber},${new Date(i.createdAt).toLocaleDateString()},${i.total},${i.paid},${i.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' }); const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report.csv`; a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Reports</h1>
        <button onClick={exportCSV} className="px-4 py-2 border border-stone-800 text-[12px] text-stone-400 hover:text-cream-200 hover:border-stone-600 transition-colors">Export CSV</button>
      </div>
      <div className="flex items-center gap-3 bg-stone-900 p-3">
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-2 bg-stone-950 border border-stone-800 text-[12px] text-cream-100 focus:outline-none" />
        <span className="text-stone-600 text-[12px]">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-2 bg-stone-950 border border-stone-800 text-[12px] text-cream-100 focus:outline-none" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800">
        {[{ l: 'Revenue', v: financial.revenue }, { l: 'Expenses', v: financial.totalExpenses }, { l: 'Commissions', v: financial.totalCommissions }, { l: 'Net profit', v: financial.netProfit }].map((m, i) => (
          <div key={i} className="bg-stone-900 p-5"><p className="text-[11px] text-stone-500 mb-1.5">{m.l}</p><p className={`text-[22px] font-normal tracking-[-0.02em] tabular-nums ${m.v >= 0 ? 'text-cream-50' : 'text-oxblood-500'}`}>${m.v.toFixed(0)}</p></div>
        ))}
      </div>
      <div className="bg-stone-900 p-6">
        <p className="text-[13px] font-medium text-cream-100 mb-4">Revenue trend</p>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs><linearGradient id="repFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#991b1b" stopOpacity={0.3}/><stop offset="100%" stopColor="#991b1b" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} /><XAxis dataKey="date" tick={{ fontSize: 10, fill: '#57534e' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#57534e' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#f5f1ea' }} formatter={(value: number) => [`$${value}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#991b1b" strokeWidth={1.5} fill="url(#repFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-stone-900 overflow-x-auto">
        <div className="px-5 py-3 border-b hairline-dark"><p className="text-[13px] font-medium text-cream-100">Transactions</p></div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b hairline-dark"><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Invoice</th><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Date</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Total</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Paid</th><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Status</th></tr></thead>
          <tbody>{invoices.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-center text-stone-600">No transactions</td></tr> : invoices.map(inv => (
            <tr key={inv.id} className="border-b hairline-dark hover:bg-cream-50/[0.02]">
              <td className="px-5 py-2.5 text-cream-100 font-medium">{inv.invoiceNumber}</td>
              <td className="px-5 py-2.5 text-stone-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
              <td className="px-5 py-2.5 text-right text-cream-100 tabular-nums">${inv.total.toFixed(2)}</td>
              <td className="px-5 py-2.5 text-right text-stone-400 tabular-nums">${inv.paid.toFixed(2)}</td>
              <td className="px-5 py-2.5"><span className={inv.status === 'paid' ? 'text-emerald-400' : inv.status === 'partial' ? 'text-amber-400' : 'text-stone-500'}>{inv.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="bg-stone-900 overflow-x-auto">
        <div className="px-5 py-3 border-b hairline-dark"><p className="text-[13px] font-medium text-cream-100">Barber performance</p></div>
        <table className="w-full text-[12px]">
          <thead><tr className="border-b hairline-dark"><th className="text-left px-5 py-2.5 text-stone-500 font-medium">Name</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Revenue</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Completed</th><th className="text-right px-5 py-2.5 text-stone-500 font-medium">Commission</th></tr></thead>
          <tbody>{barberPerf.map(b => (
            <tr key={b.id} className="border-b hairline-dark">
              <td className="px-5 py-2.5 text-cream-100 font-medium">{b.name}</td>
              <td className="px-5 py-2.5 text-right text-cream-100 tabular-nums">${b.revenue.toFixed(0)}</td>
              <td className="px-5 py-2.5 text-right text-stone-400 tabular-nums">{b.completedAppointments}</td>
              <td className="px-5 py-2.5 text-right text-stone-400 tabular-nums">${b.commissions.toFixed(0)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
