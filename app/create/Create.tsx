'use client';

import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { poppins } from '@/lib/font';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Top from './Top';
import { promptSchema } from '../types/schema';
import { getImages } from '@/app/actions/image';

interface ImageProp {
  id: string;
  url: string;
}

const play = () => {
  const audio = new Audio('/audio/generate.mp3');
  audio.volume = 0.1;

  audio.play();
};

export default function Create() {
  const [image, setImage] = useState<ImageProp[]>([]);
  const [credits, setCredits] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      // const response = await axios.get('/api/getImages');
      const response = await getImages();
      console.log('Fetched images:', response);
      setImage(response?.generatedImage || []);
      setCredits(response?.credits || 0);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof promptSchema>>({
    defaultValues: {
      prompt: '',
    },
    resolver: zodResolver(promptSchema),
  });

  async function onSubmit(data: z.infer<typeof promptSchema>) {
    try {
      setGenerateLoading(true);
      const response = await axios.post('/api/generate', {
        prompt: data.prompt,
      });

      if (response.data.success) {
        form.reset();

        fetchData();
        play();
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred while generating the image.');
    } finally {
      setGenerateLoading(false);
    }
  }

  const formRender = () => {
    return (
      <div className='flex items-end justify-center gap-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
            <FormField
              control={form.control}
              name='prompt'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex flex-col items-end justify-center gap-2 lg:flex-row'>
                    <FormControl>
                      <Textarea
                        disabled={generateLoading}
                        className={`resize-none rounded-none ${poppins.className}`}
                        placeholder='Describe what you want to see!'
                        {...field}
                      />
                    </FormControl>

                    <div className='w-full space-y-2 pb-2 lg:w-auto'>
                      <button
                        disabled={generateLoading}
                        type='submit'
                        className={`h-10 w-full cursor-pointer border border-white bg-[#c0c0c0] text-xl text-black hover:font-semibold lg:w-40`}
                      >
                        {generateLoading ? 'Generating...' : 'Generate'}
                      </button>
                    </div>
                  </div>
                  <FormDescription>
                    Be detailed and specific about the subject, style, lighting,
                    and composition for better results.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    );
  };

  return (
    <>
      <div className='space-y-10 overflow-hidden p-4 lg:px-60'>
        <Top credits={credits} />

        <div className='space-y-4'>
          <div>{formRender()}</div>

          <section>
            <h1 className='text-3xl'>Images</h1>
            <div className='flex items-center justify-center lg:justify-start'>
              {fetchLoading ? (
                <div className='grid w-[85%] grid-cols-1 gap-5 p-4 lg:grid-cols-3'>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className='h-[220px] w-[220px] animate-pulse rounded-xl lg:h-[380px] lg:w-[380px]'
                    />
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center lg:justify-start'>
                  {image.length ? (
                    <div className='grid w-[85%] grid-cols-1 gap-5 p-4 lg:grid-cols-3'>
                      {image.map((img) => (
                        <a key={img.id} href={`${img.url}`} download>
                          <Image
                            key={img.id}
                            src={img.url}
                            width={500}
                            height={500}
                            className='rounded-xl'
                            alt='Image'
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center text-xl'>
                      No images generated
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
