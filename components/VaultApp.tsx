'use client';

import React, { useState } from 'react';
import { useVault } from '@/context/VaultContext';
import { LoginScreen } from './LoginScreen';
import { Dashboard } from './Dashboard';
import { AnimatePresence, motion } from 'motion/react';

export function VaultApp() {
  const { isLoggedIn } = useVault();

  return (
    <AnimatePresence mode="wait">
      {isLoggedIn ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          <Dashboard />
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <LoginScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
