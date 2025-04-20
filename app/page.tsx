'use client';

import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { poppins } from '@/lib/font';
import Image from 'next/image';
import image from '@/public/images/Image.json';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <div className='h-screen'>
        <Navbar />

        <div className='flex h-full flex-col items-center space-y-8 pt-16'>
          <h1 className={`text-7xl ${poppins.className}`}>
            Creativity, Unleashed.{' '}
          </h1>
          <p className='text-2xl'>
            Leverage generative AI with a unique suite of tools to convey your
            ideas to the world.
          </p>

          <div>
            <Button
              className='rounded-full'
              onClick={() => router.push('/create')}
              variant={'secondary'}
            >
              Get started
            </Button>
          </div>

          <div className='grid grid-cols-3 gap-4'>
            {image.map((img) => (
              <div key={img.id} className='relative'>
                <Image src={img.src} alt={img.alt} width={380} height={380} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
