'use client';

import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import image from '@/public/images/Image.json';
import { poppins } from '@/lib/font';
import Marquee from '@/components/Marquee';
import Image from 'next/image';

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

          <div className='flex gap-2'>
            <Button
              variant={'default'}
              className='cursor-pointer rounded-xl p-7 text-lg hover:font-bold'
              onClick={() => router.push('/create')}
            >
              Get started
            </Button>

            <Button
              className='cursor-pointer rounded-xl p-7 text-lg hover:font-bold'
              onClick={() => router.push('/create')}
              variant={'secondary'}
            >
              Contact us
            </Button>
          </div>

          <div className='flex gap-14 overflow-hidden pt-16'>
            <Marquee>
              {image.map((img) => (
                <div
                  key={img.id}
                  className='group relative overflow-hidden rounded-lg'
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    height={400}
                    width={400}
                    className='object-cover grayscale transition-transform duration-500 ease-in-out group-hover:scale-110 hover:grayscale-0'
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </>
  );
}
