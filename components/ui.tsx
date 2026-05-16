import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      {text && <p className="text-gray-400 animate-pulse">{text}</p>}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[#11161D] border border-slate-800 p-5 rounded-2xl shadow-xl transition-all ${className}`}>
      {children}
    </div>
  );
}
