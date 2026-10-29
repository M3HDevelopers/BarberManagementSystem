import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors, Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { SettingsService } from '../services/db';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = SettingsService.get();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/barbers', label: 'Barbers' },
    { path: '/booking', label: 'Book Now' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white/90 glass border-b border-surface-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-surface-900 flex items-center justify-center">
                <Scissors size={16} className="text-brand-500" />
              </div>
              <div>
                <span className="text-[16px] font-bold text-surface-900 tracking-tight">BarberPro</span>
                <p className="text-[9px] text-surface-400 -mt-0.5 tracking-widest uppercase">Premium Grooming</p>
              </div>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-[13px] font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'text-surface-900 bg-surface-100' 
                      : 'text-surface-500 hover:text-surface-900 hover:bg-surface-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-px h-6 bg-surface-200 mx-2" />
              <Link to="/login" className="px-4 py-2 text-[13px] font-medium text-surface-400 hover:text-surface-700 transition-colors">
                Staff
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-all">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-surface-100 bg-white animate-fade-in">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-3.5 text-[14px] font-medium border-b border-surface-50 ${
                  location.pathname === link.path ? 'text-surface-900 bg-surface-50' : 'text-surface-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-6 py-3.5 text-[14px] text-surface-400">
              Staff Login
            </Link>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-surface-950 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 bg-brand-600 flex items-center justify-center">
                  <Scissors size={18} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">BarberPro</span>
              </div>
              <p className="text-[14px] text-surface-400 leading-relaxed max-w-sm">
                Premium grooming experience where tradition meets modern style. Expert barbers, precision cuts, and exceptional service.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a href="#" className="w-9 h-9 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={16} /></a>
                <a href="#" className="w-9 h-9 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Facebook size={16} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-surface-400 mb-4">Contact</h4>
              <div className="space-y-3 text-[13px] text-surface-300">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-surface-500" /> {settings.address}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-surface-500" /> {settings.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-surface-400 mb-4">Hours</h4>
              <div className="space-y-2 text-[13px] text-surface-300">
                {settings.openingHours.filter(h => h.start).map(h => (
                  <p key={h.day} className="flex items-center gap-3">
                    <span className="text-surface-500 w-8">{h.day}</span>
                    <span>{h.start} — {h.end}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 py-6 text-center">
            <p className="text-[12px] text-surface-500">&copy; {new Date().getFullYear()} BarberPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
