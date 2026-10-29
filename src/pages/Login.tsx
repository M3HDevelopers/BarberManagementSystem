import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (login(username, password)) navigate('/dashboard');
    else setError('Invalid credentials');
  };
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="w-full max-w-[360px]">
        <p className="text-[17px] font-medium text-cream-50 mb-1 tracking-[-0.01em]">BarberPro</p>
        <p className="text-[13px] text-stone-500 mb-10">Staff sign-in</p>
        {error && <p className="text-[13px] text-oxblood-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] text-stone-400 mb-1.5">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-cream-50 text-[14px] focus:outline-none focus:border-stone-600 transition-colors" placeholder="admin" />
          </div>
          <div>
            <label className="block text-[12px] text-stone-400 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-stone-900 border border-stone-800 text-cream-50 text-[14px] focus:outline-none focus:border-stone-600 transition-colors" placeholder="admin123" />
          </div>
          <button type="submit" className="w-full py-3 bg-cream-50 text-stone-900 text-[14px] font-medium hover:bg-cream-100 transition-colors">Sign in</button>
        </form>
        <div className="mt-10 pt-8 border-t border-stone-800">
          <p className="text-[11px] text-stone-600 mb-3">Demo accounts</p>
          <div className="space-y-1.5">
            {[{ r: 'Owner', u: 'admin', p: 'admin123' }, { r: 'Manager', u: 'manager', p: 'manager123' }, { r: 'Reception', u: 'reception', p: 'reception123' }, { r: 'Barber', u: 'barber1', p: 'barber123' }].map(a => (
              <button key={a.u} onClick={() => { setUsername(a.u); setPassword(a.p); }} className="w-full text-left px-3 py-2 text-[12px] text-stone-400 hover:text-cream-200 hover:bg-stone-900 transition-colors">
                <span className="text-stone-500">{a.r}:</span> {a.u} / {a.p}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-[12px] text-stone-600 mt-8"><a href="/" className="hover:text-stone-400 transition-colors">Back to website</a></p>
      </div>
    </div>
  );
}
