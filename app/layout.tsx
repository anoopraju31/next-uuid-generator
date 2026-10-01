import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';
import { Toaster } from 'sonner';

import Footer from '@/components/Footer';

import './globals.css';

export const metadata: Metadata = {
  title: 'UUID Generator — Fast, Secure Online UUID v4 & v7 Tool',
  description:
    'Free online Universal Unique Identifier (UUID) generator. Generate cryptographically secure v4 (random) and modern v7 (time-ordered) UUIDs individually or in bulk with formatting, validation, and inspection.',
  keywords: ['UUID generator', 'UUID v4', 'UUID v7', 'GUID generator', 'online UUID', 'bulk UUID generator'],
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col justify-between bg-[#080a10] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors theme="dark" closeButton />
      </body>
    </html>
  );
};

export default RootLayout;
