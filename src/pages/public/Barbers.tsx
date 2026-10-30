import React from 'react';
import { Link } from 'react-router-dom';
import { BarberService } from '../../services/db';

export default function Barbers() {
  const barbers = BarberService.getAll();

  return (
    <div className="py-24 md:py-36 animate-fade-up">
      <div className="container-fluid">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-6">
            <h1 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
              The barbers.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8 flex items-end">
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed measure-prose">
              Each barber on our floor has completed a minimum two-year apprenticeship before taking a chair. Specialties vary; standards do not.
            </p>
          </div>
        </div>

        {/* Barber grid — editorial portrait layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {barbers.map(b => (
            <article key={b.id}>
              {/* Portrait */}
              <div className="aspect-[4/5] bg-[var(--bg-ink)] mb-6 flex items-center justify-center overflow-hidden">
                <span className="font-display text-[104px] text-[var(--text-on-ink)]/10 tracking-[-0.04em] select-none">
                  {b.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>

              {/* Name */}
              <h2 className="text-[24px] font-medium text-[var(--text-primary)] tracking-[-0.01em]">
                {b.name}
              </h2>

              {/* Specialties */}
              <p className="text-[13px] text-[var(--text-muted)] mt-2 leading-relaxed">
                {b.skills.join(' · ')}
              </p>

              {/* Schedule */}
              <div className="mt-6 pt-6 border-t separator">
                <p className="text-[12px] text-[var(--text-muted)] mb-3">Schedule</p>
                <div className="space-y-1">
                  {b.workingHours.map(wh => (
                    <div key={wh.day} className="flex justify-between text-[13px]">
                      <span className="text-[var(--text-muted)] w-10">{wh.day}</span>
                      <span className="text-[var(--text-secondary)] tabular-nums">
                        {wh.start} — {wh.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book link */}
              <div className="mt-6">
                <Link
                  to="/booking"
                  className="text-[13px] text-[var(--text-primary)] font-medium border-b border-[var(--border-strong)] hover:border-[var(--text-primary)] pb-0.5 transition-colors"
                >
                  Book with {b.name.split(' ')[0]}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
