'use client';

import React, { useState } from 'react';
import { AppTopbar, PasswordsTab, NotesTab, SettingsTab } from './dashboard';
import { motion, AnimatePresence } from 'motion/react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'passwords' | 'notes' | 'settings'>('passwords');

  return (
    <div className="flex flex-col h-screen w-full bg-[#05070A] text-slate-200 overflow-hidden">
      <AppTopbar />
      
      {/* Tabs Menu Area */}
      <div className="flex items-center px-4 md:px-8 py-4 bg-[#0A0E17]/50 border-b border-slate-800/50 flex-shrink-0">
        <div className="flex space-x-1 p-1 bg-black/40 rounded-xl border border-slate-800">
          {(['passwords', 'notes', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all relative ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
        {/* We leave space for the specific tab actions which will be rendered by the tabs themselves */}
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === 'passwords' && (
              <motion.div
                key="passwords"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <PasswordsTab />
              </motion.div>
            )}
            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <NotesTab />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <SettingsTab />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="h-12 bg-black border-t border-slate-800 px-8 flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-widest flex-shrink-0 hidden sm:flex">
        <div>AES-256-GCM MILITARY GRADE ENCRYPTION ACTIVE</div>
      </footer>
    </div>
  );
}
