import { css, cx } from 'emotion';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container(props: ContainerProps) {
  const { className, children } = props;
  return (
    <div
      className={cx(
        css`
          @media (min-width: 992px) {
            max-width: 960px;
          }
          @media (min-width: 768px) {
            max-width: 720px;
          }
          @media (min-width: 576px) {
            max-width: 540px;
          }
          width: 100%;
          margin-right: auto;
          margin-left: auto;
          padding-right: 15px;
          padding-left: 15px;
        `,
        className
      )}
    >
      {children}
    </div>
  );
}
