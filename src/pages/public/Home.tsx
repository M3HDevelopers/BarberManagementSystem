import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Award, Star, ArrowRight } from 'lucide-react';
import { ServiceService, BarberService, SettingsService } from '../../services/db';

export default function Home() {
  const services = ServiceService.getAll().slice(0, 4);
  const barbers = BarberService.getAll();
  const settings = SettingsService.get();

  return (
    <div>
      {/* Hero */}
      <section className="bg-charcoal-900 text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-brand-500 text-sm font-semibold uppercase tracking-wider mb-4">Premium Grooming</p>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Where Tradition<br />Meets <span className="text-brand-500">Modern Style</span>
            </h1>
            <p className="text-charcoal-300 text-lg mb-8 leading-relaxed">
              Experience expert craftsmanship in a refined atmosphere. Our master barbers deliver precision cuts, 
              clean shaves, and grooming services tailored to you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors">
                Book Appointment <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 border border-charcoal-600 text-white font-medium text-sm hover:bg-charcoal-800 transition-colors">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-charcoal-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border border-charcoal-200">
              <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center mb-4">
                <Scissors size={20} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">Expert Barbers</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">Our skilled team brings years of experience and passion to every cut.</p>
            </div>
            <div className="p-6 bg-white border border-charcoal-200">
              <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center mb-4">
                <Clock size={20} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">Book online in seconds. Choose your barber, service, and preferred time.</p>
            </div>
            <div className="p-6 bg-white border border-charcoal-200">
              <div className="w-10 h-10 bg-charcoal-900 flex items-center justify-center mb-4">
                <Award size={20} className="text-brand-500" />
              </div>
              <h3 className="font-semibold text-charcoal-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-charcoal-600 leading-relaxed">Only the finest products and techniques for an exceptional experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">What We Offer</p>
              <h2 className="text-2xl lg:text-3xl font-bold text-charcoal-900">Our Services</h2>
            </div>
            <Link to="/services" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-charcoal-700 hover:text-brand-600 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(service => (
              <div key={service.id} className="p-5 border border-charcoal-200 hover:border-charcoal-400 transition-colors">
                <h3 className="font-semibold text-charcoal-900 mb-1">{service.name}</h3>
                <p className="text-xs text-charcoal-500 mb-3 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-charcoal-900">${service.price}</span>
                  <span className="text-xs text-charcoal-500 flex items-center gap-1"><Clock size={12} />{service.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barbers */}
      <section className="py-16 bg-charcoal-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">The Team</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-charcoal-900">Meet Our Barbers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map(barber => (
              <div key={barber.id} className="bg-white border border-charcoal-200 p-6 text-center">
                <div className="w-20 h-20 bg-charcoal-800 text-white mx-auto flex items-center justify-center text-2xl font-bold mb-4">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-semibold text-charcoal-900 text-lg">{barber.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-brand-500 fill-brand-500" />)}
                </div>
                <p className="text-xs text-charcoal-500">{barber.skills.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready for a Fresh Look?</h2>
          <p className="text-charcoal-300 mb-8 max-w-md mx-auto">Book your appointment today and experience the BarberPro difference.</p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
