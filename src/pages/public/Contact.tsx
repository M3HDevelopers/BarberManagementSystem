import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SettingsService } from '../../services/db';

export default function Contact() {
  const settings = SettingsService.get();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Get in Touch</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-charcoal-900">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">Address</h3>
                  <p className="text-sm text-charcoal-600 mt-1">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">Phone</h3>
                  <p className="text-sm text-charcoal-600 mt-1">{settings.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">Email</h3>
                  <p className="text-sm text-charcoal-600 mt-1">{settings.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center shrink-0">
                  <Clock size={18} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900">Opening Hours</h3>
                  <div className="text-sm text-charcoal-600 mt-1 space-y-0.5">
                    {settings.openingHours.map(h => (
                      <p key={h.day}>
                        <span className="font-medium text-charcoal-700 w-10 inline-block">{h.day}:</span>
                        {h.start ? `${h.start} — ${h.end}` : 'Closed'}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-charcoal-50 border border-charcoal-200 p-6 lg:p-8">
            <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Send us a Message</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! (Demo)'); }}>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Message</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900 resize-none" required />
              </div>
              <button type="submit" className="w-full py-2.5 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
