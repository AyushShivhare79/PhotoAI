'use client';

import { Analytics } from '@vercel/analytics/next';
import { SessionProvider } from 'next-auth/react';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
      <Analytics />
    </SessionProvider>
  );
};

export default Provider;
