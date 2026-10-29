import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal-800 border border-charcoal-700 mb-4">
            <Scissors size={32} className="text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            <span className="text-brand-600">Barber</span>Pro
          </h1>
          <p className="text-charcoal-400 text-sm mt-1">Shop Management System</p>
        </div>

        <div className="bg-white p-8 border border-charcoal-200">
          <h2 className="text-lg font-semibold text-charcoal-900 mb-6">Sign in to your account</h2>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 mb-4">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-charcoal-300 text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-900 transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-charcoal-300 text-charcoal-900 text-sm focus:outline-none focus:border-charcoal-900 transition-colors"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-charcoal-900 text-white font-medium text-sm hover:bg-charcoal-800 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-charcoal-100">
            <p className="text-xs text-charcoal-500 mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-600">
              <div className="p-2 bg-charcoal-50 border border-charcoal-100">
                <span className="font-medium">Owner:</span> admin / admin123
              </div>
              <div className="p-2 bg-charcoal-50 border border-charcoal-100">
                <span className="font-medium">Manager:</span> manager / manager123
              </div>
              <div className="p-2 bg-charcoal-50 border border-charcoal-100">
                <span className="font-medium">Reception:</span> reception / reception123
              </div>
              <div className="p-2 bg-charcoal-50 border border-charcoal-100">
                <span className="font-medium">Barber:</span> barber1 / barber123
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-charcoal-500 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">← Back to website</a>
        </p>
      </div>
    </div>
  );
}
