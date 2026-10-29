import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { SettingsService } from '../../services/db';

export default function Contact() {
  const settings = SettingsService.get();

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">Get in Touch</p>
          <h1 className="text-[32px] lg:text-[44px] font-bold text-surface-900 tracking-tight">Contact Us</h1>
          <p className="text-[15px] text-surface-500 mt-3 max-w-lg mx-auto">We'd love to hear from you. Reach out anytime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {[
              { icon: MapPin, title: 'Address', content: settings.address },
              { icon: Phone, title: 'Phone', content: settings.phone },
              { icon: Mail, title: 'Email', content: settings.email },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-11 h-11 bg-surface-900 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-brand-400" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-surface-900">{item.title}</h3>
                  <p className="text-[13px] text-surface-500 mt-1">{item.content}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-surface-900 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-brand-400" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-surface-900">Opening Hours</h3>
                <div className="text-[13px] text-surface-500 mt-1 space-y-1">
                  {settings.openingHours.map(h => (
                    <p key={h.day} className="flex items-center gap-3">
                      <span className="font-semibold text-surface-700 w-10">{h.day}</span>
                      <span>{h.start ? `${h.start} — ${h.end}` : 'Closed'}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-50 border border-surface-200 p-6 lg:p-8">
            <h2 className="text-[18px] font-bold text-surface-900 mb-5">Send us a Message</h2>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Message sent! (Demo)'); }}>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Name</label>
                <input type="text" className="w-full px-4 py-2.5 border border-surface-200 text-[13px] bg-white focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" className="w-full px-4 py-2.5 border border-surface-200 text-[13px] bg-white focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Message</label>
                <textarea rows={4} className="w-full px-4 py-2.5 border border-surface-200 text-[13px] bg-white focus:outline-none focus:border-surface-900 resize-none transition-colors" required />
              </div>
              <button type="submit" className="w-full py-3 bg-surface-900 text-white font-semibold text-[13px] hover:bg-surface-800 transition-all flex items-center justify-center gap-2 group">
                Send Message <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
