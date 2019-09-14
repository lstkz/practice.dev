import React from 'react';
import { css, cx } from 'emotion';

interface RowProps {
  children: React.ReactNode;
  className?: string;
}

export function Row(props: RowProps) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={cx(
        className,
        css`
          display: flex;
          margin-right: -15px;
          margin-left: -15px;
          flex-wrap: wrap;
        `
      )}
    />
  );
}

interface ColProps {
  children: React.ReactNode;
  className?: string;
  lg?: number;
}

export function Col(props: ColProps) {
  const { className, lg = 12, ...rest } = props;
  return (
    <div
      {...rest}
      className={cx(
        className,
        css`
          position: relative;
          width: 100%;
          padding-right: 15px;
          padding-left: 15px;
          max-width: ${lg / 12}%;
          flex: 0 0 ${lg / 12}%;
        `
      )}
    />
  );
}
