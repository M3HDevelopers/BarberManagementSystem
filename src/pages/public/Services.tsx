import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Scissors } from 'lucide-react';
import { ServiceService } from '../../services/db';

export default function Services() {
  const services = ServiceService.getAll();
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">What We Offer</p>
          <h1 className="text-[32px] lg:text-[44px] font-bold text-surface-900 tracking-tight">Our Services</h1>
          <p className="text-[15px] text-surface-500 mt-3 max-w-lg mx-auto">Professional grooming services delivered with precision and care.</p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-14">
            <h2 className="text-[18px] font-bold text-surface-900 mb-5 pb-3 border-b border-surface-200">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.filter(s => s.category === category).map(service => (
                <div key={service.id} className="group flex items-start justify-between p-5 border border-surface-200 hover:border-surface-900 hover-lift transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Scissors size={14} className="text-surface-400" />
                      <h3 className="text-[15px] font-semibold text-surface-900">{service.name}</h3>
                    </div>
                    <p className="text-[13px] text-surface-500 leading-relaxed">{service.description}</p>
                    <div className="flex items-center gap-1 mt-2.5 text-[11px] text-surface-400">
                      <Clock size={11} /> {service.duration} minutes
                    </div>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-[22px] font-bold text-surface-900">${service.price}</p>
                    {service.promoPrice && (
                      <p className="text-[11px] text-brand-600 font-semibold mt-0.5">Now ${service.promoPrice}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-14">
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-3.5 bg-surface-900 text-white font-semibold text-[14px] hover:bg-surface-800 transition-all group">
            Book an Appointment <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
