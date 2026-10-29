import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/db';
import { 
  LayoutDashboard, Calendar, Users, Scissors, CreditCard, Package, 
  BarChart3, Settings, LogOut, Menu, X, Bell, ChevronDown, 
  UserCheck, Sparkles
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { path: '/dashboard/appointments', label: 'Appointments', icon: Calendar, badge: null },
  { path: '/dashboard/customers', label: 'Customers', icon: Users, badge: null },
  { path: '/dashboard/barbers', label: 'Barbers', icon: Scissors, badge: null },
  { path: '/dashboard/pos', label: 'POS / Billing', icon: CreditCard, badge: null },
  { path: '/dashboard/queue', label: 'Queue', icon: UserCheck, badge: null },
  { path: '/dashboard/inventory', label: 'Inventory', icon: Package, badge: null },
  { path: '/dashboard/reports', label: 'Reports', icon: BarChart3, badge: null },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings, badge: null },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = NotificationService.getAll().slice(0, 5);
  const unreadCount = NotificationService.getUnreadCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-surface-950 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto flex flex-col`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-[72px] px-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-brand-600 flex items-center justify-center">
              <Scissors size={18} className="text-white" />
            </div>
            <div>
              <span className="text-[15px] font-bold text-white tracking-tight">BarberPro</span>
              <p className="text-[10px] text-surface-400 -mt-0.5 tracking-wide uppercase">Management</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-surface-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-4 py-2 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">Main Menu</p>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  active 
                    ? 'bg-white/10 text-white' 
                    : 'text-surface-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={17} className={active ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'} />
                <span>{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 bg-brand-500" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-surface-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-[72px] bg-white/80 glass border-b border-surface-200/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all">
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-[15px] font-semibold text-surface-900">
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-[11px] text-surface-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} 
                className="relative w-10 h-10 flex items-center justify-center text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-surface-200 shadow-xl shadow-black/5 z-50 animate-scale-in">
                  <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-surface-900">Notifications</span>
                    <button onClick={() => NotificationService.markAllRead()} className="text-[11px] text-brand-600 hover:text-brand-700 font-medium">Mark all read</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-5 py-8 text-center text-[13px] text-surface-400">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`px-5 py-3.5 border-b border-surface-50 ${!n.read ? 'bg-brand-50/50' : ''}`}>
                        <p className="text-[13px] font-medium text-surface-900">{n.title}</p>
                        <p className="text-[11px] text-surface-500 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 hover:bg-surface-100 transition-all">
                <div className="w-8 h-8 bg-gradient-to-br from-surface-700 to-surface-900 text-white flex items-center justify-center text-[11px] font-bold">
                  {user?.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[13px] font-medium text-surface-900 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-surface-400 capitalize">{user?.role}</p>
                </div>
                <ChevronDown size={13} className="text-surface-400 hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-surface-200 shadow-xl shadow-black/5 z-50 animate-scale-in">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
