import { css, cx } from 'emotion';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rounded?: 'default' | 'lg';
  shadow?: 'default' | 'lg';
}

const shadowMap = {
  default: 'rgba(18, 38, 63, 0.03) 0px 0.75rem 1.5rem',
  lg: 'rgba(31, 45, 61, 0.125) 0px 1rem 3rem;',
};

export function Card(props: CardProps) {
  const { className, children, shadow = 'default' } = props;
  return (
    <div
      className={cx(
        css`
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0px;
          overflow-wrap: break-word;
          background-color: rgb(255, 255, 255);
          background-clip: border-box;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(239, 242, 247);
          border-image: initial;
          border-radius: 1rem;
          margin-bottom: 30px;
          box-shadow: ${shadowMap[shadow]};
          border-radius: ${shadowMap[shadow]};
          transition: all 0.2s ease 0s;
        `,
        className
      )}
    >
      {children}
    </div>
  );
}
