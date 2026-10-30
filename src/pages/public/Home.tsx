import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceService, BarberService } from '../../services/db';

export default function Home() {
  const services = ServiceService.getAll().slice(0, 6);
  const barbers = BarberService.getAll();

  return (
    <div className="animate-fade-up">
      {/* Hero — Editorial, typography-led */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80" 
            alt="Barbershop interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[var(--bg-ink)]/85" />
        </div>
        
        <div className="container-fluid relative z-10">
          <div className="py-28 md:py-40 lg:py-48 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <p className="text-[15px] text-[var(--text-on-ink-muted)] mb-10 measure-prose leading-relaxed">
                Est. 2009. A barbershop built on the belief that a good haircut is not a transaction — it is a conversation between craft and client.
              </p>
              <h1 className="font-display text-[56px] sm:text-[72px] lg:text-[96px] leading-[0.92] tracking-[-0.025em] text-[var(--text-on-ink)]">
                The ritual
                <br />
                of precision.
              </h1>
            </div>

            <div className="lg:col-span-4 lg:col-start-9 lg:pb-6">
              <p className="text-[15px] text-[var(--text-on-ink-muted)] leading-relaxed measure-prose mb-10">
                Three barbers. One standard. Every cut, shave, and groom performed with the attention it deserves — no shortcuts, no rush, no compromise.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/booking"
                  className="inline-block px-8 py-4 bg-[var(--text-on-ink)] text-[var(--bg-ink)] text-[14px] font-medium text-center hover:bg-[var(--text-on-ink-muted)] transition-colors"
                >
                  Book an appointment
                </Link>
                <Link
                  to="/services"
                  className="inline-block px-8 py-4 border border-[var(--border-on-ink)] text-[var(--text-on-ink)] text-[14px] font-medium text-center hover:bg-[var(--bg-ink-surface)] transition-colors"
                >
                  Services and pricing
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="border-t separator-on-ink grid grid-cols-2 md:grid-cols-4">
            {[
              { figure: '15', label: 'Years in practice' },
              { figure: '3', label: 'Working barbers' },
              { figure: '6', label: 'Days open each week' },
              { figure: '∞', label: 'Walk-ins welcome' },
            ].map((item, i) => (
              <div
                key={i}
                className={`py-8 px-6 ${i > 0 ? 'md:border-l separator-on-ink' : ''} ${
                  i >= 2 ? 'border-t separator-on-ink md:border-t-0' : ''
                }`}
              >
                <p className="font-display text-[36px] md:text-[40px] leading-none tracking-[-0.02em] text-[var(--text-on-ink)] tabular-nums">
                  {item.figure}
                </p>
                <p className="text-[13px] text-[var(--text-on-ink-muted)] mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — Editorial list, typographic hierarchy */}
      <section className="py-24 md:py-36 bg-[var(--bg-canvas)]">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <h2 className="font-display text-[40px] md:text-[52px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
                Services and pricing.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed measure-prose">
                Every service includes a consultation, hot towel finish, and styling. Prices reflect the time and attention each cut requires. No hidden fees, no upsells.
              </p>
            </div>
          </div>

          <div className="border-t separator">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="grid grid-cols-12 gap-4 py-6 md:py-7 border-b separator items-baseline group hover:bg-[var(--bg-surface)] transition-colors px-3 -mx-3"
              >
                <div className="col-span-1 text-[13px] text-[var(--text-muted)] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-7 md:col-span-5">
                  <h3 className="text-[17px] font-medium text-[var(--text-primary)]">
                    {service.name}
                  </h3>
                  <p className="text-[13px] text-[var(--text-muted)] mt-1 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="col-span-4 md:col-span-3 text-[13px] text-[var(--text-muted)]">
                  {service.duration} minutes
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right">
                  <span className="text-[18px] font-medium text-[var(--text-primary)] tabular-nums">
                    ${service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-3 text-[14px] text-[var(--text-primary)] font-medium border-b border-[var(--border-strong)] hover:border-[var(--text-primary)] pb-0.5 transition-colors"
            >
              See full service menu
              <span aria-hidden="true" className="text-[16px]">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Barbers — Portrait-forward editorial */}
      <section className="py-24 md:py-36 bg-[var(--bg-surface)]">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-6">
              <h2 className="font-display text-[40px] md:text-[52px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
                The barbers.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed measure-prose">
                Each barber on our floor has completed a minimum two-year apprenticeship before taking a chair. Specialties vary; standards do not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {barbers.map((barber, index) => {
              const images = [
                'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80',
                'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80'
              ];
              return (
              <article key={barber.id}>
                <div className="aspect-[4/5] bg-[var(--bg-ink)] mb-6 overflow-hidden">
                  <img 
                    src={images[index % images.length]} 
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[22px] font-medium text-[var(--text-primary)] tracking-[-0.01em]">
                  {barber.name}
                </h3>
                <p className="text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">
                  {barber.skills.join(' · ')}
                </p>
                <div className="mt-5 pt-5 border-t separator">
                  <Link
                    to="/booking"
                    className="text-[13px] text-[var(--text-primary)] font-medium border-b border-[var(--border-strong)] hover:border-[var(--text-primary)] pb-0.5 transition-colors"
                  >
                    Book with {barber.name.split(' ')[0]}
                  </Link>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit — Dark section */}
      <section className="py-24 md:py-36 bg-[var(--bg-ink)] text-[var(--text-on-ink)]">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-[40px] md:text-[52px] leading-[1.02] tracking-[-0.02em]">
                Visit the shop.
              </h2>
              <p className="text-[15px] text-[var(--text-on-ink-muted)] mt-8 leading-relaxed measure-prose">
                123 Main Street, Downtown
              </p>
              <p className="text-[15px] text-[var(--text-on-ink-muted)] mt-2">555-0100</p>
              <p className="text-[15px] text-[var(--text-on-ink-muted)] mt-1">info@barberpro.com</p>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[13px] text-[var(--text-on-ink-muted)] mb-5">Opening hours</p>
              <div className="space-y-0">
                {[
                  { day: 'Mon', hours: '09:00 — 19:00' },
                  { day: 'Tue', hours: '09:00 — 19:00' },
                  { day: 'Wed', hours: '09:00 — 19:00' },
                  { day: 'Thu', hours: '09:00 — 19:00' },
                  { day: 'Fri', hours: '09:00 — 19:00' },
                  { day: 'Sat', hours: '10:00 — 17:00' },
                  { day: 'Sun', hours: 'Closed' },
                ].map(h => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between py-3 border-b separator-on-ink"
                  >
                    <span className="text-[15px] text-[var(--text-on-ink)] w-12">
                      {h.day}
                    </span>
                    <span className="text-[15px] text-[var(--text-on-ink-muted)] tabular-nums">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link
                  to="/booking"
                  className="inline-block px-8 py-4 bg-[var(--text-on-ink)] text-[var(--bg-ink)] text-[14px] font-medium hover:bg-[var(--text-on-ink-muted)] transition-colors"
                >
                  Book an appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
