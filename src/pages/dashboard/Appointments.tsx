import React, { useState, useMemo } from 'react';
import { AppointmentService, BarberService, CustomerService, ServiceService } from '../../services/db';
import { Calendar, ChevronLeft, ChevronRight, Plus, X, Clock, User } from 'lucide-react';
import { AppointmentStatus } from '../../types';

const statusColors: Record<AppointmentStatus, string> = {
  booked: 'bg-blue-100 text-blue-700 border-blue-200',
  confirmed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  checked_in: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  in_service: 'bg-brand-100 text-brand-700 border-brand-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  no_show: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200',
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
      customerId: selectedCustomer,
      barberId: selectedBarber,
      serviceIds: selectedServices,
      date: selectedDate,
      startTime: selectedTime,
      type: 'walkin',
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

  const handleCancel = (id: string) => {
    AppointmentService.cancel(id);
    refresh();
  };

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
    setTimeout(refresh, 0);
  };

  // Group by barber for day view
  const groupedByBarber = useMemo(() => {
    const groups: Record<string, typeof appointments> = {};
    appointments.forEach(a => {
      if (!groups[a.barberId]) groups[a.barberId] = [];
      groups[a.barberId].push(a);
    });
    return groups;
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Appointments</h1>
          <p className="text-sm text-charcoal-500">Manage bookings and walk-ins</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800 transition-colors">
          <Plus size={16} /> New Appointment
        </button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-4 bg-white border border-charcoal-200 p-3">
        <button onClick={() => navigateDate(-1)} className="p-1 hover:bg-charcoal-100"><ChevronLeft size={20} /></button>
        <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setTimeout(refresh, 0); }} className="px-3 py-1.5 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" />
        <button onClick={() => navigateDate(1)} className="p-1 hover:bg-charcoal-100"><ChevronRight size={20} /></button>
        <span className="text-sm text-charcoal-600 ml-2">{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setView('day')} className={`px-3 py-1.5 text-xs font-medium ${view === 'day' ? 'bg-charcoal-900 text-white' : 'bg-charcoal-100 text-charcoal-600'}`}>Day</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium ${view === 'list' ? 'bg-charcoal-900 text-white' : 'bg-charcoal-100 text-charcoal-600'}`}>List</button>
        </div>
      </div>

      {/* Day View */}
      {view === 'day' && (
        <div className="space-y-4">
          {barbers.map(barber => (
            <div key={barber.id} className="bg-white border border-charcoal-200">
              <div className="px-4 py-3 border-b border-charcoal-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-charcoal-800 text-white flex items-center justify-center text-xs font-bold">
                  {barber.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-charcoal-900">{barber.name}</span>
                <span className="text-xs text-charcoal-500">{groupedByBarber[barber.id]?.length || 0} appointments</span>
              </div>
              <div className="p-4">
                {(!groupedByBarber[barber.id] || groupedByBarber[barber.id].length === 0) ? (
                  <p className="text-sm text-charcoal-400">No appointments</p>
                ) : (
                  <div className="space-y-2">
                    {groupedByBarber[barber.id]?.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(apt => {
                      const customer = customers.find(c => c.id === apt.customerId);
                      const aptServices = services.filter(s => apt.serviceIds.includes(s.id));
                      return (
                        <div key={apt.id} className="flex items-center justify-between p-3 border border-charcoal-100 hover:border-charcoal-300 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]">
                              <p className="text-sm font-bold text-charcoal-900">{apt.startTime}</p>
                              <p className="text-xs text-charcoal-400">{apt.endTime}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-charcoal-900">{customer?.name || 'Unknown'}</p>
                              <p className="text-xs text-charcoal-500">{aptServices.map(s => s.name).join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs font-medium border ${statusColors[apt.status]}`}>{apt.status.replace('_', ' ')}</span>
                            <select
                              value={apt.status}
                              onChange={e => handleStatusChange(apt.id, e.target.value as AppointmentStatus)}
                              className="text-xs border border-charcoal-200 px-2 py-1 focus:outline-none"
                            >
                              <option value="booked">Booked</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="checked_in">Checked In</option>
                              <option value="in_service">In Service</option>
                              <option value="completed">Completed</option>
                              <option value="no_show">No Show</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                              <button onClick={() => handleCancel(apt.id)} className="text-xs text-red-600 hover:text-red-700 px-2 py-1">Cancel</button>
                            )}
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
        <div className="bg-white border border-charcoal-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal-100 bg-charcoal-50">
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Time</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Barber</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Services</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-charcoal-600">Type</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-charcoal-400">No appointments for this date</td></tr>
              ) : appointments.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(apt => {
                const customer = customers.find(c => c.id === apt.customerId);
                const barber = barbers.find(b => b.id === apt.barberId);
                const aptServices = services.filter(s => apt.serviceIds.includes(s.id));
                return (
                  <tr key={apt.id} className="border-b border-charcoal-50 hover:bg-charcoal-50">
                    <td className="px-4 py-3 font-medium">{apt.startTime} — {apt.endTime}</td>
                    <td className="px-4 py-3">{customer?.name}</td>
                    <td className="px-4 py-3">{barber?.name}</td>
                    <td className="px-4 py-3 text-charcoal-600">{aptServices.map(s => s.name).join(', ')}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs font-medium border ${statusColors[apt.status]}`}>{apt.status.replace('_', ' ')}</span></td>
                    <td className="px-4 py-3 capitalize">{apt.type}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
              <h2 className="text-lg font-semibold text-charcoal-900">New Appointment</h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal-400 hover:text-charcoal-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Customer *</label>
                <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required>
                  <option value="">Select customer</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Barber *</label>
                <select value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required>
                  <option value="">Select barber</option>
                  {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Services *</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-charcoal-200 p-2">
                  {services.map(s => (
                    <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={e => {
                        if (e.target.checked) setSelectedServices([...selectedServices, s.id]);
                        else setSelectedServices(selectedServices.filter(id => id !== s.id));
                      }} className="border-charcoal-300" />
                      {s.name} (${s.price}, {s.duration}min)
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-1">Start Time *</label>
                <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)} className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-900" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-charcoal-900 text-white text-sm font-medium hover:bg-charcoal-800">Create Appointment</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 border border-charcoal-300 text-sm text-charcoal-700 hover:bg-charcoal-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
