import React, { useState, useMemo } from 'react';
import { AppointmentService, BarberService, CustomerService, ServiceService } from '../../services/db';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock } from 'lucide-react';
import { AppointmentStatus } from '../../types';

const statusConfig: Record<AppointmentStatus, { bg: string; text: string; label: string }> = {
  booked: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Booked' },
  confirmed: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Confirmed' },
  checked_in: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Checked In' },
  in_service: { bg: 'bg-brand-50', text: 'text-brand-700', label: 'In Service' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Completed' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: 'Cancelled' },
  no_show: { bg: 'bg-surface-100', text: 'text-surface-600', label: 'No Show' },
};

export default function Appointments() {
  const [view, setView] = useState<'day' | 'list'>('day');
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
    const result = AppointmentService.create({
      customerId: selectedCustomer, barberId: selectedBarber,
      serviceIds: selectedServices, date: selectedDate, startTime: selectedTime, type: 'walkin',
    });
    if (result) {
      setShowModal(false);
      setSelectedCustomer(''); setSelectedBarber(''); setSelectedServices([]); setSelectedTime('');
      refresh();
    }
  };

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    AppointmentService.updateStatus(id, status);
    refresh();
  };

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
    setTimeout(refresh, 0);
  };

  const groupedByBarber = useMemo(() => {
    const groups: Record<string, typeof appointments> = {};
    appointments.forEach(a => {
      if (!groups[a.barberId]) groups[a.barberId] = [];
      groups[a.barberId].push(a);
    });
    return groups;
  }, [appointments]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Appointments</h1>
          <p className="text-[13px] text-surface-500">Manage bookings and walk-ins</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">
          <Plus size={15} /> New Appointment
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-surface-200/60 p-3">
        <button onClick={() => navigateDate(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface-100 transition-colors"><ChevronLeft size={18} /></button>
        <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setTimeout(refresh, 0); }} className="px-3 py-2 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 transition-colors" />
        <button onClick={() => navigateDate(1)} className="w-8 h-8 flex items-center justify-center hover:bg-surface-100 transition-colors"><ChevronRight size={18} /></button>
        <span className="text-[13px] font-medium text-surface-700 ml-1">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        <div className="ml-auto flex gap-1 bg-surface-100 p-0.5">
          <button onClick={() => setView('day')} className={`px-3 py-1.5 text-[11px] font-semibold transition-all ${view === 'day' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500'}`}>Day</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-[11px] font-semibold transition-all ${view === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500'}`}>List</button>
        </div>
      </div>

      {/* Day View */}
      {view === 'day' && (
        <div className="space-y-4">
          {barbers.map(barber => (
            <div key={barber.id} className="bg-white border border-surface-200/60 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-surface-100 flex items-center gap-3 bg-surface-50/50">
                <div className="w-8 h-8 bg-gradient-to-br from-surface-700 to-surface-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-[13px] font-semibold text-surface-900">{barber.name}</span>
                <span className="text-[11px] text-surface-400 bg-surface-100 px-2 py-0.5 font-medium">{groupedByBarber[barber.id]?.length || 0} appointments</span>
              </div>
              <div className="p-4">
                {(!groupedByBarber[barber.id] || groupedByBarber[barber.id].length === 0) ? (
                  <p className="text-[13px] text-surface-400 text-center py-6">No appointments scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {groupedByBarber[barber.id]?.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(apt => {
                      const customer = customers.find(c => c.id === apt.customerId);
                      const aptServices = services.filter(s => apt.serviceIds.includes(s.id));
                      const sc = statusConfig[apt.status];
                      return (
                        <div key={apt.id} className="flex flex-wrap items-center justify-between gap-3 p-3.5 border border-surface-100 hover:border-surface-300 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[56px]">
                              <p className="text-[14px] font-bold text-surface-900">{apt.startTime}</p>
                              <p className="text-[11px] text-surface-400">{apt.endTime}</p>
                            </div>
                            <div className="w-px h-8 bg-surface-200" />
                            <div>
                              <p className="text-[13px] font-semibold text-surface-900">{customer?.name || 'Unknown'}</p>
                              <p className="text-[11px] text-surface-500">{aptServices.map(s => s.name).join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${sc.bg} ${sc.text}`}>{sc.label}</span>
                            <select
                              value={apt.status}
                              onChange={e => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                              className="text-[11px] border border-surface-200 px-2 py-1.5 focus:outline-none focus:border-surface-900 bg-white"
                            >
                              <option value="booked">Booked</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="checked_in">Checked In</option>
                              <option value="in_service">In Service</option>
                              <option value="completed">Completed</option>
                              <option value="no_show">No Show</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white border border-surface-200/60 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Time</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Barber</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Services</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-surface-500 text-[11px] uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-surface-400">No appointments for this date</td></tr>
              ) : appointments.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(apt => {
                const customer = customers.find(c => c.id === apt.customerId);
                const barber = barbers.find(b => b.id === apt.barberId);
                const aptServices = services.filter(s => apt.serviceIds.includes(s.id));
                const sc = statusConfig[apt.status];
                return (
                  <tr key={apt.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-surface-900">{apt.startTime} — {apt.endTime}</td>
                    <td className="px-5 py-3.5 font-medium text-surface-800">{customer?.name}</td>
                    <td className="px-5 py-3.5 text-surface-600">{barber?.name}</td>
                    <td className="px-5 py-3.5 text-surface-500">{aptServices.map(s => s.name).join(', ')}</td>
                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${sc.bg} ${sc.text}`}>{sc.label}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[11px] font-medium text-surface-500 capitalize">{apt.type}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100 sticky top-0 bg-white z-10">
              <h2 className="text-[16px] font-bold text-surface-900">New Appointment</h2>
              <button onClick={() => setShowModal(false)} className="text-surface-400 hover:text-surface-900 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Customer *</label>
                <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white" required>
                  <option value="">Select customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Barber *</label>
                <select value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900 bg-white" required>
                  <option value="">Select barber</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Services *</label>
                <div className="space-y-1 max-h-36 overflow-y-auto border border-surface-200 p-3">
                  {services.map(s => (
                    <label key={s.id} className="flex items-center gap-2.5 text-[13px] cursor-pointer py-1 hover:bg-surface-50 px-1 transition-colors">
                      <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={e => {
                        if (e.target.checked) setSelectedServices([...selectedServices, s.id]);
                        else setSelectedServices(selectedServices.filter(id => id !== s.id));
                      }} className="border-surface-300 accent-surface-900" />
                      <span className="text-surface-700">{s.name}</span>
                      <span className="text-[11px] text-surface-400 ml-auto">${s.price} · {s.duration}min</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5">Start Time *</label>
                <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full px-3 py-2.5 border border-surface-200 text-[13px] focus:outline-none focus:border-surface-900" required />
              </div>
              <div className="flex gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 bg-surface-900 text-white text-[13px] font-semibold hover:bg-surface-800 transition-colors">Create Appointment</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 border border-surface-200 text-[13px] text-surface-700 hover:bg-surface-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
