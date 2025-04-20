const Button = ({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type='submit'
      className={`h-10 w-full cursor-pointer border border-white bg-[#c0c0c0] text-xl text-black hover:font-semibold lg:w-40`}
    >
      {children}
    </button>
  );
};

export default Button;
