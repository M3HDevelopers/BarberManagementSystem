import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-950 to-black" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-brand-600 flex items-center justify-center">
              <Scissors size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">BarberPro</h1>
              <p className="text-[11px] text-surface-400 uppercase tracking-wider">Management System</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white leading-tight mb-6">
            Run your barbershop<br />
            <span className="text-brand-500">like a pro.</span>
          </h2>
          <p className="text-surface-400 text-[15px] leading-relaxed max-w-md mb-12">
            Complete shop management solution — appointments, billing, inventory, reports, and more. Everything you need in one place.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-[11px] text-surface-500 mt-1 uppercase tracking-wide">Active Shops</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-[11px] text-surface-500 mt-1 uppercase tracking-wide">Appointments</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">99%</p>
              <p className="text-[11px] text-surface-500 mt-1 uppercase tracking-wide">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 bg-brand-600 flex items-center justify-center">
              <Scissors size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">BarberPro</span>
          </div>

          <div className="mb-8">
            <h2 className="text-[22px] font-bold text-white mb-1.5">Welcome back</h2>
            <p className="text-[13px] text-surface-400">Sign in to access your dashboard</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 mb-5 animate-scale-in">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <p className="text-[13px] text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-surface-300 mb-2 uppercase tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-surface-900 border border-surface-700 text-white text-[14px] placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-surface-300 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-surface-900 border border-surface-700 text-white text-[14px] placeholder-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-600 text-white font-semibold text-[14px] hover:bg-brand-700 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-800">
            <p className="text-[11px] text-surface-500 uppercase tracking-wide mb-3 font-medium">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'Owner', user: 'admin', pass: 'admin123' },
                { role: 'Manager', user: 'manager', pass: 'manager123' },
                { role: 'Reception', user: 'reception', pass: 'reception123' },
                { role: 'Barber', user: 'barber1', pass: 'barber123' },
              ].map(acc => (
                <button
                  key={acc.user}
                  onClick={() => { setUsername(acc.user); setPassword(acc.pass); }}
                  className="p-2.5 bg-surface-900/50 border border-surface-800 text-left hover:border-surface-600 transition-all group"
                >
                  <p className="text-[11px] font-semibold text-surface-300">{acc.role}</p>
                  <p className="text-[10px] text-surface-500 mt-0.5">{acc.user} / {acc.pass}</p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-surface-500 text-[12px] mt-8">
            <a href="/" className="hover:text-surface-300 transition-colors">← Back to website</a>
          </p>
        </div>
      </div>
    </div>
  );
}
