import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SettingsService } from '../services/db';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = SettingsService.get();
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/barbers', label: 'Barbers' },
    { path: '/booking', label: 'Book' },
    { path: '/contact', label: 'Contact' },
  ];
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`${isHome ? 'bg-transparent absolute w-full' : 'bg-cream-50 border-b hairline'} z-50`}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className={`text-[17px] font-medium tracking-[-0.01em] ${isHome ? 'text-cream-50' : 'text-stone-900'}`}>
              BarberPro
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`text-[13px] font-medium transition-colors ${isHome ? 'text-cream-300 hover:text-cream-50' : location.pathname === link.path ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden ${isHome ? 'text-cream-50' : 'text-stone-900'}`}>
              <span className="text-[13px] font-medium">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-cream-50 border-t hairline">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className={`block px-6 py-4 text-[14px] border-b hairline ${location.pathname === link.path ? 'text-stone-900 font-medium' : 'text-stone-600'}`}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-stone-900 text-cream-300">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <p className="text-[17px] font-medium text-cream-50 mb-3">BarberPro</p>
              <p className="text-[13px] leading-relaxed text-cream-400">Precision grooming since 2009. Three barbers, one standard.</p>
            </div>
            <div>
              <p className="text-[13px] text-cream-400 mb-3">{settings.address}</p>
              <p className="text-[13px] text-cream-400">{settings.phone}</p>
              <p className="text-[13px] text-cream-400 mt-1">{settings.email}</p>
            </div>
            <div>
              <p className="text-[13px] text-cream-400 space-y-1">
                {settings.openingHours.filter(h => h.start).map(h => (
                  <span key={h.day} className="block"><span className="text-cream-300 w-8 inline-block">{h.day}</span> {h.start} — {h.end}</span>
                ))}
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-cream-50/10 text-[12px] text-cream-500">
            &copy; {new Date().getFullYear()} BarberPro
          </div>
        </div>
      </footer>
    </div>
  );
}
