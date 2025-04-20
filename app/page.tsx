import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

export default async function Page() {
  return (
    <>
      <Navbar />
      <h1>Creativity, Unleashed. </h1>
      <p>
        Leverage generative AI with a unique suite of tools to convey your ideas
        to the world.
      </p>
      <Button variant={'secondary'}>Get started</Button>
    </>
  );
}
