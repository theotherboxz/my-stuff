'use client';

import React from 'react';
import { useVault } from '@/context/VaultContext';
import { Shield, Cloud, CloudOff, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

export function AppTopbar() {
  const { syncStatus, syncMessage, logout } = useVault();

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'Synced': return <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />;
      case 'Syncing': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'Error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'Local Only': return <CloudOff className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getSyncText = () => {
    switch (syncStatus) {
      case 'Synced': return 'Synced';
      case 'Syncing': return 'Syncing...';
      case 'Error': return 'Sync Error';
      case 'Local Only': return 'Local Only';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-[#0A0E17] border-b border-slate-800 shadow-2xl z-50">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white stroke-[2px]" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
          VAULT<span className="text-blue-500">.IO</span>
        </span>
      </div>

      <div className="flex items-center space-x-6">
        <div 
          className="flex items-center bg-[#161B22] px-3 py-1.5 rounded-full border border-slate-700"
          title={syncStatus === 'Error' ? syncMessage : undefined}
        >
          {getSyncIcon()}
          <span className={`text-xs font-medium uppercase tracking-widest ml-2
            ${syncStatus === 'Synced' ? 'text-slate-400' : ''}
            ${syncStatus === 'Syncing' ? 'text-blue-400' : ''}
            ${syncStatus === 'Error' ? 'text-red-400' : ''}
            ${syncStatus === 'Local Only' ? 'text-yellow-400' : ''}
          `}>
            {getSyncText()}
          </span>
        </div>

        <div className="flex items-center space-x-4 border-l border-slate-700 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-none">OwnerDev</p>
            <p className="text-[10px] text-slate-500 uppercase mt-0.5 tracking-tighter">Primary Key Active</p>
          </div>
          <button
            onClick={logout}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            title="Lock Vault"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
