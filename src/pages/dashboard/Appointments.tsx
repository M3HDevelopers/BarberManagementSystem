import React, { useState, useMemo } from 'react';
import { AppointmentService, BarberService, CustomerService, ServiceService } from '../../services/db';
import { AppointmentStatus } from '../../types';

export default function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointments, setAppointments] = useState(AppointmentService.getAll({ date: selectedDate }));
  const barbers = BarberService.getAll();
  const customers = CustomerService.getAll(1, 1000).data;
  const services = ServiceService.getAll();
  const refresh = () => setAppointments(AppointmentService.getAll({ date: selectedDate }));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedBarber || !selectedTime || selectedServices.length === 0) return;
    const result = AppointmentService.create({ customerId: selectedCustomer, barberId: selectedBarber, serviceIds: selectedServices, date: selectedDate, startTime: selectedTime, type: 'walkin' });
    if (result) { setShowModal(false); setSelectedCustomer(''); setSelectedBarber(''); setSelectedServices([]); setSelectedTime(''); refresh(); }
  };

  const groupedByBarber = useMemo(() => {
    const groups: Record<string, typeof appointments> = {};
    appointments.forEach(a => { if (!groups[a.barberId]) groups[a.barberId] = []; groups[a.barberId].push(a); });
    return groups;
  }, [appointments]);

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Appointments</h1>
          <p className="text-[13px] text-stone-500 mt-0.5">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setTimeout(refresh, 0); }} className="px-3 py-2 bg-stone-900 border border-stone-800 text-[13px] text-cream-100 focus:outline-none focus:border-stone-600" />
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100 transition-colors">New</button>
        </div>
      </div>
      <div className="space-y-4">
        {barbers.map(barber => (
          <div key={barber.id} className="bg-stone-900">
            <div className="px-5 py-3 border-b hairline-dark flex items-center gap-3">
              <div className="w-7 h-7 bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400">{barber.name.charAt(0)}</div>
              <span className="text-[13px] font-medium text-cream-100">{barber.name}</span>
              <span className="text-[11px] text-stone-500 ml-auto">{groupedByBarber[barber.id]?.length || 0}</span>
            </div>
            <div className="p-4">
              {(!groupedByBarber[barber.id] || groupedByBarber[barber.id].length === 0) ? (
                <p className="text-[12px] text-stone-600 py-3">No appointments</p>
              ) : (
                <div className="space-y-1.5">
                  {groupedByBarber[barber.id]?.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(apt => {
                    const customer = customers.find(c => c.id === apt.customerId);
                    return (
                      <div key={apt.id} className="flex items-center justify-between py-2.5 px-3 bg-stone-950/50">
                        <div className="flex items-center gap-4">
                          <span className="text-[13px] font-medium text-cream-100 tabular-nums w-12">{apt.startTime}</span>
                          <span className="text-[13px] text-stone-300">{customer?.name}</span>
                        </div>
                        <select value={apt.status} onChange={e => { AppointmentService.updateStatus(apt.id, e.target.value as AppointmentStatus); refresh(); }} className="text-[11px] bg-stone-800 border border-stone-700 text-stone-300 px-2 py-1 focus:outline-none">
                          <option value="booked">Booked</option><option value="confirmed">Confirmed</option><option value="checked_in">Checked in</option>
                          <option value="in_service">In service</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 w-full max-w-md border border-stone-800">
            <div className="px-6 py-4 border-b hairline-dark flex justify-between items-center">
              <p className="text-[15px] font-medium text-cream-50">New appointment</p>
              <button onClick={() => setShowModal(false)} className="text-stone-500 hover:text-cream-200 text-[13px]">Close</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Customer</label><select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required><option value="">Select</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Barber</label><select value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required><option value="">Select</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Services</label><div className="space-y-1 max-h-32 overflow-y-auto border border-stone-800 p-2">{services.map(s => <label key={s.id} className="flex items-center gap-2 text-[12px] text-stone-300 py-1 cursor-pointer"><input type="checkbox" checked={selectedServices.includes(s.id)} onChange={e => { if (e.target.checked) setSelectedServices([...selectedServices, s.id]); else setSelectedServices(selectedServices.filter(id => id !== s.id)); }} className="accent-oxblood-600" />{s.name} — ${s.price}</label>)}</div></div>
              <div><label className="block text-[12px] text-stone-400 mb-1.5">Time</label><input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full px-3 py-2.5 bg-stone-950 border border-stone-800 text-[13px] text-cream-100 focus:outline-none" required /></div>
              <button type="submit" className="w-full py-2.5 bg-cream-50 text-stone-900 text-[13px] font-medium hover:bg-cream-100 transition-colors">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
