'use client';

import { VaultProvider } from '@/context/VaultContext';
import { VaultApp } from '@/components/VaultApp';

export default function Home() {
  return (
    <VaultProvider>
      <VaultApp />
    </VaultProvider>
  );
}
