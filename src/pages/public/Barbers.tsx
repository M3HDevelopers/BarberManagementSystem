import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { BarberService } from '../../services/db';

export default function Barbers() {
  const barbers = BarberService.getAll();

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">The Team</p>
          <h1 className="text-[32px] lg:text-[44px] font-bold text-surface-900 tracking-tight">Our Barbers</h1>
          <p className="text-[15px] text-surface-500 mt-3 max-w-lg mx-auto">Skilled professionals dedicated to making you look your best.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map(barber => (
            <div key={barber.id} className="group border border-surface-200 hover:border-surface-900 transition-all hover-lift overflow-hidden">
              <div className="p-8 text-center bg-surface-50 group-hover:bg-surface-100 transition-colors">
                <div className="w-24 h-24 bg-gradient-to-br from-surface-700 to-surface-900 text-white mx-auto flex items-center justify-center text-[26px] font-bold shadow-xl">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-[18px] font-bold text-surface-900 mt-5">{barber.name}</h3>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {[1,2,3,4,5].map(i => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2.5">Specialties</h4>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {barber.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-surface-100 text-surface-600 text-[11px] font-medium">{skill}</span>
                  ))}
                </div>
                <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2.5">Schedule</h4>
                <div className="text-[12px] text-surface-500 space-y-1 mb-6">
                  {barber.workingHours.map(wh => (
                    <p key={wh.day} className="flex items-center gap-3">
                      <span className="font-semibold text-surface-700 w-8">{wh.day}</span>
                      <span>{wh.start} — {wh.end}</span>
                    </p>
                  ))}
                </div>
                <Link to="/booking" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-all group">
                  Book with {barber.name.split(' ')[0]}
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
