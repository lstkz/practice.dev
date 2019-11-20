import * as React from 'react';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  innerRef?: (ref: HTMLAnchorElement | null) => void;
}

export const Link = (props: LinkProps) => {
  const { href, onClick, innerRef, ...rest } = props;
  const { push } = useActions(RouterActions);
  return (
    <a
      {...rest}
      href={href}
      ref={innerRef}
      onClick={e => {
        e.preventDefault();
        if (href) {
          const [pathname, search] = href.split('?');
          push({
            pathname,
            search,
          });
        }
        if (onClick) {
          onClick(e);
        }
      }}
    />
  );
};
