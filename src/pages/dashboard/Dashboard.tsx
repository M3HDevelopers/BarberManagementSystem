import * as React from 'react';
import { ReportService, InvoiceService, ProductService, BarberService } from '../../services/db';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const stats = ReportService.getDashboardStats();
  const revenueData = ReportService.getRevenueByDay(14);
  const topServices = ReportService.getTopServices();
  const barberPerf = ReportService.getBarberPerformance();
  const lowStock = ProductService.getLowStock();
  const recentInvoices = InvoiceService.getAll().slice(0, 6);

  return (
    <div className="space-y-8 animate-fade">
      <div>
        <h1 className="text-[24px] md:text-[28px] font-normal tracking-[-0.02em] text-cream-50">Overview</h1>
        <p className="text-[13px] text-stone-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Metrics — tone steps, no cards with borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800">
        {[
          { label: 'Revenue today', value: `$${stats.todayRevenue.toFixed(0)}` },
          { label: 'Revenue this month', value: `$${stats.monthRevenue.toFixed(0)}` },
          { label: 'Appointments today', value: stats.todayAppointments },
          { label: 'Total customers', value: stats.totalCustomers },
        ].map((m, i) => (
          <div key={i} className="bg-stone-900 p-5">
            <p className="text-[12px] text-stone-500 mb-2">{m.label}</p>
            <p className="text-[28px] font-normal tracking-[-0.02em] text-cream-50 tabular-nums">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-stone-900 p-6">
        <p className="text-[14px] font-medium text-cream-100 mb-1">Revenue</p>
        <p className="text-[12px] text-stone-500 mb-6">Last 14 days</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#991b1b" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#991b1b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#57534e' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#57534e' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid rgba(255,255,255,0.08)', fontSize: '12px', color: '#f5f1ea' }} formatter={(value: number) => [`$${value}`, '']} />
              <Area type="monotone" dataKey="revenue" stroke="#991b1b" strokeWidth={1.5} fill="url(#revFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two column: recent invoices + side info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-stone-900">
          <div className="px-6 py-4 border-b hairline-dark">
            <p className="text-[14px] font-medium text-cream-100">Recent transactions</p>
          </div>
          {recentInvoices.length === 0 ? (
            <p className="px-6 py-10 text-[13px] text-stone-500 text-center">No transactions yet</p>
          ) : (
            <div>
              {recentInvoices.map(inv => (
                <div key={inv.id} className="px-6 py-3.5 flex items-center justify-between border-b hairline-dark hover:bg-cream-50/[0.02] transition-colors">
                  <div>
                    <p className="text-[13px] font-medium text-cream-100">{inv.invoiceNumber}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{new Date(inv.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-cream-100 tabular-nums">${inv.total.toFixed(2)}</p>
                    <p className={`text-[11px] mt-0.5 ${inv.status === 'paid' ? 'text-emerald-400' : inv.status === 'partial' ? 'text-amber-400' : 'text-stone-500'}`}>{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Barber performance */}
          <div className="bg-stone-900 p-5">
            <p className="text-[13px] font-medium text-cream-100 mb-4">Barber performance</p>
            <div className="space-y-3">
              {barberPerf.map(b => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-stone-800 flex items-center justify-center text-[9px] font-bold text-stone-400">{b.name.charAt(0)}</div>
                    <span className="text-[12px] text-stone-300">{b.name}</span>
                  </div>
                  <span className="text-[12px] font-medium text-cream-100 tabular-nums">${b.revenue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial summary */}
          <div className="bg-stone-900 p-5">
            <p className="text-[13px] font-medium text-cream-100 mb-4">This month</p>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between"><span className="text-stone-500">Expenses</span><span className="text-stone-300 tabular-nums">${stats.monthExpenses.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Outstanding</span><span className="text-amber-400 tabular-nums">${stats.pendingPayments.toFixed(0)}</span></div>
              <div className="flex justify-between pt-2 border-t hairline-dark"><span className="text-stone-500">Net profit</span><span className={`font-medium tabular-nums ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-oxblood-500'}`}>${stats.netProfit.toFixed(0)}</span></div>
            </div>
          </div>

          {/* Low stock */}
          {lowStock.length > 0 && (
            <div className="bg-stone-900 p-5">
              <p className="text-[13px] font-medium text-cream-100 mb-3">Low stock</p>
              <div className="space-y-2">
                {lowStock.map(p => (
                  <div key={p.id} className="flex justify-between text-[12px]">
                    <span className="text-stone-400 truncate pr-2">{p.name}</span>
                    <span className="text-oxblood-500 font-medium shrink-0 tabular-nums">{p.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
