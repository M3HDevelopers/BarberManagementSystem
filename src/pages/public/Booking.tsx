import React, { useState, useMemo } from 'react';
import { ServiceService, BarberService, CustomerService, AppointmentService } from '../../services/db';
import { Check, AlertCircle, Calendar, ArrowRight, ArrowLeft, Clock } from 'lucide-react';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  const services = ServiceService.getAll();
  const barbers = BarberService.getAll();

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate || !selectedService) return [];
    const service = services.find(s => s.id === selectedService);
    if (!service) return [];
    return BarberService.getAvailableSlots(selectedBarber, selectedDate, service.duration);
  }, [selectedBarber, selectedDate, selectedService, services]);

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone) { setError('Name and phone are required'); return; }
    let customer = CustomerService.getAll(1, 1000, phone).data.find(c => c.phone === phone);
    if (!customer) customer = CustomerService.create({ name, phone, email: email || undefined });
    const appointment = AppointmentService.create({
      customerId: customer.id, barberId: selectedBarber,
      serviceIds: [selectedService], date: selectedDate, startTime: selectedTime, type: 'online',
    });
    if (appointment) setBooked(true);
    else setError('This time slot is no longer available. Please choose another.');
  };

  if (booked) {
    return (
      <div className="py-20 lg:py-28">
        <div className="max-w-md mx-auto px-4 text-center animate-scale-in">
          <div className="w-16 h-16 bg-emerald-50 mx-auto flex items-center justify-center mb-6">
            <Check size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-[24px] font-bold text-surface-900 mb-2">Booking Confirmed!</h1>
          <p className="text-[14px] text-surface-500 mb-8">Your appointment has been successfully booked.</p>
          <div className="p-5 bg-surface-50 border border-surface-200 text-left text-[13px] space-y-2 mb-8">
            <p><span className="font-semibold text-surface-700">Service:</span> {services.find(s => s.id === selectedService)?.name}</p>
            <p><span className="font-semibold text-surface-700">Barber:</span> {barbers.find(b => b.id === selectedBarber)?.name}</p>
            <p><span className="font-semibold text-surface-700">Date:</span> {selectedDate}</p>
            <p><span className="font-semibold text-surface-700">Time:</span> {selectedTime}</p>
          </div>
          <button onClick={() => { setBooked(false); setStep(1); setSelectedService(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime(''); setName(''); setPhone(''); setEmail(''); }} className="px-8 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 lg:py-28">
      <div className="max-w-2xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider mb-2">Schedule</p>
          <h1 className="text-[28px] lg:text-[36px] font-bold text-surface-900 tracking-tight">Book Your Appointment</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-1 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-8 h-8 flex items-center justify-center text-[12px] font-bold transition-all ${step >= s ? 'bg-surface-900 text-white' : 'bg-surface-200 text-surface-400'}`}>
                {step > s ? <Check size={14} /> : s}
              </div>
              {s < 4 && <div className={`w-10 h-0.5 ${step > s ? 'bg-surface-900' : 'bg-surface-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 mb-6 animate-scale-in">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-[16px] font-bold text-surface-900 mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service.id); setStep(2); }}
                  className={`p-4 border text-left transition-all hover-lift ${selectedService === service.id ? 'border-surface-900 bg-surface-50' : 'border-surface-200 hover:border-surface-400'}`}
                >
                  <h3 className="text-[14px] font-semibold text-surface-900">{service.name}</h3>
                  <p className="text-[12px] text-surface-500 mt-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                    <span className="text-[18px] font-bold text-surface-900">${service.price}</span>
                    <span className="text-[11px] text-surface-400 flex items-center gap-1"><Clock size={11} />{service.duration} min</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-[16px] font-bold text-surface-900 mb-4">Choose Your Barber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {barbers.map(barber => (
                <button
                  key={barber.id}
                  onClick={() => { setSelectedBarber(barber.id); setStep(3); }}
                  className={`p-5 border text-center transition-all hover-lift ${selectedBarber === barber.id ? 'border-surface-900 bg-surface-50' : 'border-surface-200 hover:border-surface-400'}`}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-surface-700 to-surface-900 text-white mx-auto flex items-center justify-center text-[14px] font-bold shadow-lg">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-[14px] font-bold text-surface-900 mt-3">{barber.name}</h3>
                  <p className="text-[11px] text-surface-400 mt-1">{barber.skills.slice(0, 2).join(', ')}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-5 text-[13px] text-surface-500 hover:text-surface-900 flex items-center gap-1 font-medium transition-colors"><ArrowLeft size={14} /> Back to services</button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-[16px] font-bold text-surface-900 mb-4">Select Date & Time</h2>
            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date" min={today} max={maxDate}
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                className="w-full max-w-xs px-4 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-2">Available Times</label>
                {availableSlots.length === 0 ? (
                  <p className="text-[13px] text-surface-400 flex items-center gap-2 p-4 bg-surface-50 border border-surface-200"><Calendar size={14} /> No available slots for this date.</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => { setSelectedTime(slot); setStep(4); }}
                        className={`py-2.5 text-[13px] font-semibold border transition-all ${selectedTime === slot ? 'border-surface-900 bg-surface-900 text-white' : 'border-surface-200 hover:border-surface-400 text-surface-700'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-5 text-[13px] text-surface-500 hover:text-surface-900 flex items-center gap-1 font-medium transition-colors"><ArrowLeft size={14} /> Back to barber</button>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-[16px] font-bold text-surface-900 mb-4">Your Details</h2>
            <div className="p-4 bg-surface-50 border border-surface-200 mb-6 text-[13px] space-y-1">
              <p><span className="font-semibold text-surface-700">Service:</span> {services.find(s => s.id === selectedService)?.name} — ${services.find(s => s.id === selectedService)?.price}</p>
              <p><span className="font-semibold text-surface-700">Barber:</span> {barbers.find(b => b.id === selectedBarber)?.name}</p>
              <p><span className="font-semibold text-surface-700">Date:</span> {selectedDate} at {selectedTime}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" required />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Email (optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-surface-900 text-white font-semibold text-[14px] hover:bg-surface-800 transition-all flex items-center justify-center gap-2 group">
                Confirm Booking <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
            <button onClick={() => setStep(3)} className="mt-5 text-[13px] text-surface-500 hover:text-surface-900 flex items-center gap-1 font-medium transition-colors"><ArrowLeft size={14} /> Back to date & time</button>
          </div>
        )}
      </div>
    </div>
  );
}
