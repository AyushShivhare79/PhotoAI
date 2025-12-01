import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Provider from './provider';
import { pixelifySans } from '@/lib/font';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PhotoAI',
  description: 'Generate images with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${pixelifySans.className} ${geistSans.variable} ${geistMono.variable} bg-black text-white antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
