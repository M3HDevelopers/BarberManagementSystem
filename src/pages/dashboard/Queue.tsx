import React, { useState, useEffect } from 'react';
import { QueueService, CustomerService, BarberService, ServiceService } from '../../services/db';
import { QueueEntry } from '../../types';
import { UserCheck, Play, Check, X, Clock } from 'lucide-react';

export default function Queue() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const barbers = BarberService.getAll();
  const customers = CustomerService.getAll(1, 1000).data;
  const services = ServiceService.getAll();

  const refresh = () => setQueue(QueueService.getAll());
  useEffect(() => { refresh(); const interval = setInterval(refresh, 5000); return () => clearInterval(interval); }, []);

  const handleCallNext = (barberId?: string) => {
    QueueService.callNext(barberId);
    refresh();
  };

  const handleComplete = (id: string) => { QueueService.complete(id); refresh(); };
  const handleCancel = (id: string) => { QueueService.cancel(id); refresh(); };

  const waiting = queue.filter(q => q.status === 'waiting');
  const inService = queue.filter(q => q.status === 'in_service');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900">Queue Management</h1>
          <p className="text-sm text-charcoal-500">{waiting.length} waiting, {inService.length} in service</p>
        </div>
        <button onClick={refresh} className="px-4 py-2 border border-charcoal-300 text-sm font-medium text-charcoal-700 hover:bg-charcoal-50">Refresh</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waiting */}
        <div className="bg-white border border-charcoal-200">
          <div className="px-5 py-3 border-b border-charcoal-100 flex items-center justify-between">
            <h3 className="font-semibold text-charcoal-900 flex items-center gap-2"><Clock size={16} className="text-yellow-600" /> Waiting ({waiting.length})</h3>
            <button onClick={() => handleCallNext()} className="px-3 py-1.5 bg-charcoal-900 text-white text-xs font-medium hover:bg-charcoal-800">Call Next</button>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {waiting.length === 0 ? (
              <p className="text-sm text-charcoal-400 text-center py-8">No customers waiting</p>
            ) : waiting.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId);
              const entryServices = services.filter(s => entry.serviceIds.includes(s.id));
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 border border-charcoal-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-charcoal-900 text-white text-xs font-bold">{entry.token}</span>
                      <span className="text-sm font-medium text-charcoal-900">{customer?.name || 'Walk-in'}</span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1">{entryServices.map(s => s.name).join(', ')} • ~{entry.estimatedWait} min wait</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <select onChange={e => { if (e.target.value) { QueueService.callNext(e.target.value); refresh(); e.target.value = ''; } }} className="text-xs border border-charcoal-200 px-2 py-1">
                      <option value="">Assign</option>
                      {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={() => handleCancel(entry.id)} className="p-1 text-red-500 hover:bg-red-50"><X size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* In Service */}
        <div className="bg-white border border-charcoal-200">
          <div className="px-5 py-3 border-b border-charcoal-100">
            <h3 className="font-semibold text-charcoal-900 flex items-center gap-2"><UserCheck size={16} className="text-brand-600" /> In Service ({inService.length})</h3>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {inService.length === 0 ? (
              <p className="text-sm text-charcoal-400 text-center py-8">No one in service</p>
            ) : inService.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId);
              const barber = barbers.find(b => b.id === entry.barberId);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 border border-brand-200 bg-brand-50">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand-600 text-white text-xs font-bold">{entry.token}</span>
                      <span className="text-sm font-medium text-charcoal-900">{customer?.name || 'Walk-in'}</span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1">With {barber?.name || 'Unassigned'} • Started {entry.startedAt ? new Date(entry.startedAt).toLocaleTimeString() : ''}</p>
                  </div>
                  <button onClick={() => handleComplete(entry.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium hover:bg-green-700">
                    <Check size={12} /> Complete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
