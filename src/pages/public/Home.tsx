import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceService, BarberService } from '../../services/db';

export default function Home() {
  const services = ServiceService.getAll().slice(0, 6);
  const barbers = BarberService.getAll();

  return (
    <div className="animate-fade-up">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80" 
            alt="Barbershop interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-void/70 via-void/50 to-void" />
        </div>
        
        <div className="container-fluid relative z-10 py-32">
          <div className="max-w-4xl">
            <p className="text-[14px] text-cream-muted mb-8 tracking-wide">
              EST. 2009 — PRECISION GROOMING
            </p>
            <h1 className="font-display text-[64px] sm:text-[80px] lg:text-[120px] leading-[0.9] tracking-[-0.03em] text-cream mb-12">
              The ritual
              <br />
              <span className="text-brass">of precision.</span>
            </h1>
            <p className="text-[18px] text-cream-muted leading-relaxed measure-prose mb-12 max-w-2xl">
              A barbershop built on the belief that a good haircut is not a transaction — it is a conversation between craft and client. Three barbers. One standard. No shortcuts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="inline-block px-10 py-5 bg-brass text-void text-[15px] font-semibold tracking-wide hover:bg-brass-light transition-colors"
              >
                Book Appointment
              </Link>
              <Link
                to="/services"
                className="inline-block px-10 py-5 border-2 border-cream/30 text-cream text-[15px] font-semibold tracking-wide hover:border-brass hover:text-brass transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-cream-muted to-transparent" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-dark-100">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <p className="text-[13px] text-brass mb-4 tracking-wide">OUR SERVICES</p>
              <h2 className="font-display text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-cream">
                Crafted with care.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-[16px] text-cream-muted leading-relaxed measure-prose">
                Every service includes a consultation, hot towel finish, and styling. Prices reflect the time and attention each cut requires.
              </p>
            </div>
          </div>

          <div className="border-t border-dark-200">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="grid grid-cols-12 gap-4 py-8 border-b border-dark-200 group hover:bg-dark-200/50 transition-colors px-4 -mx-4"
              >
                <div className="col-span-1 text-[14px] text-cream-dim tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-7 md:col-span-5">
                  <h3 className="text-[20px] font-medium text-cream">
                    {service.name}
                  </h3>
                  <p className="text-[14px] text-cream-dim mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="col-span-4 md:col-span-3 text-[14px] text-cream-dim">
                  {service.duration} minutes
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right">
                  <span className="text-[24px] font-semibold text-brass tabular-nums">
                    ${service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-4 text-[15px] text-cream font-semibold border-b-2 border-brass hover:text-brass transition-colors pb-1"
            >
              View All Services
              <span className="text-[20px]">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Barbers Section */}
      <section className="py-32 bg-void">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-6">
              <p className="text-[13px] text-brass mb-4 tracking-wide">THE TEAM</p>
              <h2 className="font-display text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-cream">
                The barbers.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex items-end">
              <p className="text-[16px] text-cream-muted leading-relaxed measure-prose">
                Each barber has completed a minimum two-year apprenticeship. Specialties vary; standards do not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {barbers.map((barber, index) => {
              const images = [
                'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80',
                'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80'
              ];
              return (
                <article key={barber.id} className="group">
                  <div className="aspect-[4/5] bg-dark-100 mb-6 overflow-hidden relative">
                    <img 
                      src={images[index % images.length]} 
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-[24px] font-medium text-cream tracking-[-0.01em] mb-2">
                    {barber.name}
                  </h3>
                  <p className="text-[14px] text-cream-dim leading-relaxed mb-6">
                    {barber.skills.join(' · ')}
                  </p>
                  <Link
                    to="/booking"
                    className="inline-block text-[14px] text-brass font-semibold border-b-2 border-brass/50 hover:border-brass transition-colors pb-0.5"
                  >
                    Book with {barber.name.split(' ')[0]}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-dark-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80" 
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-fluid relative z-10 text-center">
          <p className="text-[13px] text-brass mb-6 tracking-wide">READY?</p>
          <h2 className="font-display text-[48px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-cream mb-8">
            Experience the difference.
          </h2>
          <p className="text-[18px] text-cream-muted leading-relaxed measure-prose mx-auto mb-12 max-w-2xl">
            Book your appointment today and discover what true craftsmanship feels like.
          </p>
          <Link
            to="/booking"
            className="inline-block px-12 py-6 bg-brass text-void text-[16px] font-bold tracking-wide hover:bg-brass-light transition-colors"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>

      {/* Visit Section */}
      <section className="py-32 bg-void">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-[13px] text-brass mb-4 tracking-wide">VISIT US</p>
              <h2 className="font-display text-[48px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-cream mb-12">
                Come see us.
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-[13px] text-cream-dim mb-2">Address</p>
                  <p className="text-[18px] text-cream">123 Main Street, Downtown</p>
                </div>
                <div>
                  <p className="text-[13px] text-cream-dim mb-2">Phone</p>
                  <p className="text-[18px] text-cream">555-0100</p>
                </div>
                <div>
                  <p className="text-[13px] text-cream-dim mb-2">Email</p>
                  <p className="text-[18px] text-cream">info@barberpro.com</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[13px] text-brass mb-4 tracking-wide">HOURS</p>
              <div className="space-y-0 mt-12">
                {[
                  { day: 'Monday', hours: '09:00 — 19:00' },
                  { day: 'Tuesday', hours: '09:00 — 19:00' },
                  { day: 'Wednesday', hours: '09:00 — 19:00' },
                  { day: 'Thursday', hours: '09:00 — 19:00' },
                  { day: 'Friday', hours: '09:00 — 19:00' },
                  { day: 'Saturday', hours: '10:00 — 17:00' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(h => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between py-5 border-b border-dark-200"
                  >
                    <span className="text-[16px] text-cream">{h.day}</span>
                    <span className="text-[16px] text-cream-muted tabular-nums">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
