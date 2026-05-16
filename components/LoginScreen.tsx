'use client';

import React, { useState } from 'react';
import { useVault } from '@/context/VaultContext';
import { Lock, Shield, User, Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui';

export function LoginScreen() {
  const { login, binId } = useVault();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username !== 'OwnerDev') {
      setError('Invalid credentials');
      setPassword('');
      return;
    }

    setLoading(true);
    
    // For first time init without a bin, force 'boxrunner2049'
    // For subsequent logins (where a bin/local data exists), login() logic in Context will handle it
    const success = await login(password);
    
    if (!success) {
      // If it failed and we don't have a bin, check if it's the magic password
      if (!binId && password !== 'boxrunner2049') {
        setError('Invalid credentials');
      } else {
        setError('Incorrect password or corrupted data.');
      }
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden border-slate-800 bg-[#11161D]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
          
          <div className="p-4 flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white stroke-[2px]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
              VAULT<span className="text-blue-500">.IO</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-1">AES-256 Encrypted Storage</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-slate-800/50">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Username</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-transparent border-none py-1 pl-9 pr-4 text-blue-200 outline-none focus:ring-0 text-sm"
                  style={{ fontFamily: "'Courier New', monospace" }}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-slate-800/50">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Password</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none py-1 pl-9 pr-4 text-purple-200 outline-none focus:ring-0 text-sm tracking-widest"
                  style={{ fontFamily: "'Courier New', monospace" }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-sm flex items-center justify-center p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors active:scale-[0.98] flex items-center justify-center disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Decrypt & Enter'}
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
