import React, { useState, useEffect } from 'react';
import { QueueService, CustomerService, BarberService, ServiceService } from '../../services/db';
import { QueueEntry } from '../../types';
import { Clock, Check, X, Users, Play } from 'lucide-react';

export default function Queue() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const barbers = BarberService.getAll();
  const customers = CustomerService.getAll(1, 1000).data;
  const services = ServiceService.getAll();

  const refresh = () => setQueue(QueueService.getAll());
  useEffect(() => { refresh(); const interval = setInterval(refresh, 5000); return () => clearInterval(interval); }, []);

  const handleCallNext = (barberId?: string) => { QueueService.callNext(barberId); refresh(); };
  const handleComplete = (id: string) => { QueueService.complete(id); refresh(); };
  const handleCancel = (id: string) => { QueueService.cancel(id); refresh(); };

  const waiting = queue.filter(q => q.status === 'waiting');
  const inService = queue.filter(q => q.status === 'in_service');

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-surface-900 tracking-tight">Queue Management</h1>
          <p className="text-[13px] text-surface-500">{waiting.length} waiting · {inService.length} in service</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 animate-pulse" /> Live
          </span>
          <button onClick={refresh} className="px-4 py-2 border border-surface-200 text-[12px] font-semibold text-surface-700 hover:bg-surface-50 transition-colors">Refresh</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Waiting */}
        <div className="bg-white border border-surface-200/60">
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between bg-amber-50/30">
            <h3 className="text-[14px] font-bold text-surface-900 flex items-center gap-2">
              <Clock size={15} className="text-amber-500" /> Waiting
              <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5">{waiting.length}</span>
            </h3>
            <button onClick={() => handleCallNext()} className="px-3 py-1.5 bg-surface-900 text-white text-[11px] font-semibold hover:bg-surface-800 transition-colors flex items-center gap-1">
              <Play size={10} /> Call Next
            </button>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {waiting.length === 0 ? (
              <div className="text-center py-10">
                <Users size={28} className="mx-auto text-surface-200 mb-2" />
                <p className="text-[13px] text-surface-400">No customers waiting</p>
              </div>
            ) : waiting.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId);
              const entryServices = services.filter(s => entry.serviceIds.includes(s.id));
              return (
                <div key={entry.id} className="flex items-center justify-between gap-3 p-3.5 border border-surface-100 hover:border-surface-300 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-surface-900 text-white text-[11px] font-bold">{entry.token}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-surface-900">{customer?.name || 'Walk-in'}</p>
                      <p className="text-[11px] text-surface-400">{entryServices.map(s => s.name).join(', ')} · ~{entry.estimatedWait}min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select onChange={e => { if (e.target.value) { QueueService.callNext(e.target.value); refresh(); e.target.value = ''; } }} className="text-[11px] border border-surface-200 px-2 py-1.5 bg-white focus:outline-none focus:border-surface-900">
                      <option value="">Assign</option>
                      {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={() => handleCancel(entry.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"><X size={13} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* In Service */}
        <div className="bg-white border border-surface-200/60">
          <div className="px-5 py-4 border-b border-surface-100 bg-brand-50/30">
            <h3 className="text-[14px] font-bold text-surface-900 flex items-center gap-2">
              <Play size={15} className="text-brand-600" /> In Service
              <span className="text-[11px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5">{inService.length}</span>
            </h3>
          </div>
          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
            {inService.length === 0 ? (
              <div className="text-center py-10">
                <Users size={28} className="mx-auto text-surface-200 mb-2" />
                <p className="text-[13px] text-surface-400">No one in service</p>
              </div>
            ) : inService.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId);
              const barber = barbers.find(b => b.id === entry.barberId);
              return (
                <div key={entry.id} className="flex items-center justify-between gap-3 p-3.5 border border-brand-200 bg-brand-50/30">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-brand-600 text-white text-[11px] font-bold">{entry.token}</span>
                    <div>
                      <p className="text-[13px] font-semibold text-surface-900">{customer?.name || 'Walk-in'}</p>
                      <p className="text-[11px] text-surface-500">With {barber?.name || 'Unassigned'} · {entry.startedAt ? new Date(entry.startedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => handleComplete(entry.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 transition-colors">
                    <Check size={11} /> Complete
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
