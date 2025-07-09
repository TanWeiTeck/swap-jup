import type { Metadata } from 'next';
import { Toaster } from '@repo/ui/components';
import { Geist } from 'next/font/google';
import Providers from './_providers';
import './globals.css';
import { Suspense } from 'react';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swap',
  description: 'Swap',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-background`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            {children}
            <Toaster position="top-center" richColors />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
