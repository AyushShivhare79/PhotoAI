'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Button from '../Button';

export default function Home() {
  const session = useSession();

  return (
    <div>
      <Button
        onClick={() => {
          return session.status === 'authenticated'
            ? signOut({ redirect: true, callbackUrl: '/' })
            : signIn('google', { callbackUrl: '/create' });
        }}
      >
        {session.status === 'authenticated' ? <p>Signout</p> : <p>Signin</p>}
      </Button>
    </div>
  );
}
