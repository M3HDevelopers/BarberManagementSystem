import React, { useState, useEffect } from 'react';
import { SettingsService } from '../services/db';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = SettingsService.get();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#barbers', label: 'Barbers' },
    { href: '#booking', label: 'Book' },
    { href: '#contact', label: 'Visit' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-void">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/95 backdrop-blur-md border-b border-dark-200' : 'bg-transparent'
      }`}>
        <div className="container-fluid">
          <div className="flex items-center justify-between h-20">
            <a href="#home" className="flex items-center gap-3">
              <img 
                src="https://image.qwenlm.ai/generated-images/f162a29f-0b16-4a22-80e2-cad4b5f65ec7/_result.png" 
                alt="BarberPro Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-[24px] leading-none tracking-[-0.01em] text-cream">
                BarberPro
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-10">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-cream-muted hover:text-brass transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[14px] font-medium text-cream"
              aria-label="Toggle menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-dark-100 border-t border-dark-200">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-5 text-[16px] text-cream-muted border-b border-dark-200 hover:text-brass transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-dark-100 border-t border-dark-200">
        <div className="container-fluid py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <p className="font-display text-[32px] leading-tight tracking-[-0.01em] text-cream mb-4">
                BarberPro
              </p>
              <p className="text-[15px] text-cream-muted leading-relaxed measure-prose">
                A barbershop built on the belief that a good haircut is not a transaction — it is a conversation between craft and client.
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <p className="text-[13px] text-brass mb-4 tracking-wide">VISIT</p>
              <p className="text-[15px] text-cream-muted leading-relaxed">{settings.address}</p>
              <p className="text-[15px] text-cream-muted mt-2">{settings.phone}</p>
              <p className="text-[15px] text-cream-muted mt-1">{settings.email}</p>
            </div>

            <div className="md:col-span-3">
              <p className="text-[13px] text-brass mb-4 tracking-wide">HOURS</p>
              <div className="space-y-1.5">
                {settings.openingHours
                  .filter(h => h.start)
                  .map(h => (
                    <div key={h.day} className="flex justify-between text-[14px]">
                      <span className="text-cream-muted w-10">{h.day}</span>
                      <span className="text-cream tabular-nums">
                        {h.start} — {h.end}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-dark-200 flex flex-col md:flex-row justify-between gap-4">
            <p className="text-[12px] text-cream-dim">
              &copy; {new Date().getFullYear()} BarberPro. All rights reserved.
            </p>
            <p className="text-[12px] text-cream-dim">
              Crafted with care since 2009
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
