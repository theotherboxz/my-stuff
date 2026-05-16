'use client';

import React, { useState } from 'react';
import { useVault, PasswordEntry } from '@/context/VaultContext';
import { Card } from '../ui';
import { Plus, Search, MoreVertical, Copy, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function PasswordsTab() {
  const { entries, addEntry, updateEntry, deleteEntry } = useVault();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredEntries = entries.filter(e => 
    e.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search vault..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-[#161B22] border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 text-slate-300 transition-colors"
          />
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto justify-center flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
        <AnimatePresence>
          {isAdding && (
             <EntryForm 
                onClose={() => setIsAdding(false)} 
                onSubmit={(e) => { addEntry(e); setIsAdding(false); }} 
             />
          )}
          
          {editingId && (
            <EntryForm 
              initialData={entries.find(e => e.id === editingId)}
              onClose={() => setEditingId(null)} 
              onSubmit={(e) => { updateEntry(editingId, e); setEditingId(null); }} 
            />
          )}

          {filteredEntries.map(entry => (
            <PasswordCard 
              key={entry.id} 
              entry={entry} 
              onEdit={() => setEditingId(entry.id)}
              onDelete={() => deleteEntry(entry.id)}
            />
          ))}
        </AnimatePresence>
        
        {filteredEntries.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No password entries found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordCard({ entry, onEdit, onDelete }: { entry: PasswordEntry, onEdit: () => void, onDelete: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-full"
    >
      <Card className="flex flex-col group hover:border-blue-500/50 transition-all h-[280px]">
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
          <div className="flex space-x-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="text-slate-500 hover:text-white transition-colors">
              <Edit2 className="w-5 h-5" />
            </button>
            <button onClick={onDelete} className="text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="bg-black/20 p-3 rounded-lg border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Username</p>
            <div className="flex justify-between items-center">
              <code style={{ fontFamily: "'Courier New', monospace" }} className="text-sm text-blue-200 truncate mr-2">
                {entry.username}
              </code>
              <button onClick={() => copyToClipboard(entry.username)} className="text-slate-500 hover:text-blue-400 flex-shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-black/20 p-3 rounded-lg border border-slate-800/50">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Password</p>
            <div className="flex justify-between items-center">
              <code style={{ fontFamily: "'Courier New', monospace" }} className="text-sm text-purple-200 tracking-widest truncate mr-2">
                {showPassword ? entry.password : '••••••••••••'}
              </code>
              <div className="flex space-x-2 flex-shrink-0">
                <button onClick={() => setShowPassword(!showPassword)} className="text-slate-500 hover:text-purple-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copyToClipboard(entry.password)} className="text-slate-500 hover:text-blue-400">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/50 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 truncate mr-2">Added {new Date(entry.createdAt).toLocaleDateString()}</span>
          {entry.website && (
            <span className="text-[10px] text-blue-500 hover:underline truncate cursor-pointer" onClick={() => copyToClipboard(entry.website)}>
              {entry.website.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

function EntryForm({ 
  onClose, 
  onSubmit, 
  initialData 
}: { 
  onClose: () => void, 
  onSubmit: (data: Omit<PasswordEntry, 'id' | 'createdAt'>) => void,
  initialData?: Omit<PasswordEntry, 'id' | 'createdAt'> 
}) {
  const [formData, setFormData] = useState({
    label: initialData?.label || '',
    category: initialData?.category || '',
    website: initialData?.website || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    notes: initialData?.notes || ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg"
      >
        <Card className="bg-[#11161D] border border-slate-800 shadow-2xl">
          <h2 className="text-xl font-bold mb-6">{initialData ? 'Edit Entry' : 'New Password Entry'}</h2>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Label</label>
                <input required autoFocus value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Category</label>
                <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Work" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Website URL</label>
              <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-blue-200 focus:outline-none focus:border-blue-500 transition-colors" style={{ fontFamily: "'Courier New', monospace" }} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Username / Email</label>
                <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-blue-200 focus:outline-none focus:border-blue-500 transition-colors" style={{ fontFamily: "'Courier New', monospace" }} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-purple-200 focus:outline-none focus:border-blue-500 transition-colors tracking-widest" style={{ fontFamily: "'Courier New', monospace" }} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 uppercase font-bold mb-1">Secure Notes</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-black/20 border border-slate-800/50 rounded-lg text-sm py-2 px-3 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none" style={{ fontFamily: "'Courier New', monospace" }} />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800/50">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
                Save Entry
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
