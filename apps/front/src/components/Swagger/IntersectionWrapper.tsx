import React from 'react';

interface IntersectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id: string;
}

export function IntersectionWrapper(props: IntersectionWrapperProps) {
  const { children, className, id } = props;
  return (
    <div className={className} id={id}>
      {children}
    </div>
  );
}
