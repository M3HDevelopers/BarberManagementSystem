import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/db';
import { 
  LayoutDashboard, Calendar, Users, Scissors, CreditCard, Package, 
  BarChart3, Settings, LogOut, Menu, X, Bell, ChevronDown, User as UserIcon,
  ClipboardList, UserCheck
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { path: '/dashboard/customers', label: 'Customers', icon: Users },
  { path: '/dashboard/barbers', label: 'Barbers', icon: Scissors },
  { path: '/dashboard/pos', label: 'POS / Billing', icon: CreditCard },
  { path: '/dashboard/queue', label: 'Queue', icon: UserCheck },
  { path: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { path: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
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
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-charcoal-700">
          <Link to="/dashboard" className="text-xl font-bold tracking-tight">
            <span className="text-brand-600">Barber</span>Pro
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-charcoal-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-charcoal-700 text-white border-l-2 border-brand-600' : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-charcoal-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-charcoal-600 hover:text-charcoal-900">
            <Menu size={24} />
          </button>
          <div className="hidden lg:block" />
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 text-charcoal-500 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-charcoal-200 shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-charcoal-100 flex items-center justify-between">
                    <span className="font-semibold text-sm text-charcoal-900">Notifications</span>
                    <button onClick={() => NotificationService.markAllRead()} className="text-xs text-brand-600 hover:text-brand-700">Mark all read</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-charcoal-400">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 border-b border-charcoal-50 ${!n.read ? 'bg-brand-50' : ''}`}>
                        <p className="text-sm font-medium text-charcoal-900">{n.title}</p>
                        <p className="text-xs text-charcoal-500 mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 px-3 py-1.5 hover:bg-charcoal-100 transition-colors">
                <div className="w-8 h-8 bg-charcoal-800 text-white flex items-center justify-center text-sm font-medium">
                  {user?.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-charcoal-900">{user?.name}</p>
                  <p className="text-xs text-charcoal-500 capitalize">{user?.role}</p>
                </div>
                <ChevronDown size={14} className="text-charcoal-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-charcoal-200 shadow-lg z-50">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-charcoal-50 transition-colors">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
