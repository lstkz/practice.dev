import React from 'react';

interface CloseIconProps {
  scale?: number;
  color?: string;
}

export function CloseIcon(props: CloseIconProps) {
  const { scale = 1, color = 'white' } = props;
  return (
    <svg viewBox="0 0 11 11" width={11 * scale} height={11 * scale}>
      <line
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        x1="0.354"
        y1="0.354"
        x2="10.357"
        y2="10.354"
      />
      <line
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        x1="0.354"
        y1="10.354"
        x2="10.357"
        y2="0.354"
      />
    </svg>
  );
}
