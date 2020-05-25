import * as React from 'react';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  testId?: string;
  innerRef?: (ref: HTMLAnchorElement | null) => void;
}

export const Link = (props: LinkProps) => {
  const { href, onClick, innerRef, testId, ...rest } = props;
  const { push } = useActions(RouterActions);
  return (
    <a
      {...rest}
      data-test={testId}
      href={href}
      ref={innerRef}
      onClick={e => {
        if (onClick) {
          onClick(e);
          if (e.isDefaultPrevented()) {
            return;
          }
        }
        const isModifiedEvent = !!(
          e.metaKey ||
          e.altKey ||
          e.ctrlKey ||
          e.shiftKey
        );

        if (
          href &&
          e.button === 0 &&
          rest.target !== '_self' &&
          !isModifiedEvent
        ) {
          e.preventDefault();
          const [pathname, search] = href.split('?');
          push({
            pathname,
            search,
          });
        }
      }}
    />
  );
};
