import React from 'react';
import { ReportService, AppointmentService, InvoiceService, ProductService } from '../../services/db';
import { DollarSign, Calendar, Users, TrendingUp, AlertTriangle, ArrowUpRight, Package, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const stats = ReportService.getDashboardStats();
  const revenueData = ReportService.getRevenueByDay(14);
  const topServices = ReportService.getTopServices();
  const barberPerf = ReportService.getBarberPerformance();
  const lowStock = ProductService.getLowStock();
  const recentInvoices = InvoiceService.getAll().slice(0, 5);
  const todayAppointments = AppointmentService.getAll({ date: new Date().toISOString().split('T')[0] });

  const statCards = [
    { label: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(0)}`, icon: DollarSign, change: '+12.5%', up: true, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Monthly Revenue', value: `$${stats.monthRevenue.toFixed(0)}`, icon: TrendingUp, change: '+8.2%', up: true, color: 'from-blue-500 to-blue-600' },
    { label: "Today's Bookings", value: stats.todayAppointments, icon: Calendar, change: `${todayAppointments.length} active`, up: null, color: 'from-violet-500 to-violet-600' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, change: '+3 this week', up: true, color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-surface-900 tracking-tight">Good morning 👋</h1>
          <p className="text-[13px] text-surface-500 mt-1">Here's what's happening at your shop today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
            <Activity size={12} /> Shop is Open
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white border border-surface-200/60 p-5 hover-lift">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg shadow-black/5`}>
                <card.icon size={18} className="text-white" />
              </div>
              {card.up !== null && (
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${card.up ? 'text-emerald-600' : 'text-surface-500'}`}>
                  {card.up && <ArrowUpRight size={12} />}
                  {card.change}
                </span>
              )}
            </div>
            <p className="text-[28px] font-bold text-surface-900 tracking-tight">{card.value}</p>
            <p className="text-[12px] text-surface-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-surface-200/60 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[15px] font-semibold text-surface-900">Revenue Overview</h3>
              <p className="text-[12px] text-surface-400 mt-0.5">Last 14 days performance</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-surface-900" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-brand-500" /> Expenses</span>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a1a1aa' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: '#18181b', border: 'none', padding: '8px 12px', fontSize: '12px' }}
                  labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`$${value}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="expenses" stroke="#d72020" strokeWidth={2} fill="transparent" name="Expenses" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border border-surface-200/60 p-6">
          <h3 className="text-[15px] font-semibold text-surface-900 mb-1">Top Services</h3>
          <p className="text-[12px] text-surface-400 mb-5">Most booked this month</p>
          <div className="space-y-3">
            {topServices.length === 0 ? (
              <div className="text-center py-8">
                <Package size={32} className="mx-auto text-surface-300 mb-2" />
                <p className="text-[13px] text-surface-400">No service data yet</p>
              </div>
            ) : topServices.map((s, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <span className="w-7 h-7 bg-surface-100 flex items-center justify-center text-[11px] font-bold text-surface-600 group-hover:bg-surface-900 group-hover:text-white transition-all">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-surface-800 truncate">{s.name}</p>
                  <p className="text-[11px] text-surface-400">{s.count} bookings</p>
                </div>
                <span className="text-[13px] font-semibold text-surface-900">${s.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-surface-200/60">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-surface-900">Recent Transactions</h3>
              <p className="text-[12px] text-surface-400 mt-0.5">Latest invoices and payments</p>
            </div>
          </div>
          {recentInvoices.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign size={32} className="mx-auto text-surface-300 mb-2" />
              <p className="text-[13px] text-surface-400">No transactions yet</p>
              <p className="text-[11px] text-surface-400 mt-1">Complete a service to see data here</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-50">
              {recentInvoices.map(inv => (
                <div key={inv.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-surface-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-surface-100 flex items-center justify-center">
                      <DollarSign size={14} className="text-surface-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-surface-900">{inv.invoiceNumber}</p>
                      <p className="text-[11px] text-surface-400">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-semibold text-surface-900">${inv.total.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 
                      inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : 
                      inv.status === 'refunded' ? 'bg-red-50 text-red-700' : 
                      'bg-surface-100 text-surface-600'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white border border-surface-200/60 p-5">
            <h3 className="text-[13px] font-semibold text-surface-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-500" /> Low Stock Alerts
            </h3>
            {lowStock.length === 0 ? (
              <p className="text-[12px] text-surface-400 text-center py-4">All products are well-stocked</p>
            ) : (
              <div className="space-y-2.5">
                {lowStock.slice(0, 4).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <span className="text-[12px] text-surface-700 truncate pr-2">{p.name}</span>
                    <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 shrink-0">{p.quantity} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barber Performance */}
          <div className="bg-white border border-surface-200/60 p-5">
            <h3 className="text-[13px] font-semibold text-surface-900 mb-3">Team Performance</h3>
            <div className="space-y-3">
              {barberPerf.map(b => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-surface-700 to-surface-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {b.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-surface-800 truncate">{b.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1.5 bg-surface-100 overflow-hidden">
                        <div className="h-full bg-surface-900" style={{ width: `${Math.min(100, (b.revenue / Math.max(...barberPerf.map(x => x.revenue), 1)) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold text-surface-900">${b.revenue.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-surface-900 p-5 text-white">
            <h3 className="text-[13px] font-semibold mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[12px] text-surface-400">Monthly Expenses</span>
                <span className="text-[12px] font-medium">${stats.monthExpenses.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-surface-400">Pending Payments</span>
                <span className="text-[12px] font-medium text-amber-400">${stats.pendingPayments.toFixed(0)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-[12px] text-surface-400">Net Profit</span>
                <span className={`text-[14px] font-bold ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>${stats.netProfit.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
