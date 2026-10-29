import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Award, ArrowRight, Star, Check } from 'lucide-react';
import { ServiceService, BarberService } from '../../services/db';

export default function Home() {
  const services = ServiceService.getAll().slice(0, 6);
  const barbers = BarberService.getAll();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-surface-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/5 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 mb-8">
              <Star size={12} className="text-brand-400 fill-brand-400" />
              <span className="text-[11px] font-medium text-surface-300 uppercase tracking-wider">Rated 4.9/5 by 500+ clients</span>
            </div>
            
            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-bold leading-[1.05] tracking-tight mb-6">
              Where Craft<br />
              Meets <span className="text-brand-500">Style</span>
            </h1>
            <p className="text-[16px] lg:text-[18px] text-surface-400 leading-relaxed mb-10 max-w-lg">
              Expert barbers delivering precision cuts, clean shaves, and premium grooming in a refined atmosphere. Your look, perfected.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-600 text-white font-semibold text-[14px] hover:bg-brand-700 transition-all group">
                Book Appointment
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all">
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {[
                { value: '15+', label: 'Years Experience' },
                { value: '500+', label: 'Happy Clients' },
                { value: '8', label: 'Expert Barbers' },
                { value: '4.9', label: 'Average Rating' },
              ].map((stat, i) => (
                <div key={i} className="py-8 px-6 text-center">
                  <p className="text-[28px] lg:text-[32px] font-bold text-white">{stat.value}</p>
                  <p className="text-[11px] text-surface-400 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">What We Offer</p>
              <h2 className="text-[28px] lg:text-[36px] font-bold text-surface-900 tracking-tight">Our Services</h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-surface-600 hover:text-brand-600 transition-colors group">
              View All Services
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <div key={service.id} className="group p-6 border border-surface-200 hover:border-surface-900 hover-lift transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-surface-100 group-hover:bg-surface-900 flex items-center justify-center transition-colors">
                    <Scissors size={16} className="text-surface-600 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <span className="text-[11px] text-surface-400 flex items-center gap-1"><Clock size={11} />{service.duration} min</span>
                </div>
                <h3 className="text-[15px] font-semibold text-surface-900 mb-1.5">{service.name}</h3>
                <p className="text-[13px] text-surface-500 leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-surface-100">
                  <span className="text-[20px] font-bold text-surface-900">${service.price}</span>
                  <Link to="/booking" className="text-[12px] font-semibold text-brand-600 hover:text-brand-700">Book Now →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">Why BarberPro</p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-surface-900 tracking-tight">The BarberPro Difference</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Master Barbers', desc: 'Our team brings decades of combined experience and continuous training in the latest techniques.' },
              { icon: Clock, title: 'Precise Scheduling', desc: 'Book online in seconds. No waiting, no hassle. Your time is valued and respected.' },
              { icon: Check, title: 'Premium Products', desc: 'We use only the finest professional-grade products for an exceptional grooming experience.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-surface-200 p-8 hover-lift">
                <div className="w-12 h-12 bg-surface-900 flex items-center justify-center mb-5">
                  <item.icon size={20} className="text-brand-400" />
                </div>
                <h3 className="text-[16px] font-semibold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-[13px] text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barbers */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">The Team</p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-surface-900 tracking-tight">Meet Our Barbers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map(barber => (
              <div key={barber.id} className="group border border-surface-200 hover:border-surface-900 transition-all hover-lift overflow-hidden">
                <div className="p-8 text-center bg-surface-50 group-hover:bg-surface-100 transition-colors">
                  <div className="w-20 h-20 bg-gradient-to-br from-surface-700 to-surface-900 text-white mx-auto flex items-center justify-center text-[22px] font-bold shadow-lg">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-[17px] font-bold text-surface-900 mt-5">{barber.name}</h3>
                  <div className="flex items-center justify-center gap-0.5 mt-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {barber.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-surface-100 text-surface-600 text-[11px] font-medium">{skill}</span>
                    ))}
                  </div>
                  <Link to="/booking" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors group">
                    Book with {barber.name.split(' ')[0]}
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-surface-950 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-[28px] lg:text-[40px] font-bold tracking-tight mb-4">Ready for a Fresh Look?</h2>
          <p className="text-[15px] text-surface-400 mb-10 max-w-md mx-auto">Book your appointment today and experience the BarberPro difference.</p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold text-[15px] hover:bg-brand-700 transition-all group">
            Book Your Appointment
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
