import { motion } from 'framer-motion';

export default function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <>
      {Array(2)
        .fill(true)
        .map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: 56 }}
            animate={{ x: '-100%' }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className='flex flex-shrink-0 gap-14 text-6xl'
          >
            {children}
          </motion.div>
        ))}
    </>
  );
}
