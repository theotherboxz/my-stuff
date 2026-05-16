'use client';

import React, { useState } from 'react';
import { useVault } from '@/context/VaultContext';
import { Card } from '../ui';
import { Key, Database, RefreshCw, Download, Save, Copy, Unplug } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SettingsTab() {
  const { binId, connectToBin, disconnectBin, changePassword, forcePush, forcePull, exportData, syncStatus } = useVault();
  
  const [newBinIdInput, setNewBinIdInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  
  const [statusMessage, setStatusMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const showStatus = (type: 'success'|'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleUpdateBin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBinIdInput.trim()) {
      const result = await connectToBin(newBinIdInput.trim());
      if (result.success) {
        showStatus('success', 'Connected to vault successfully!');
        setNewBinIdInput('');
      } else {
        showStatus('error', result.message || 'Failed to connect.');
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      showStatus('error', 'Passwords do not match');
      return;
    }
    const success = await changePassword(newPasswordInput);
    if (success) {
      showStatus('success', 'Vault re-encrypted with new password successfully.');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } else {
      showStatus('error', 'Failed to change encryption key.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showStatus('success', 'Copied to clipboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg font-mono text-sm border flex items-center justify-center ${
              statusMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">Cloud Database Synchronization</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Current JSONBin.io ID</label>
            <div className="flex space-x-2">
              <div className="flex-1 bg-black/20 border border-slate-800/50 rounded-lg py-2 px-3 text-sm text-slate-300 flex items-center justify-between" style={{ fontFamily: "'Courier New', monospace" }}>
                <span>{binId || 'Not connected to cloud'}</span>
                {binId && (
                  <div className="flex space-x-3">
                    <button type="button" onClick={() => copyToClipboard(binId)} className="text-slate-500 hover:text-blue-400 transition-colors" title="Copy Bin ID">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={disconnectBin} className="text-slate-500 hover:text-red-400 transition-colors" title="Disconnect Cloud">
                      <Unplug className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500">Copy this ID to access your vault on another device.</p>
          </div>

          <form onSubmit={handleUpdateBin} className="space-y-2 pt-4 border-t border-slate-800/50">
            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Connect to existing Vault</label>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newBinIdInput}
                onChange={e => setNewBinIdInput(e.target.value)}
                placeholder="Paste Bin ID here to establish cross-device access..."
                className="flex-1 bg-black/20 border border-slate-800/50 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500" style={{ fontFamily: "'Courier New', monospace" }}
              />
              <button 
                type="submit"
                disabled={!newBinIdInput.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold disabled:opacity-50"
              >
                Connect
              </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800/50">
             <button 
                onClick={forcePush}
                disabled={syncStatus === 'Syncing'}
                className="flex-1 bg-[#11161D] border border-blue-500/30 hover:border-blue-500/60 hover:bg-[#11161D]/80 text-blue-300 px-4 py-2.5 rounded-lg transition-all text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
             >
                <Save className="w-4 h-4" />
                <span>Force Push to Cloud</span>
             </button>
             <button 
                onClick={forcePull}
                disabled={syncStatus === 'Syncing'}
                className="flex-1 bg-[#11161D] border border-blue-500/30 hover:border-blue-500/60 hover:bg-[#11161D]/80 text-blue-300 px-4 py-2.5 rounded-lg transition-all text-sm font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
             >
                <RefreshCw className={`w-4 h-4 ${syncStatus === 'Syncing' ? 'animate-spin' : ''}`} />
                <span>Force Pull from Cloud</span>
             </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 flex-shrink-0">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold">Change Encryption Key</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
           <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPasswordInput}
                onChange={e => setNewPasswordInput(e.target.value)}
                className="w-full bg-black/20 border border-slate-800/50 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500 tracking-widest" style={{ fontFamily: "'Courier New', monospace" }}
              />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPasswordInput}
                onChange={e => setConfirmPasswordInput(e.target.value)}
                className="w-full bg-black/20 border border-slate-800/50 rounded-lg py-2 px-3 text-sm text-slate-300 focus:outline-none focus:border-purple-500 tracking-widest" style={{ fontFamily: "'Courier New', monospace" }}
              />
           </div>
           
           <div className="pt-2">
             <p className="text-xs text-yellow-500/80 mb-4 bg-yellow-500/10 p-3 rounded border border-yellow-500/20">
               <strong>Warning:</strong> Changing your password will re-encrypt all your data. Ensure you do not forget the new password, as data cannot be recovered without it.
             </p>
             <button 
                type="submit"
                disabled={!newPasswordInput || newPasswordInput !== confirmPasswordInput}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-4 py-2.5 rounded-lg shadow-lg disabled:opacity-50"
             >
                Re-Encrypt Vault
             </button>
           </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
             <h2 className="text-lg font-bold">Local Backup</h2>
             <p className="text-sm text-slate-400">Download a JSON file of your fully encrypted vault.</p>
          </div>
          <button 
            onClick={exportData}
            className="p-3 bg-black/20 hover:bg-black/40 border border-slate-800/50 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </Card>

    </div>
  );
}
