import Image from 'next/image';

export default function NotFound() {
  return (
    <>
      <div className='flex h-screen items-center justify-center gap-10 p-4 lg:p-0'>
        <Image
          src='/404.jpeg'
          alt='404'
          width={700}
          height={700}
          className='rounded-2xl'
        />
      </div>
    </>
  );
}
