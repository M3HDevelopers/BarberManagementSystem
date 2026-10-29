import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scissors, Phone, MapPin, Clock } from 'lucide-react';
import { SettingsService } from '../services/db';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = SettingsService.get();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/barbers', label: 'Our Barbers' },
    { path: '/booking', label: 'Book Now' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-charcoal-900 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-brand-500">Barber</span>Pro
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-brand-500' : 'text-charcoal-300 hover:text-white'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/login" className="text-sm text-charcoal-400 hover:text-charcoal-200 transition-colors border-l border-charcoal-700 pl-4">
                Staff Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-charcoal-300 hover:text-white">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-charcoal-700 pb-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium ${location.pathname === link.path ? 'text-brand-500 bg-charcoal-800' : 'text-charcoal-300 hover:text-white hover:bg-charcoal-800'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-charcoal-400 hover:text-white hover:bg-charcoal-800">
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
      <footer className="bg-charcoal-900 text-charcoal-400 py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-3"><span className="text-brand-500">Barber</span>Pro</h3>
              <p className="text-sm leading-relaxed">Premium grooming experience. Where tradition meets modern style.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Contact</h4>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><MapPin size={14} /> {settings.address}</p>
                <p className="flex items-center gap-2"><Phone size={14} /> {settings.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Hours</h4>
              <div className="space-y-1 text-sm">
                {settings.openingHours.filter(h => h.start).map(h => (
                  <p key={h.day} className="flex items-center gap-2">
                    <Clock size={12} />
                    <span className="w-8">{h.day}</span>
                    <span>{h.start} — {h.end}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-charcoal-700 text-center text-xs">
            <p>&copy; {new Date().getFullYear()} BarberPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
