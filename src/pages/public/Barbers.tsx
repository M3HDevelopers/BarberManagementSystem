import React from 'react';
import { Link } from 'react-router-dom';
import { BarberService } from '../../services/db';

export default function Barbers() {
  const barbers = BarberService.getAll();

  return (
    <div className="py-24 md:py-32 animate-fade">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-xl mb-16">
          <h1 className="text-[36px] md:text-[44px] font-normal tracking-[-0.02em] leading-[1.05] text-stone-900">The barbers.</h1>
          <p className="text-[15px] text-stone-600 mt-4 leading-relaxed">Each barber on our floor has completed a minimum two-year apprenticeship. Specialties vary; standards do not.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {barbers.map(b => (
            <article key={b.id}>
              <div className="aspect-[4/5] bg-stone-800 mb-5 flex items-center justify-center">
                <span className="text-[80px] font-normal text-cream-50/15 tracking-[-0.04em]">{b.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <h3 className="text-[20px] font-medium text-stone-900 tracking-[-0.01em]">{b.name}</h3>
              <p className="text-[13px] text-stone-500 mt-1.5">{b.skills.join(' · ')}</p>
              <div className="mt-4 pt-4 border-t hairline">
                <Link to="/booking" className="text-[13px] text-stone-900 font-medium border-b border-stone-900/30 hover:border-stone-900 pb-0.5 transition-colors">Book with {b.name.split(' ')[0]}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
