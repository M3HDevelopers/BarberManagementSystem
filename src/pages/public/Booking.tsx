import React, { useState, useMemo } from 'react';
import { ServiceService, BarberService, CustomerService, AppointmentService } from '../../services/db';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false); const [error, setError] = useState('');
  const services = ServiceService.getAll(); const barbers = BarberService.getAll();
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30*86400000).toISOString().split('T')[0];
  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate || !selectedService) return [];
    const service = services.find(s => s.id === selectedService); if (!service) return [];
    return BarberService.getAvailableSlots(selectedBarber, selectedDate, service.duration);
  }, [selectedBarber, selectedDate, selectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!name || !phone) { setError('Name and phone required'); return; }
    let customer = CustomerService.getAll(1, 1000, phone).data.find(c => c.phone === phone);
    if (!customer) customer = CustomerService.create({ name, phone, email: email || undefined });
    const apt = AppointmentService.create({ customerId: customer.id, barberId: selectedBarber, serviceIds: [selectedService], date: selectedDate, startTime: selectedTime, type: 'online' });
    if (apt) setBooked(true); else setError('Slot no longer available');
  };

  if (booked) return (
    <div className="py-24 md:py-32 animate-fade"><div className="max-w-md mx-auto px-6 text-center">
      <p className="text-[13px] text-stone-500 mb-2">Appointment confirmed</p>
      <h1 className="text-[28px] font-normal tracking-[-0.02em] text-stone-900 mb-6">We'll see you soon.</h1>
      <div className="text-left p-5 bg-cream-100 text-[13px] space-y-1.5 mb-8">
        <p>{services.find(s => s.id === selectedService)?.name} — ${services.find(s => s.id === selectedService)?.price}</p>
        <p>{barbers.find(b => b.id === selectedBarber)?.name}</p>
        <p>{selectedDate} at {selectedTime}</p>
      </div>
      <button onClick={() => { setBooked(false); setStep(1); setSelectedService(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime(''); }} className="px-8 py-3 bg-stone-900 text-cream-50 text-[13px] font-medium">Book another</button>
    </div></div>
  );

  return (
    <div className="py-24 md:py-32 animate-fade"><div className="max-w-xl mx-auto px-6">
      <h1 className="text-[32px] md:text-[40px] font-normal tracking-[-0.02em] text-stone-900 mb-3">Book an appointment.</h1>
      <p className="text-[14px] text-stone-500 mb-10">Step {step} of 4</p>
      {error && <p className="text-[13px] text-oxblood-600 mb-4">{error}</p>}
      {step === 1 && <div>
        <p className="text-[13px] text-stone-600 mb-4">Choose a service</p>
        <div className="space-y-0 border-t hairline">
          {services.map(s => (
            <button key={s.id} onClick={() => { setSelectedService(s.id); setStep(2); }} className="w-full flex items-baseline justify-between py-4 border-b hairline text-left hover:bg-cream-100 transition-colors px-1 -mx-1">
              <div><p className="text-[15px] font-medium text-stone-900">{s.name}</p><p className="text-[12px] text-stone-500 mt-0.5">{s.duration} min</p></div>
              <span className="text-[15px] font-medium text-stone-900 tabular-nums">${s.price}</span>
            </button>
          ))}
        </div>
      </div>}
      {step === 2 && <div>
        <p className="text-[13px] text-stone-600 mb-4">Choose a barber</p>
        <div className="space-y-0 border-t hairline">
          {barbers.map(b => (
            <button key={b.id} onClick={() => { setSelectedBarber(b.id); setStep(3); }} className="w-full flex items-center justify-between py-4 border-b hairline text-left hover:bg-cream-100 transition-colors px-1 -mx-1">
              <p className="text-[15px] font-medium text-stone-900">{b.name}</p>
              <p className="text-[12px] text-stone-500">{b.skills.slice(0, 2).join(', ')}</p>
            </button>
          ))}
        </div>
        <button onClick={() => setStep(1)} className="mt-6 text-[13px] text-stone-500 hover:text-stone-900 transition-colors">Back</button>
      </div>}
      {step === 3 && <div>
        <p className="text-[13px] text-stone-600 mb-4">Select date and time</p>
        <input type="date" min={today} max={maxDate} value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }} className="w-full px-4 py-3 border hairline text-[14px] mb-4 focus:outline-none focus:border-stone-400" />
        {selectedDate && availableSlots.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {availableSlots.map(slot => (
              <button key={slot} onClick={() => { setSelectedTime(slot); setStep(4); }} className={`py-2.5 text-[13px] font-medium border transition-colors ${selectedTime === slot ? 'border-stone-900 bg-stone-900 text-cream-50' : 'hairline hover:border-stone-400 text-stone-700'}`}>{slot}</button>
            ))}
          </div>
        )}
        {selectedDate && availableSlots.length === 0 && <p className="text-[13px] text-stone-500">No available slots for this date.</p>}
        <button onClick={() => setStep(2)} className="mt-6 text-[13px] text-stone-500 hover:text-stone-900 transition-colors">Back</button>
      </div>}
      {step === 4 && <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-[13px] text-stone-600 mb-2">Your details</p>
        <div className="p-4 bg-cream-100 text-[13px] space-y-1 mb-4">
          <p>{services.find(s => s.id === selectedService)?.name} — ${services.find(s => s.id === selectedService)?.price}</p>
          <p>{barbers.find(b => b.id === selectedBarber)?.name} · {selectedDate} at {selectedTime}</p>
        </div>
        <div><label className="block text-[12px] text-stone-500 mb-1.5">Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400" required /></div>
        <div><label className="block text-[12px] text-stone-500 mb-1.5">Phone</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400" required /></div>
        <div><label className="block text-[12px] text-stone-500 mb-1.5">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border hairline text-[14px] focus:outline-none focus:border-stone-400" /></div>
        <button type="submit" className="w-full py-3.5 bg-stone-900 text-cream-50 text-[14px] font-medium hover:bg-stone-800 transition-colors">Confirm booking</button>
        <button type="button" onClick={() => setStep(3)} className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors">Back</button>
      </form>}
    </div></div>
  );
}
