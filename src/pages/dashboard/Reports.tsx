import React, { useState } from 'react';
import { ReportService, InvoiceService, ExpenseService } from '../../services/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const COLORS = ['#1a1a1a', '#af2720', '#6d6d6d', '#d1d1d1', '#4f4f4f'];

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
  const expenses = ExpenseService.getAll({ dateFrom, dateTo });

  const paymentMethodData = (() => {
    const methods: Record<string, number> = {};
    invoices.forEach(inv => {
      inv.payments.forEach(p => {
        methods[p.method] = (methods[p.method] || 0) + p.amount;
      });
    });
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
    const a = document.createElement('a');
    a.href = url; a.download = `report_${dateFrom}_${dateTo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Reports & Analytics</h1>
          <p className="text-sm text-charcoal-500">Business performance insights</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-charcoal-300 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-charcoal-200 p-4">
        <Calendar size={16} className="text-charcoal-500" />
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-3 py-1.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
          <span className="text-charcoal-400">to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-3 py-1.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
        </div>
        <div className="ml-auto flex gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-1.5 text-xs font-medium ${activeTab === tab.id ? 'bg-charcoal-900 text-white' : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-charcoal-200 p-5">
              <p className="text-xs text-charcoal-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-charcoal-900">${financial.revenue.toFixed(0)}</p>
            </div>
            <div className="bg-white border border-charcoal-200 p-5">
              <p className="text-xs text-charcoal-500 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-charcoal-900">${financial.totalExpenses.toFixed(0)}</p>
            </div>
            <div className="bg-white border border-charcoal-200 p-5">
              <p className="text-xs text-charcoal-500 mb-1">Commissions</p>
              <p className="text-2xl font-bold text-charcoal-900">${financial.totalCommissions.toFixed(0)}</p>
            </div>
            <div className="bg-white border border-charcoal-200 p-5">
              <p className="text-xs text-charcoal-500 mb-1">Net Profit</p>
              <p className={`text-2xl font-bold ${financial.netProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>${financial.netProfit.toFixed(0)}</p>
            </div>
          </div>

          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-4">Revenue Trend (30 days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e7" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => `$${value}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#1a1a1a" strokeWidth={2} dot={false} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#af2720" strokeWidth={2} dot={false} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-charcoal-200 p-5">
              <h3 className="font-semibold text-charcoal-900 mb-4">Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-charcoal-500">Revenue</span><span className="font-medium">${financial.revenue.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Discounts Given</span><span className="font-medium text-red-600">-${financial.discounts.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Refunds</span><span className="font-medium text-red-600">-${financial.refunds.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Operational Expenses</span><span className="font-medium text-red-600">-${financial.totalExpenses.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Barber Commissions</span><span className="font-medium text-red-600">-${financial.totalCommissions.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-charcoal-200 pt-2 font-bold"><span>Net Profit</span><span className={financial.netProfit >= 0 ? 'text-green-700' : 'text-red-600'}>${financial.netProfit.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-white border border-charcoal-200 p-5">
              <h3 className="font-semibold text-charcoal-900 mb-4">Payment Methods</h3>
              {paymentMethodData.length === 0 ? (
                <p className="text-sm text-charcoal-400 text-center py-8">No payment data</p>
              ) : (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
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

      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <div className="bg-white border border-charcoal-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-charcoal-100 bg-charcoal-50">
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Invoice</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Date</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Subtotal</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Discount</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Total</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Paid</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Status</th>
            </tr></thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-charcoal-400">No transactions in this period</td></tr>
              ) : invoices.map(inv => (
                <tr key={inv.id} className="border-b border-charcoal-50">
                  <td className="px-4 py-3 font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-charcoal-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">${inv.subtotal.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${inv.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">${inv.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">${inv.paid.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : inv.status === 'partial' ? 'bg-yellow-100 text-yellow-700' : 'bg-charcoal-100 text-charcoal-600'}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-4">Top Services</h3>
            {topServices.length === 0 ? (
              <p className="text-sm text-charcoal-400">No service data yet</p>
            ) : (
              <div className="space-y-3">
                {topServices.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-charcoal-100 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <span className="text-sm text-charcoal-700">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{s.count} bookings</p>
                      <p className="text-xs text-charcoal-500">${s.revenue.toFixed(0)} revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white border border-charcoal-200 p-5">
            <h3 className="font-semibold text-charcoal-900 mb-4">Service Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topServices} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e7" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip formatter={(value: number) => `$${value}`} />
                  <Bar dataKey="revenue" fill="#1a1a1a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white border border-charcoal-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-charcoal-100 bg-charcoal-50">
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Barber</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Revenue</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Appointments</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Completed</th>
              <th className="text-right px-4 py-3 font-medium text-charcoal-600">Commissions</th>
              <th className="text-left px-4 py-3 font-medium text-charcoal-600">Commission Type</th>
            </tr></thead>
            <tbody>
              {barberPerf.map(b => (
                <tr key={b.id} className="border-b border-charcoal-50">
                  <td className="px-4 py-3 font-medium text-charcoal-900">{b.name}</td>
                  <td className="px-4 py-3 text-right font-medium">${b.revenue.toFixed(0)}</td>
                  <td className="px-4 py-3 text-right">{b.totalAppointments}</td>
                  <td className="px-4 py-3 text-right">{b.completedAppointments}</td>
                  <td className="px-4 py-3 text-right font-medium">${b.commissions.toFixed(0)}</td>
                  <td className="px-4 py-3 text-charcoal-600">{b.commissionType === 'percentage' ? `${b.commissionValue}%` : `$${b.commissionValue}/service`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
