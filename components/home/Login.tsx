'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession();

  return (
    <div className='flex h-screen items-center justify-center'>
      <Button
        onClick={() => {
          return session.status === 'authenticated'
            ? signOut()
            : signIn('google', { callbackUrl: '/create' });
        }}
      >
        {session.status === 'authenticated' ? <p>Signout</p> : <p>Signin</p>}
      </Button>
    </div>
  );
}
