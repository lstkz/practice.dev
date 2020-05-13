import * as React from 'react';
import styled from 'styled-components';

export interface VoidLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const _VoidLink = (props: VoidLinkProps, ref: any) => {
  const { onClick, ...rest } = props;
  return (
    <a
      role="button"
      href="#"
      onClick={ev => {
        ev.preventDefault();
        if (onClick) {
          onClick(ev);
        }
        return false;
      }}
      ref={ref}
      {...rest}
    />
  );
};

export const VoidLink = styled(React.forwardRef(_VoidLink))`
  user-drag: none;
`;
