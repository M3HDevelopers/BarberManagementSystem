import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceService } from '../../services/db';

export default function Services() {
  const services = ServiceService.getAll();
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="py-24 md:py-32 animate-fade">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-xl mb-16">
          <h1 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-stone-900">Services & pricing.</h1>
          <p className="text-[15px] text-stone-600 mt-4 leading-relaxed">Every service includes consultation, hot towel finish, and styling. No hidden fees.</p>
        </div>
        {categories.map(cat => (
          <div key={cat} className="mb-14">
            <h2 className="text-[15px] font-medium text-stone-900 mb-5 pb-3 border-b hairline">{cat}</h2>
            <div className="space-y-0">
              {services.filter(s => s.category === cat).map(s => (
                <div key={s.id} className="flex items-baseline justify-between py-5 border-b hairline">
                  <div className="flex-1 pr-8">
                    <h3 className="text-[16px] font-medium text-stone-900">{s.name}</h3>
                    <p className="text-[13px] text-stone-500 mt-1">{s.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[16px] font-medium text-stone-900 tabular-nums">${s.price}</p>
                    <p className="text-[12px] text-stone-400 tabular-nums">{s.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-12">
          <Link to="/booking" className="inline-block px-8 py-4 bg-stone-900 text-cream-50 text-[14px] font-medium hover:bg-stone-800 transition-colors">Book an appointment</Link>
        </div>
      </div>
    </div>
  );
}
