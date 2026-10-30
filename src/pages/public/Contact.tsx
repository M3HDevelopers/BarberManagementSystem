import React from 'react';
import { SettingsService } from '../../services/db';

export default function Contact() {
  const settings = SettingsService.get();

  return (
    <div className="py-24 md:py-36 animate-fade-up">
      <div className="container-fluid">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-6">
            <h1 className="font-display text-[44px] md:text-[60px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)]">
              Visit the shop.
            </h1>
          </div>
          <div className="lg:col-span-4 lg:col-start-8 flex items-end">
            <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed measure-prose">
              We'd love to see you. Walk-ins are always welcome, or book an appointment to guarantee your spot.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="text-[13px] text-[var(--text-muted)] mb-3">Address</p>
              <p className="text-[16px] text-[var(--text-primary)] leading-relaxed">
                {settings.address}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[var(--text-muted)] mb-3">Contact</p>
              <p className="text-[16px] text-[var(--text-primary)]">{settings.phone}</p>
              <p className="text-[16px] text-[var(--text-primary)] mt-1">{settings.email}</p>
            </div>

            <div>
              <p className="text-[13px] text-[var(--text-muted)] mb-4">Hours</p>
              <div className="space-y-0">
                {settings.openingHours.map(h => (
                  <div
                    key={h.day}
                    className="flex justify-between py-3 border-b separator text-[15px]"
                  >
                    <span className="text-[var(--text-primary)] w-12">{h.day}</span>
                    <span className="text-[var(--text-secondary)] tabular-nums">
                      {h.start ? `${h.start} — ${h.end}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-[22px] font-medium text-[var(--text-primary)] tracking-[-0.01em] mb-8">
              Send a message
            </h2>
            <form
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                alert('Message sent (demo)');
              }}
            >
              <div>
                <label htmlFor="contact-name" className="block text-[13px] text-[var(--text-muted)] mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-[13px] text-[var(--text-muted)] mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-[13px] text-[var(--text-muted)] mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-[var(--bg-ink)] text-[var(--text-on-ink)] text-[14px] font-medium hover:bg-[var(--bg-ink-surface)] transition-colors"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
