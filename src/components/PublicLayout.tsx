import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SettingsService } from '../services/db';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = SettingsService.get();
  const isHome = location.pathname === '/';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/barbers', label: 'Barbers' },
    { to: '/booking', label: 'Book' },
    { to: '/contact', label: 'Visit' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)]">
      {/* Header */}
      <header
        className={`z-50 transition-colors ${
          isHome
            ? 'absolute top-0 left-0 right-0'
            : 'bg-[var(--bg-canvas)] border-b separator'
        }`}
      >
        <div className="container-fluid">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              to="/"
              className={`font-display text-[22px] leading-none tracking-[-0.01em] ${
                isHome ? 'text-[var(--text-on-ink)]' : 'text-[var(--text-primary)]'
              }`}
            >
              BarberPro
            </Link>

            <nav className="hidden md:flex items-center gap-10">
              {links.map(link => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-[13px] font-medium transition-colors ${
                      isHome
                        ? active
                          ? 'text-[var(--text-on-ink)]'
                          : 'text-[var(--text-on-ink-muted)] hover:text-[var(--text-on-ink)]'
                        : active
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden text-[13px] font-medium ${
                isHome ? 'text-[var(--text-on-ink)]' : 'text-[var(--text-primary)]'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[var(--bg-canvas)] border-t separator">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-5 text-[15px] border-b separator ${
                  location.pathname === link.to
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[var(--bg-ink)] text-[var(--text-on-ink)]">
        <div className="container-fluid py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-5">
              <p className="font-display text-[28px] leading-tight tracking-[-0.01em] mb-4">
                BarberPro
              </p>
              <p className="text-[14px] text-[var(--text-on-ink-muted)] leading-relaxed measure-prose">
                A barbershop built on the belief that a good haircut is not a transaction — it is a conversation between craft and client.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <p className="text-[13px] text-[var(--text-on-ink-muted)] mb-4">Visit</p>
              <p className="text-[14px] leading-relaxed">{settings.address}</p>
              <p className="text-[14px] mt-2">{settings.phone}</p>
              <p className="text-[14px] mt-1">{settings.email}</p>
            </div>

            <div className="md:col-span-3">
              <p className="text-[13px] text-[var(--text-on-ink-muted)] mb-4">Hours</p>
              <div className="space-y-1.5">
                {settings.openingHours
                  .filter(h => h.start)
                  .map(h => (
                    <div key={h.day} className="flex justify-between text-[14px]">
                      <span className="text-[var(--text-on-ink-muted)] w-10">{h.day}</span>
                      <span className="tabular-nums">
                        {h.start} — {h.end}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t separator-on-ink flex flex-col md:flex-row justify-between gap-4">
            <p className="text-[12px] text-[var(--text-on-ink-muted)]">
              &copy; {new Date().getFullYear()} BarberPro. All rights reserved.
            </p>
            <p className="text-[12px] text-[var(--text-on-ink-muted)]">
              Crafted with care since 2009
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
