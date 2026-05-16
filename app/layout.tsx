import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Private Password Vault',
  description: 'AES-256 Encrypted Password Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans bg-[#05070A] text-slate-200 antialiased min-h-screen selection:bg-purple-500/30" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
