import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceService } from '../../services/db';

export default function Services() {
  const services = ServiceService.getAll();
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="py-24 md:py-36 animate-fade-up">
      <div className="container-fluid">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-6">
            <h1 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
              Services and pricing.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8 flex items-end">
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed measure-prose">
              Every service includes a consultation, hot towel finish, and styling. Prices reflect the time and attention each cut requires. No hidden fees, no upsells.
            </p>
          </div>
        </div>

        {/* Service list by category */}
        {categories.map(cat => (
          <div key={cat} className="mb-20">
            <h2 className="text-[15px] font-medium text-[var(--text-primary)] mb-6 pb-4 border-b separator">
              {cat}
            </h2>
            <div>
              {services
                .filter(s => s.category === cat)
                .map(s => (
                  <div
                    key={s.id}
                    className="flex items-baseline justify-between py-6 border-b separator group hover:bg-[var(--bg-surface)] transition-colors px-3 -mx-3"
                  >
                    <div className="flex-1 pr-8">
                      <h3 className="text-[17px] font-medium text-[var(--text-primary)]">
                        {s.name}
                      </h3>
                      <p className="text-[13px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[18px] font-medium text-[var(--text-primary)] tabular-nums">
                        ${s.price}
                      </p>
                      <p className="text-[12px] text-[var(--text-muted)] mt-0.5 tabular-nums">
                        {s.duration} min
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-16 pt-12 border-t separator text-center">
          <p className="text-[15px] text-[var(--text-secondary)] mb-6 measure-prose mx-auto">
            Ready to experience the difference? Book your appointment and let us show you what craft feels like.
          </p>
          <Link
            to="/booking"
            className="inline-block px-8 py-4 bg-[var(--bg-ink)] text-[var(--text-on-ink)] text-[14px] font-medium hover:bg-[var(--bg-ink-surface)] transition-colors"
          >
            Book an appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
