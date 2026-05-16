'use client';

import React from 'react';
import { useVault } from '@/context/VaultContext';
import { Card } from '../ui';
import { FileText, Copy } from 'lucide-react';

export function NotesTab() {
  const { entries } = useVault();
  
  const entriesWithNotes = entries.filter(e => e.notes && e.notes.trim() !== '');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entriesWithNotes.map(entry => (
          <Card key={entry.id} className="flex flex-col h-full hover:border-blue-500/50 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-bold text-white uppercase">
                    {entry.label.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-white truncate">{entry.label}</h3>
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider truncate">{entry.category || 'General'}</p>
                  </div>
               </div>
               <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-400" />
               </div>
            </div>

            <div className="relative group flex-1">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyToClipboard(entry.notes)} className="p-1.5 bg-[#11161D] rounded text-slate-400 hover:text-blue-400 border border-slate-800 shadow-lg transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <textarea 
                readOnly 
                value={entry.notes} 
                className="w-full h-full min-h-[120px] bg-black/20 border border-slate-800/50 rounded-lg p-3 text-sm text-slate-300 focus:outline-none resize-none"
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            </div>
          </Card>
        ))}

        {entriesWithNotes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center">
            <FileText className="w-8 h-8 mb-4 opacity-50" />
            <p>No secure notes found.</p>
            <p className="text-sm mt-2 opacity-60">Add notes to your password entries to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
