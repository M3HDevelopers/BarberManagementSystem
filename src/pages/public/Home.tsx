import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceService, BarberService, SettingsService } from '../../services/db';
import { Service, Barber } from '../../types';

export default function Home() {
  const services = ServiceService.getAll();
  const barbers = BarberService.getAll();
  const settings = SettingsService.get();

  return (
    <div className="animate-fade">
      {/* Hero — Editorial, typography-led */}
      <section className="bg-stone-900 text-cream-50 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="py-24 md:py-36 lg:py-44 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-cream-400 text-[15px] mb-8 measure-prose leading-relaxed">
                Est. 2009. A barbershop built on the belief that a good haircut is not a transaction — it is a conversation between craft and client.
              </p>
              <h1 className="text-[48px] sm:text-[64px] lg:text-[84px] font-normal leading-[0.95] tracking-[-0.02em] text-cream-50">
                The ritual<br />of precision.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-4">
              <p className="text-cream-300 text-[15px] leading-relaxed mb-8 measure-prose">
                Eight barbers. One standard. Every cut, shave, and groom performed with the attention it deserves — no shortcuts, no rush.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/booking" className="inline-block px-8 py-4 bg-cream-50 text-stone-900 text-[14px] font-medium text-center hover:bg-cream-100 transition-colors">
                  Book an appointment
                </Link>
                <Link to="/services" className="inline-block px-8 py-4 border border-cream-50/20 text-cream-50 text-[14px] font-medium text-center hover:bg-cream-50/5 transition-colors">
                  View services & pricing
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics strip — real data, not decoration */}
          <div className="border-t border-cream-50/10 grid grid-cols-2 md:grid-cols-4">
            {[
              { figure: '15', label: 'Years in practice' },
              { figure: '8', label: 'Working barbers' },
              { figure: '6 days', label: 'Open each week' },
              { figure: 'Walk-ins', label: 'Always welcome' },
            ].map((item, i) => (
              <div key={i} className={`py-8 px-6 ${i > 0 ? 'md:border-l border-cream-50/10' : ''} ${i >= 2 ? 'border-t border-cream-50/10 md:border-t-0' : ''}`}>
                <p className="text-[32px] font-normal tracking-[-0.02em] text-cream-50 tabular-nums">{item.figure}</p>
                <p className="text-[13px] text-cream-400 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — Editorial list, not cards with icons */}
      <section className="py-24 md:py-32 bg-cream-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <h2 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-stone-900">
                Services & pricing.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="text-[15px] text-stone-600 leading-relaxed measure-prose">
                Every service includes a consultation, hot towel finish, and styling. Prices reflect the time and attention each cut requires. No hidden fees, no upsells.
              </p>
            </div>
          </div>

          {/* Service list — typographic, not card-based */}
          <div className="border-t border-stone-900/10">
            {services.slice(0, 6).map((service, i) => (
              <div key={service.id} className="grid grid-cols-12 gap-4 py-6 border-b border-stone-900/10 items-baseline group hover:bg-cream-100/50 transition-colors px-2 -mx-2">
                <div className="col-span-1 text-[13px] text-stone-400 tabular-nums">{String(i + 1).padStart(2, '0')}</div>
                <div className="col-span-6 md:col-span-5">
                  <h3 className="text-[17px] font-medium text-stone-900">{service.name}</h3>
                  <p className="text-[13px] text-stone-500 mt-1 leading-relaxed">{service.description}</p>
                </div>
                <div className="col-span-2 md:col-span-3 text-[13px] text-stone-500">
                  {service.duration} minutes
                </div>
                <div className="col-span-3 md:col-span-3 text-right">
                  <span className="text-[17px] font-medium text-stone-900 tabular-nums">${service.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-[14px] text-stone-900 font-medium border-b border-stone-900/30 hover:border-stone-900 pb-0.5 transition-colors">
              See full service menu
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Barbers — Portrait-forward */}
      <section className="py-24 md:py-32 bg-cream-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-6">
              <h2 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-stone-900">
                The barbers.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-[15px] text-stone-600 leading-relaxed measure-prose">
                Each barber on our floor has completed a minimum two-year apprenticeship before taking a chair. Specialties vary; standards do not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {barbers.map(barber => (
              <article key={barber.id} className="group">
                <div className="aspect-[4/5] bg-stone-800 mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[80px] font-normal text-cream-50/20 tracking-[-0.04em]">
                      {barber.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <h3 className="text-[20px] font-medium text-stone-900 tracking-[-0.01em]">{barber.name}</h3>
                <p className="text-[13px] text-stone-500 mt-1.5 leading-relaxed">
                  {barber.skills.join(' · ')}
                </p>
                <div className="mt-4 pt-4 border-t border-stone-900/10">
                  <Link to="/booking" className="text-[13px] text-stone-900 font-medium border-b border-stone-900/30 hover:border-stone-900 pb-0.5 transition-colors">
                    Book with {barber.name.split(' ')[0]}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Visit — Contact/hours */}
      <section className="py-24 md:py-32 bg-stone-900 text-cream-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05]">
                Visit the shop.
              </h2>
              <p className="text-[15px] text-cream-300 mt-6 leading-relaxed measure-prose">
                {settings.address}
              </p>
              <p className="text-[15px] text-cream-300 mt-2">{settings.phone}</p>
              <p className="text-[15px] text-cream-300 mt-1">{settings.email}</p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[13px] text-cream-400 mb-4">Opening hours</p>
              <div className="space-y-2">
                {settings.openingHours.map(h => (
                  <div key={h.day} className="flex items-baseline justify-between py-2 border-b border-cream-50/10">
                    <span className="text-[15px] text-cream-100 w-12">{h.day}</span>
                    <span className="text-[15px] text-cream-300 tabular-nums">
                      {h.start ? `${h.start} — ${h.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/booking" className="inline-block px-8 py-4 bg-cream-50 text-stone-900 text-[14px] font-medium hover:bg-cream-100 transition-colors">
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
