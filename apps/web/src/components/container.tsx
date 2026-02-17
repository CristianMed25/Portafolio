type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className = '' }: ContainerProps) => {
  return <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</div>;
};
