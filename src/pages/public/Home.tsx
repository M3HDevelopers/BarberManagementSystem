import React, { useState, useMemo } from 'react';
import { ServiceService, BarberService, CustomerService, AppointmentService } from '../../services/db';

export default function Home() {
  const services = ServiceService.getAll().slice(0, 6);
  const barbers = BarberService.getAll();

  // Booking state
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const availableSlots = useMemo(() => {
    if (!selectedBarber || !selectedDate || !selectedService) return [];
    const service = services.find(s => s.id === selectedService);
    if (!service) return [];
    return BarberService.getAvailableSlots(selectedBarber, selectedDate, service.duration);
  }, [selectedBarber, selectedDate, selectedService, services]);

  const handleBookingSubmit = (e: React.FormEvent) => {
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

  const resetBooking = () => {
    setBooked(false);
    setBookingStep(1);
    setSelectedService('');
    setSelectedBarber('');
    setSelectedDate('');
    setSelectedTime('');
    setName('');
    setPhone('');
    setEmail('');
    setError('');
  };

  return (
    <div className="animate-fade-up">
      {/* Hero Section — Full Background with Centered Text */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://image.qwenlm.ai/generated-images/1ec30e24-1bab-4ee0-8160-355117266043/_result.png" 
            alt="Dark moody barbershop interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-void/60" />
        </div>
        
        {/* Centered Content */}
        <div className="relative z-10 container-fluid text-center py-32">
          <div className="max-w-5xl mx-auto">
            <h1 className="font-display text-hero leading-[0.95] tracking-[-0.03em] text-cream mb-8 text-balance">
              Where craft meets conversation.
            </h1>
            <p className="text-lead text-cream-muted leading-relaxed measure-prose mx-auto mb-12 text-pretty">
              Since 2009, we've built a barbershop on the belief that a good haircut is not a transaction — it is a conversation between craft and client. Three barbers. One standard. No shortcuts, no rush, no compromise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#booking"
                className="inline-block px-10 py-5 bg-brass text-void text-body font-semibold tracking-wide hover:bg-brass-light transition-colors"
              >
                Book Your Appointment
              </a>
              <a
                href="#services"
                className="inline-block px-10 py-5 border-2 border-cream/30 text-cream text-body font-semibold tracking-wide hover:border-brass hover:text-brass transition-colors"
              >
                View Services
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-cream-muted to-transparent" />
        </div>
      </section>

      {/* Marquee 1 - Services */}
      <section className="py-8 bg-brass">
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="flex items-center gap-12 px-6">
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Classic Cut</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Fade & Taper</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Beard Trim</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Hot Towel Shave</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Hair Design</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
            </div>
            <div className="flex items-center gap-12 px-6">
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Classic Cut</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Fade & Taper</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Beard Trim</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Hot Towel Shave</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Hair Design</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-dark-100">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5">
              <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Our Services</p>
              <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream text-balance">
                Crafted with care.
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 flex items-end">
              <p className="text-body text-cream-muted leading-relaxed measure-prose text-pretty">
                Every service includes a consultation, hot towel finish, and styling. Prices reflect the time and attention each cut requires.
              </p>
            </div>
          </div>

          <div className="border-t border-dark-200">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="grid grid-cols-12 gap-4 py-8 border-b border-dark-200 group hover:bg-dark-200/50 transition-colors px-4 -mx-4"
              >
                <div className="col-span-1 text-body-sm text-cream-dim tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="col-span-7 md:col-span-5">
                  <h3 className="text-heading-sm font-medium text-cream">
                    {service.name}
                  </h3>
                  <p className="text-body-sm text-cream-dim mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="col-span-4 md:col-span-3 text-body-sm text-cream-dim">
                  {service.duration} minutes
                </div>
                <div className="col-span-12 md:col-span-3 md:text-right">
                  <span className="text-heading-md font-semibold text-brass tabular-nums">
                    ${service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cream Section 1 - The Craft */}
      <section className="py-32 bg-brass">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <p className="text-caption text-void/60 mb-4 tracking-[0.08em] uppercase">Our Philosophy</p>
              <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-void mb-8 text-balance">
                The craft of conversation.
              </h2>
              <p className="text-body text-void/80 leading-relaxed measure-prose mb-6 text-pretty">
                A haircut is more than a service. It's a moment of connection between two people who understand that precision matters. We believe in taking the time to listen, to understand what you want, and to deliver something that feels right.
              </p>
              <p className="text-body text-void/80 leading-relaxed measure-prose text-pretty">
                No rushing. No shortcuts. Just three barbers who care deeply about their craft and the people who sit in their chairs.
              </p>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="aspect-[4/5] bg-void/10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" 
                  alt="Barber tools and craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barbers Section */}
      <section id="barbers" className="py-32 bg-void">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-6">
              <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">The Team</p>
              <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream text-balance">
                The barbers.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex items-end">
              <p className="text-body text-cream-muted leading-relaxed measure-prose text-pretty">
                Each barber has completed a minimum two-year apprenticeship. Specialties vary; standards do not.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {barbers.map((barber, index) => {
              const images = [
                'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80',
                'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80',
                'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80'
              ];
              return (
                <article key={barber.id} className="group">
                  <div className="aspect-[4/5] bg-dark-100 mb-6 overflow-hidden relative">
                    <img 
                      src={images[index % images.length]} 
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="text-heading-md font-medium text-cream tracking-[-0.01em] mb-2">
                    {barber.name}
                  </h3>
                  <p className="text-body-sm text-cream-dim leading-relaxed mb-6">
                    {barber.skills.join(' · ')}
                  </p>
                  <a
                    href="#booking"
                    className="inline-block text-body-sm text-brass font-semibold border-b-2 border-brass/50 hover:border-brass transition-colors pb-0.5"
                  >
                    Book with {barber.name.split(' ')[0]}
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Marquee 2 - Experience */}
      <section className="py-8 bg-brass">
        <div className="marquee-container">
          <div className="marquee-content" style={{ animationDirection: 'reverse' }}>
            <div className="flex items-center gap-12 px-6">
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Since 2009</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Precision Craft</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Walk-ins Welcome</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">No Shortcuts</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Three Barbers</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
            </div>
            <div className="flex items-center gap-12 px-6">
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Since 2009</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Precision Craft</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Walk-ins Welcome</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">No Shortcuts</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
              <span className="font-display text-[clamp(2rem,5vw,4.209rem)] text-void tracking-[-0.02em] whitespace-nowrap">Three Barbers</span>
              <span className="text-void/40 text-[clamp(1.5rem,3vw,2.5rem)] whitespace-nowrap">✦</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-void">
        <div className="container-fluid">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Why Choose Us</p>
              <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream text-balance">
                More than just a haircut.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-brass/10 flex items-center justify-center">
                  <span className="font-display text-[32px] text-brass">01</span>
                </div>
                <h3 className="text-heading-sm font-medium text-cream mb-3">Expert Craftsmanship</h3>
                <p className="text-body-sm text-cream-muted leading-relaxed">
                  Every barber has years of experience and continuous training in the latest techniques.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-brass/10 flex items-center justify-center">
                  <span className="font-display text-[32px] text-brass">02</span>
                </div>
                <h3 className="text-heading-sm font-medium text-cream mb-3">Premium Products</h3>
                <p className="text-body-sm text-cream-muted leading-relaxed">
                  We use only the finest professional-grade products for an exceptional grooming experience.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-brass/10 flex items-center justify-center">
                  <span className="font-display text-[32px] text-brass">03</span>
                </div>
                <h3 className="text-heading-sm font-medium text-cream mb-3">Relaxed Atmosphere</h3>
                <p className="text-body-sm text-cream-muted leading-relaxed">
                  Enjoy a comfortable, welcoming environment where you can unwind and feel at ease.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-brass">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <p className="text-caption text-void/60 mb-4 tracking-[0.08em] uppercase">What They Say</p>
            <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-void text-balance">
              Trusted by our clients.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-void/5 p-8">
              <blockquote className="font-display text-heading-md leading-[1.3] tracking-[-0.01em] text-void mb-6">
                "I've been coming here for five years. It's not just a haircut — it's the conversation, the attention to detail."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-void/10 flex items-center justify-center">
                  <span className="font-display text-body font-medium text-void">M</span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-void">Marcus Chen</p>
                  <p className="text-caption text-void/60">Client since 2019</p>
                </div>
              </div>
            </div>
            <div className="bg-void/5 p-8">
              <blockquote className="font-display text-heading-md leading-[1.3] tracking-[-0.01em] text-void mb-6">
                "The best barbershop in town. Tony always knows exactly what I want. Professional, friendly, and consistent."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-void/10 flex items-center justify-center">
                  <span className="font-display text-body font-medium text-void">J</span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-void">James Rodriguez</p>
                  <p className="text-caption text-void/60">Client since 2020</p>
                </div>
              </div>
            </div>
            <div className="bg-void/5 p-8">
              <blockquote className="font-display text-heading-md leading-[1.3] tracking-[-0.01em] text-void mb-6">
                "Finally found a place where I feel comfortable. The atmosphere is great and the cuts are always on point."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-void/10 flex items-center justify-center">
                  <span className="font-display text-body font-medium text-void">D</span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-void">David Thompson</p>
                  <p className="text-caption text-void/60">Client since 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-void">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Our Work</p>
            <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream text-balance">
              The gallery.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" 
                alt="Barbershop tools"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80" 
                alt="Barbershop interior"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80" 
                alt="Barber at work"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80" 
                alt="Precision haircut"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer md:col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80" 
                alt="Barber styling"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="aspect-square bg-dark-100 overflow-hidden group cursor-pointer md:col-span-2">
              <img 
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80" 
                alt="Classic barbershop"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-32 bg-dark-100">
        <div className="container-fluid max-w-3xl">
          <div className="text-center mb-16">
            <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Book Now</p>
            <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream mb-6 text-balance">
              Book an appointment.
            </h2>
            <p className="text-body text-cream-muted">Step {bookingStep} of 4</p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 mb-8">
              <p className="text-body-sm text-red-300">{error}</p>
            </div>
          )}

          {booked ? (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-8 bg-brass/20 flex items-center justify-center">
                <span className="text-brass text-display">✓</span>
              </div>
              <h3 className="font-display text-heading-lg text-cream mb-6 text-balance">We'll see you soon.</h3>
              <div className="text-left p-6 bg-dark-200 text-body space-y-2 mb-10">
                <p>
                  <span className="text-cream-dim">Service:</span>{' '}
                  <span className="font-medium text-cream">
                    {services.find(s => s.id === selectedService)?.name} — $
                    {services.find(s => s.id === selectedService)?.price}
                  </span>
                </p>
                <p>
                  <span className="text-cream-dim">Barber:</span>{' '}
                  <span className="font-medium text-cream">
                    {barbers.find(b => b.id === selectedBarber)?.name}
                  </span>
                </p>
                <p>
                  <span className="text-cream-dim">Date:</span>{' '}
                  <span className="font-medium text-cream">
                    {selectedDate} at {selectedTime}
                  </span>
                </p>
              </div>
              <button
                onClick={resetBooking}
                className="px-10 py-5 bg-brass text-void text-body font-semibold hover:bg-brass-light transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Service */}
              {bookingStep === 1 && (
                <div>
                  <p className="text-body text-cream-muted mb-8 text-center">Choose a service</p>
                  <div className="border-t border-dark-200">
                    {services.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedService(s.id);
                          setBookingStep(2);
                        }}
                        className="w-full flex items-baseline justify-between py-6 border-b border-dark-200 text-left hover:bg-dark-200/50 transition-colors px-4 -mx-4"
                      >
                        <div>
                          <p className="text-lead font-medium text-cream">{s.name}</p>
                          <p className="text-body-sm text-cream-dim mt-1">{s.duration} min</p>
                        </div>
                        <span className="text-heading-sm font-semibold text-brass tabular-nums">${s.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Barber */}
              {bookingStep === 2 && (
                <div>
                  <p className="text-body text-cream-muted mb-8 text-center">Choose a barber</p>
                  <div className="border-t border-dark-200">
                    {barbers.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setSelectedBarber(b.id);
                          setBookingStep(3);
                        }}
                        className="w-full flex items-center justify-between py-6 border-b border-dark-200 text-left hover:bg-dark-200/50 transition-colors px-4 -mx-4"
                      >
                        <p className="text-lead font-medium text-cream">{b.name}</p>
                        <p className="text-body-sm text-cream-dim">{b.skills.slice(0, 2).join(', ')}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setBookingStep(1)}
                    className="mt-8 text-body-sm text-cream-dim hover:text-brass transition-colors"
                  >
                    ← Back to services
                  </button>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {bookingStep === 3 && (
                <div>
                  <p className="text-body text-cream-muted mb-8 text-center">Select date and time</p>
                  <div className="mb-10">
                    <label htmlFor="booking-date" className="block text-caption text-cream-dim mb-2">
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
                      className="w-full max-w-xs px-4 py-3 bg-dark-200 border border-dark-300 text-body text-cream focus:outline-none focus:border-brass transition-colors"
                    />
                  </div>
                  {selectedDate && availableSlots.length > 0 && (
                    <div>
                      <label className="block text-caption text-cream-dim mb-4">Available times</label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => {
                              setSelectedTime(slot);
                              setBookingStep(4);
                            }}
                            className={`py-3 text-body-sm font-medium border transition-colors ${
                              selectedTime === slot
                                ? 'border-brass bg-brass text-void'
                                : 'border-dark-300 hover:border-brass text-cream-muted'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedDate && availableSlots.length === 0 && (
                    <p className="text-body text-cream-muted">
                      No available slots for this date. Please try another date.
                    </p>
                  )}
                  <button
                    onClick={() => setBookingStep(2)}
                    className="mt-8 text-body-sm text-cream-dim hover:text-brass transition-colors"
                  >
                    ← Back to barber
                  </button>
                </div>
              )}

              {/* Step 4: Details */}
              {bookingStep === 4 && (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <p className="text-body text-cream-muted mb-2 text-center">Your details</p>
                  <div className="p-6 bg-dark-200 text-body space-y-2">
                    <p>
                      <span className="text-cream-dim">Service:</span>{' '}
                      {services.find(s => s.id === selectedService)?.name} — $
                      {services.find(s => s.id === selectedService)?.price}
                    </p>
                    <p>
                      <span className="text-cream-dim">Barber:</span>{' '}
                      {barbers.find(b => b.id === selectedBarber)?.name} · {selectedDate} at{' '}
                      {selectedTime}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="booking-name" className="block text-caption text-cream-dim mb-2">
                      Name
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-300 text-body text-cream focus:outline-none focus:border-brass transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-phone" className="block text-caption text-cream-dim mb-2">
                      Phone
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-300 text-body text-cream focus:outline-none focus:border-brass transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-email" className="block text-caption text-cream-dim mb-2">
                      Email
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-300 text-body text-cream focus:outline-none focus:border-brass transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-5 bg-brass text-void text-body font-semibold hover:bg-brass-light transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="text-body-sm text-cream-dim hover:text-brass transition-colors"
                  >
                    ← Back to date and time
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-void">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Visit Us</p>
              <h2 className="font-display text-heading-xl leading-[1.1] tracking-[-0.02em] text-cream mb-12 text-balance">
                Come see us.
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-caption text-cream-dim mb-2">Address</p>
                  <p className="text-lead text-cream">123 Main Street, Downtown</p>
                </div>
                <div>
                  <p className="text-caption text-cream-dim mb-2">Phone</p>
                  <p className="text-lead text-cream">555-0100</p>
                </div>
                <div>
                  <p className="text-caption text-cream-dim mb-2">Email</p>
                  <p className="text-lead text-cream">info@barberpro.com</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-caption text-brass mb-4 tracking-[0.08em] uppercase">Hours</p>
              <div className="space-y-0 mt-12">
                {[
                  { day: 'Monday', hours: '09:00 — 19:00' },
                  { day: 'Tuesday', hours: '09:00 — 19:00' },
                  { day: 'Wednesday', hours: '09:00 — 19:00' },
                  { day: 'Thursday', hours: '09:00 — 19:00' },
                  { day: 'Friday', hours: '09:00 — 19:00' },
                  { day: 'Saturday', hours: '10:00 — 17:00' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map(h => (
                  <div
                    key={h.day}
                    className="flex items-baseline justify-between py-5 border-b border-dark-200"
                  >
                    <span className="text-body text-cream">{h.day}</span>
                    <span className="text-body text-cream-muted tabular-nums">
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
