import React from 'react';
import { SettingsService } from '../../services/db';

export default function Contact() {
  const settings = SettingsService.get();

  return (
    <div className="py-24 md:py-32 animate-fade">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-stone-900 mb-6">Visit the shop.</h1>
            <div className="space-y-6 text-[15px] text-stone-600">
              <div>
                <p className="text-[13px] text-stone-400 mb-1">Address</p>
                <p>{settings.address}</p>
              </div>
              <div>
                <p className="text-[13px] text-stone-400 mb-1">Phone</p>
                <p>{settings.phone}</p>
              </div>
              <div>
                <p className="text-[13px] text-stone-400 mb-1">Email</p>
                <p>{settings.email}</p>
              </div>
              <div>
                <p className="text-[13px] text-stone-400 mb-2">Hours</p>
                {settings.openingHours.map(h => (
                  <p key={h.day} className="flex justify-between py-1.5 border-b hairline text-[14px]">
                    <span className="text-stone-700 w-10">{h.day}</span>
                    <span className="text-stone-500 tabular-nums">{h.start ? `${h.start} — ${h.end}` : 'Closed'}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-[20px] font-medium text-stone-900 mb-6">Send a message</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent (demo)'); }}>
              <div>
                <label className="block text-[12px] text-stone-500 mb-1.5">Name</label>
                <input type="text" className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400" required />
              </div>
              <div>
                <label className="block text-[12px] text-stone-500 mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400" required />
              </div>
              <div>
                <label className="block text-[12px] text-stone-500 mb-1.5">Message</label>
                <textarea rows={4} className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400 resize-none" required />
              </div>
              <button type="submit" className="px-8 py-3 bg-stone-900 text-cream-50 text-[14px] font-medium hover:bg-stone-800 transition-colors">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
