import React, { useState, useMemo } from 'react';
import { ReportService, AppointmentService, InvoiceService, ProductService, BarberService } from '../../services/db';
import { DollarSign, Calendar, Users, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1a1a1a', '#af2720', '#6d6d6d', '#d1d1d1', '#4f4f4f'];

export default function Dashboard() {
  const stats = ReportService.getDashboardStats();
  const revenueData = ReportService.getRevenueByDay(14);
  const topServices = ReportService.getTopServices();
  const barberPerf = ReportService.getBarberPerformance();
  const lowStock = ProductService.getLowStock();
  const recentInvoices = InvoiceService.getAll().slice(0, 5);
  const todayAppointments = AppointmentService.getAll({ date: new Date().toISOString().split('T')[0] });

  const statCards = [
    { label: "Today's Revenue", value: `$${stats.todayRevenue.toFixed(0)}`, icon: DollarSign, change: '+12%' },
    { label: 'Monthly Revenue', value: `$${stats.monthRevenue.toFixed(0)}`, icon: TrendingUp, change: '+8%' },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, change: `${todayAppointments.length} scheduled` },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, change: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Dashboard</h1>
          <p className="text-sm text-charcoal-500 mt-0.5">Overview of your shop performance</p>
        </div>
        <p className="text-sm text-charcoal-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white border border-charcoal-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 bg-charcoal-100 flex items-center justify-center">
                <card.icon size={18} className="text-charcoal-700" />
              </div>
              <span className="text-xs font-medium text-charcoal-500">{card.change}</span>
            </div>
            <p className="text-2xl font-bold text-charcoal-900">{card.value}</p>
            <p className="text-xs text-charcoal-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-charcoal-200 p-5">
          <h3 className="font-semibold text-charcoal-900 mb-4">Revenue & Expenses (14 days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e7" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => `$${value}`} labelFormatter={l => l} />
                <Bar dataKey="revenue" fill="#1a1a1a" name="Revenue" />
                <Bar dataKey="expenses" fill="#af2720" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white border border-charcoal-200 p-5">
          <h3 className="font-semibold text-charcoal-900 mb-4">Popular Services</h3>
          <div className="space-y-3">
            {topServices.length === 0 ? (
              <p className="text-sm text-charcoal-400">No service data yet</p>
            ) : topServices.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-charcoal-100 flex items-center justify-center text-xs font-bold text-charcoal-600">{i + 1}</span>
                  <span className="text-sm text-charcoal-700">{s.name}</span>
                </div>
                <span className="text-sm font-medium text-charcoal-900">{s.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white border border-charcoal-200 p-5">
          <h3 className="font-semibold text-charcoal-900 mb-4">Recent Transactions</h3>
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-charcoal-400 py-4">No transactions yet. Complete a service to see data here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-charcoal-100">
                    <th className="text-left py-2 font-medium text-charcoal-500">Invoice</th>
                    <th className="text-left py-2 font-medium text-charcoal-500">Amount</th>
                    <th className="text-left py-2 font-medium text-charcoal-500">Status</th>
                    <th className="text-left py-2 font-medium text-charcoal-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map(inv => (
                    <tr key={inv.id} className="border-b border-charcoal-50">
                      <td className="py-2 font-medium text-charcoal-900">{inv.invoiceNumber}</td>
                      <td className="py-2">${inv.total.toFixed(2)}</td>
                      <td className="py-2">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : inv.status === 'refunded' ? 'bg-red-100 text-red-700' : 'bg-charcoal-100 text-charcoal-600'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-2 text-charcoal-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Low Stock */}
          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-brand-600" /> Low Stock Alerts
            </h3>
            {lowStock.length === 0 ? (
              <p className="text-sm text-charcoal-400">All products are well-stocked</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-700">{p.name}</span>
                    <span className="font-medium text-brand-600">{p.quantity} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Barber Performance */}
          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-3">Barber Performance</h3>
            <div className="space-y-3">
              {barberPerf.map(b => (
                <div key={b.id} className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-700">{b.name}</span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-charcoal-900">${b.revenue.toFixed(0)}</p>
                    <p className="text-xs text-charcoal-500">{b.completedAppointments} completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-3">Financial Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-charcoal-500">Monthly Expenses</span><span className="font-medium">${stats.monthExpenses.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-500">Net Profit</span><span className="font-medium text-green-700">${stats.netProfit.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-500">Pending Payments</span><span className="font-medium text-brand-600">${stats.pendingPayments.toFixed(0)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
