const Button = ({ btnName }: { btnName: string }) => {
  return (
    <button className='group relative border border-black bg-transparent px-8 py-2 text-black transition duration-200 dark:border-white'>
      <div className='absolute -right-2 -bottom-2 -z-10 h-full w-full bg-yellow-300 transition-all duration-200 group-hover:right-0 group-hover:bottom-0' />
      <span className='relative'>{btnName}</span>
    </button>
  );
};

export default Button;
