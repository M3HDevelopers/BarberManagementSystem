import React, { useState, useEffect } from 'react';
import { QueueService, CustomerService, BarberService, ServiceService } from '../../services/db';
import { QueueEntry } from '../../types';

export default function Queue() {
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const barbers = BarberService.getAll(); const customers = CustomerService.getAll(1, 1000).data;
  const refresh = () => setQueue(QueueService.getAll());
  useEffect(() => { refresh(); const i = setInterval(refresh, 5000); return () => clearInterval(i); }, []);
  const waiting = queue.filter(q => q.status === 'waiting'); const inService = queue.filter(q => q.status === 'in_service');
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <div><h1 className="text-[22px] font-normal tracking-[-0.02em] text-cream-50">Queue</h1><p className="text-[13px] text-stone-500 mt-0.5">{waiting.length} waiting · {inService.length} in service</p></div>
        <button onClick={refresh} className="px-4 py-2 border border-stone-800 text-[12px] text-stone-400 hover:text-cream-200 hover:border-stone-600 transition-colors">Refresh</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-stone-900">
          <div className="px-5 py-3 border-b hairline-dark flex items-center justify-between"><p className="text-[13px] font-medium text-cream-100">Waiting ({waiting.length})</p><button onClick={() => QueueService.callNext() && refresh()} className="px-3 py-1.5 bg-cream-50 text-stone-900 text-[11px] font-medium">Call next</button></div>
          <div className="p-4 space-y-1.5 max-h-[400px] overflow-y-auto">
            {waiting.length === 0 ? <p className="text-[12px] text-stone-600 text-center py-6">No one waiting</p> : waiting.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-stone-950/50">
                  <div className="flex items-center gap-3"><span className="px-2 py-0.5 bg-stone-800 text-stone-300 text-[10px] font-bold">{entry.token}</span><span className="text-[12px] text-cream-100">{customer?.name || 'Walk-in'}</span></div>
                  <div className="flex items-center gap-2">
                    <select onChange={e => { if (e.target.value) { QueueService.callNext(e.target.value); refresh(); e.target.value = ''; } }} className="text-[10px] bg-stone-800 border border-stone-700 text-stone-400 px-1.5 py-1 focus:outline-none"><option value="">Assign</option>{barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
                    <button onClick={() => { QueueService.cancel(entry.id); refresh(); }} className="text-[10px] text-oxblood-500 hover:text-oxblood-400">Cancel</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-stone-900">
          <div className="px-5 py-3 border-b hairline-dark"><p className="text-[13px] font-medium text-cream-100">In service ({inService.length})</p></div>
          <div className="p-4 space-y-1.5 max-h-[400px] overflow-y-auto">
            {inService.length === 0 ? <p className="text-[12px] text-stone-600 text-center py-6">No one in service</p> : inService.map(entry => {
              const customer = customers.find(c => c.id === entry.customerId); const barber = barbers.find(b => b.id === entry.barberId);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-stone-950/50">
                  <div className="flex items-center gap-3"><span className="px-2 py-0.5 bg-oxblood-700 text-cream-50 text-[10px] font-bold">{entry.token}</span><div><p className="text-[12px] text-cream-100">{customer?.name || 'Walk-in'}</p><p className="text-[10px] text-stone-500">With {barber?.name || 'Unassigned'}</p></div></div>
                  <button onClick={() => { QueueService.complete(entry.id); refresh(); }} className="px-3 py-1.5 bg-emerald-700 text-cream-50 text-[10px] font-medium hover:bg-emerald-600 transition-colors">Complete</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
