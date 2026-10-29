import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { ServiceService } from '../../services/db';

export default function Services() {
  const services = ServiceService.getAll();
  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">What We Offer</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-charcoal-900">Our Services</h1>
          <p className="text-charcoal-600 mt-3 max-w-lg mx-auto">Professional grooming services delivered with precision and care.</p>
        </div>

        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-bold text-charcoal-900 mb-4 pb-2 border-b border-charcoal-200">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.filter(s => s.category === category).map(service => (
                <div key={service.id} className="flex items-start justify-between p-5 border border-charcoal-200 hover:border-charcoal-400 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal-900">{service.name}</h3>
                    <p className="text-sm text-charcoal-500 mt-1">{service.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-charcoal-400">
                      <Clock size={12} /> {service.duration} minutes
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xl font-bold text-charcoal-900">${service.price}</p>
                    {service.promoPrice && (
                      <p className="text-xs text-brand-600 font-medium">Now ${service.promoPrice}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-3 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800 transition-colors">
            Book an Appointment <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
