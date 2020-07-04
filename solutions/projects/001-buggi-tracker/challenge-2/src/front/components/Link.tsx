import React from 'react';
import { useRouter } from '../contexts/RouterContext';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function Link(props: LinkProps) {
  const { push } = useRouter();
  return (
    <a
      {...props}
      onClick={e => {
        e.preventDefault();
        push(props.href);
      }}
    />
  );
}
