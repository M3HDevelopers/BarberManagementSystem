import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/db';

const navItems = [
  { path: '/dashboard', label: 'Overview' },
  { path: '/dashboard/appointments', label: 'Appointments' },
  { path: '/dashboard/customers', label: 'Customers' },
  { path: '/dashboard/barbers', label: 'Barbers' },
  { path: '/dashboard/pos', label: 'POS' },
  { path: '/dashboard/queue', label: 'Queue' },
  { path: '/dashboard/inventory', label: 'Inventory' },
  { path: '/dashboard/reports', label: 'Reports' },
  { path: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = NotificationService.getUnreadCount();

  return (
    <div className="min-h-screen bg-stone-950 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-stone-900 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="h-16 flex items-center px-6 border-b hairline-dark">
          <Link to="/dashboard" className="text-[15px] font-medium text-cream-50 tracking-[-0.01em]">BarberPro</Link>
        </div>
        <nav className="px-3 py-4 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`block px-4 py-2 text-[13px] font-medium transition-colors ${active ? 'bg-cream-50/5 text-cream-50' : 'text-stone-400 hover:text-cream-200 hover:bg-cream-50/[0.03]'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t hairline-dark">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-oxblood-700 flex items-center justify-center text-[11px] font-bold text-cream-50">{user?.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-cream-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-stone-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="text-stone-500 hover:text-cream-300 text-[11px]">Exit</button>
          </div>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-stone-900/50 border-b hairline-dark flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-400 text-[13px]">Menu</button>
          <div className="hidden lg:block text-[13px] text-stone-400">
            {navItems.find(n => n.path === location.pathname)?.label}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-stone-500 tabular-nums">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {unreadCount > 0 && <span className="text-[11px] text-oxblood-500 font-medium">{unreadCount} new</span>}
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-stone-950 animate-fade">{children}</main>
      </div>
    </div>
  );
}
