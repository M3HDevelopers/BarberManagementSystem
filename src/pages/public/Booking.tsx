import React, { useState, useMemo } from 'react';
import { ServiceService, BarberService, CustomerService, AppointmentService } from '../../services/db';

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

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate || !selectedService) return [];
    const service = services.find(s => s.id === selectedService);
    if (!service) return [];
    return BarberService.getAvailableSlots(selectedBarber, selectedDate, service.duration);
  }, [selectedBarber, selectedDate, selectedService, services]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone) {
      setError('Name and phone are required');
      return;
    }

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
      <div className="py-24 md:py-36">
        <div className="container-fluid max-w-xl">
          <div className="text-center animate-fade-up">
            <p className="text-[13px] text-[var(--text-muted)] mb-3">Appointment confirmed</p>
            <h1 className="font-display text-[36px] md:text-[44px] leading-[1.05] tracking-[-0.02em] text-[var(--text-primary)] mb-8">
              We'll see you soon.
            </h1>
            <div className="text-left p-6 bg-[var(--bg-surface)] text-[14px] space-y-2 mb-10">
              <p>
                <span className="text-[var(--text-muted)]">Service:</span>{' '}
                <span className="font-medium text-[var(--text-primary)]">
                  {services.find(s => s.id === selectedService)?.name} — $
                  {services.find(s => s.id === selectedService)?.price}
                </span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Barber:</span>{' '}
                <span className="font-medium text-[var(--text-primary)]">
                  {barbers.find(b => b.id === selectedBarber)?.name}
                </span>
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Date:</span>{' '}
                <span className="font-medium text-[var(--text-primary)]">
                  {selectedDate} at {selectedTime}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                setBooked(false);
                setStep(1);
                setSelectedService('');
                setSelectedBarber('');
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setPhone('');
                setEmail('');
              }}
              className="px-8 py-4 bg-[var(--bg-ink)] text-[var(--text-on-ink)] text-[14px] font-medium hover:bg-[var(--bg-ink-surface)] transition-colors"
            >
              Book another appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 md:py-36 animate-fade-up">
      <div className="container-fluid max-w-2xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-[40px] md:text-[52px] leading-[1.02] tracking-[-0.02em] text-[var(--text-primary)] mb-3">
            Book an appointment.
          </h1>
          <p className="text-[14px] text-[var(--text-muted)]">Step {step} of 4</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 mb-6">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">Choose a service</p>
            <div className="border-t separator">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s.id);
                    setStep(2);
                  }}
                  className="w-full flex items-baseline justify-between py-5 border-b separator text-left hover:bg-[var(--bg-surface)] transition-colors px-3 -mx-3"
                >
                  <div>
                    <p className="text-[16px] font-medium text-[var(--text-primary)]">
                      {s.name}
                    </p>
                    <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
                      {s.duration} min
                    </p>
                  </div>
                  <span className="text-[16px] font-medium text-[var(--text-primary)] tabular-nums">
                    ${s.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Barber */}
        {step === 2 && (
          <div>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">Choose a barber</p>
            <div className="border-t separator">
              {barbers.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBarber(b.id);
                    setStep(3);
                  }}
                  className="w-full flex items-center justify-between py-5 border-b separator text-left hover:bg-[var(--bg-surface)] transition-colors px-3 -mx-3"
                >
                  <p className="text-[16px] font-medium text-[var(--text-primary)]">
                    {b.name}
                  </p>
                  <p className="text-[13px] text-[var(--text-muted)]">
                    {b.skills.slice(0, 2).join(', ')}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-8 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to services
            </button>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">
              Select date and time
            </p>
            <div className="mb-8">
              <label htmlFor="booking-date" className="block text-[13px] text-[var(--text-muted)] mb-2">
                Date
              </label>
              <input
                id="booking-date"
                type="date"
                min={today}
                max={maxDate}
                value={selectedDate}
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                }}
                className="w-full max-w-xs px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>
            {selectedDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-[13px] text-[var(--text-muted)] mb-3">
                  Available times
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedTime(slot);
                        setStep(4);
                      }}
                      className={`py-3 text-[13px] font-medium border transition-colors ${
                        selectedTime === slot
                          ? 'border-[var(--bg-ink)] bg-[var(--bg-ink)] text-[var(--text-on-ink)]'
                          : 'border-[var(--border-subtle)] hover:border-[var(--text-primary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {selectedDate && availableSlots.length === 0 && (
              <p className="text-[14px] text-[var(--text-muted)]">
                No available slots for this date. Please try another date.
              </p>
            )}
            <button
              onClick={() => setStep(2)}
              className="mt-8 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to barber
            </button>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-[14px] text-[var(--text-secondary)] mb-2">Your details</p>
            <div className="p-5 bg-[var(--bg-surface)] text-[14px] space-y-1.5">
              <p>
                <span className="text-[var(--text-muted)]">Service:</span>{' '}
                {services.find(s => s.id === selectedService)?.name} — $
                {services.find(s => s.id === selectedService)?.price}
              </p>
              <p>
                <span className="text-[var(--text-muted)]">Barber:</span>{' '}
                {barbers.find(b => b.id === selectedBarber)?.name} · {selectedDate} at{' '}
                {selectedTime}
              </p>
            </div>
            <div>
              <label htmlFor="booking-name" className="block text-[13px] text-[var(--text-muted)] mb-2">
                Name
              </label>
              <input
                id="booking-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-phone" className="block text-[13px] text-[var(--text-muted)] mb-2">
                Phone
              </label>
              <input
                id="booking-phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="booking-email" className="block text-[13px] text-[var(--text-muted)] mb-2">
                Email
              </label>
              <input
                id="booking-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border separator text-[14px] bg-[var(--bg-elevated)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-[var(--bg-ink)] text-[var(--text-on-ink)] text-[14px] font-medium hover:bg-[var(--bg-ink-surface)] transition-colors"
            >
              Confirm booking
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to date and time
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
