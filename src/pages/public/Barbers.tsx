import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { BarberService } from '../../services/db';

export default function Barbers() {
  const barbers = BarberService.getAll();

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">The Team</p>
          <h1 className="text-3xl lg:text-4xl font-bold text-charcoal-900">Our Barbers</h1>
          <p className="text-charcoal-600 mt-3 max-w-lg mx-auto">Skilled professionals dedicated to making you look your best.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map(barber => (
            <div key={barber.id} className="border border-charcoal-200 hover:border-charcoal-400 transition-colors">
              <div className="p-6 text-center border-b border-charcoal-100">
                <div className="w-24 h-24 bg-charcoal-800 text-white mx-auto flex items-center justify-center text-3xl font-bold">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-charcoal-900 text-xl mt-4">{barber.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-brand-500 fill-brand-500" />)}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {barber.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-charcoal-100 text-charcoal-700 text-xs font-medium">{skill}</span>
                  ))}
                </div>
                <h4 className="text-sm font-semibold text-charcoal-700 mb-2">Schedule</h4>
                <div className="text-xs text-charcoal-500 space-y-0.5">
                  {barber.workingHours.map(wh => (
                    <p key={wh.day}><span className="font-medium text-charcoal-700 w-8 inline-block">{wh.day}</span> {wh.start} — {wh.end}</p>
                  ))}
                </div>
                <Link to="/booking" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800 transition-colors">
                  Book with {barber.name.split(' ')[0]} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
