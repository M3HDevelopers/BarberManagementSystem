import React, { useState, useMemo } from 'react';
import { ServiceService, BarberService, CustomerService, AppointmentService } from '../../services/db';
import { Check, AlertCircle, Calendar } from 'lucide-react';

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
    
    if (!name || !phone) {
      setError('Name and phone are required');
      return;
    }

    // Find or create customer
    let customer = CustomerService.getAll(1, 1000, phone).data.find(c => c.phone === phone);
    if (!customer) {
      customer = CustomerService.create({ name, phone, email: email || undefined });
    }

    const appointment = AppointmentService.create({
      customerId: customer.id,
      barberId: selectedBarber,
      serviceIds: [selectedService],
      date: selectedDate,
      startTime: selectedTime,
      type: 'online',
    });

    if (appointment) {
      setBooked(true);
    } else {
      setError('This time slot is no longer available. Please choose another.');
    }
  };

  if (booked) {
    return (
      <div className="py-16">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto flex items-center justify-center mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Booking Confirmed!</h1>
          <p className="text-charcoal-600 mb-6">Your appointment has been successfully booked. We look forward to seeing you.</p>
          <div className="p-4 bg-charcoal-50 border border-charcoal-200 text-left text-sm space-y-2">
            <p><span className="font-medium text-charcoal-700">Service:</span> {services.find(s => s.id === selectedService)?.name}</p>
            <p><span className="font-medium text-charcoal-700">Barber:</span> {barbers.find(b => b.id === selectedBarber)?.name}</p>
            <p><span className="font-medium text-charcoal-700">Date:</span> {selectedDate}</p>
            <p><span className="font-medium text-charcoal-700">Time:</span> {selectedTime}</p>
          </div>
          <button onClick={() => { setBooked(false); setStep(1); setSelectedService(''); setSelectedBarber(''); setSelectedDate(''); setSelectedTime(''); setName(''); setPhone(''); setEmail(''); }} className="mt-6 px-6 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800 transition-colors">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-2">Schedule</p>
          <h1 className="text-3xl font-bold text-charcoal-900">Book Your Appointment</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-charcoal-900 text-white' : 'bg-charcoal-200 text-charcoal-500'}`}>
                {s}
              </div>
              {s < 4 && <div className={`w-8 h-0.5 ${step > s ? 'bg-charcoal-900' : 'bg-charcoal-200'}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 mb-6">
            <AlertCircle size={16} className="text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => { setSelectedService(service.id); setStep(2); }}
                  className={`p-4 border text-left transition-colors ${selectedService === service.id ? 'border-charcoal-900 bg-charcoal-50' : 'border-charcoal-200 hover:border-charcoal-400'}`}
                >
                  <h3 className="font-semibold text-charcoal-900">{service.name}</h3>
                  <p className="text-xs text-charcoal-500 mt-1">{service.duration} min</p>
                  <p className="text-lg font-bold text-charcoal-900 mt-2">${service.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Choose Your Barber</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {barbers.map(barber => (
                <button
                  key={barber.id}
                  onClick={() => { setSelectedBarber(barber.id); setStep(3); }}
                  className={`p-4 border text-center transition-colors ${selectedBarber === barber.id ? 'border-charcoal-900 bg-charcoal-50' : 'border-charcoal-200 hover:border-charcoal-400'}`}
                >
                  <div className="w-12 h-12 bg-charcoal-800 text-white mx-auto flex items-center justify-center text-sm font-bold">
                    {barber.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-charcoal-900 mt-3">{barber.name}</h3>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-sm text-charcoal-600 hover:text-charcoal-900">← Back to services</button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Select Date & Time</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Date</label>
              <input
                type="date"
                min={today}
                max={maxDate}
                value={selectedDate}
                onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                className="w-full max-w-xs px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900"
              />
            </div>
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Available Times</label>
                {availableSlots.length === 0 ? (
                  <p className="text-sm text-charcoal-500 flex items-center gap-2"><Calendar size={14} /> No available slots for this date. Please try another date.</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => { setSelectedTime(slot); setStep(4); }}
                        className={`py-2 text-sm font-medium border transition-colors ${selectedTime === slot ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-charcoal-200 hover:border-charcoal-400 text-charcoal-700'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-4 text-sm text-charcoal-600 hover:text-charcoal-900">← Back to barber</button>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-charcoal-900 mb-4">Your Details</h2>
            <div className="p-4 bg-charcoal-50 border border-charcoal-200 mb-6 text-sm">
              <p><span className="font-medium">Service:</span> {services.find(s => s.id === selectedService)?.name} — ${services.find(s => s.id === selectedService)?.price}</p>
              <p><span className="font-medium">Barber:</span> {barbers.find(b => b.id === selectedBarber)?.name}</p>
              <p><span className="font-medium">Date:</span> {selectedDate} at {selectedTime}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Full Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Phone Number *</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Email (optional)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
              </div>
              <button type="submit" className="w-full py-3 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800 transition-colors">
                Confirm Booking
              </button>
            </form>
            <button onClick={() => setStep(3)} className="mt-4 text-sm text-charcoal-600 hover:text-charcoal-900">← Back to date & time</button>
          </div>
        )}
      </div>
    </div>
  );
}
