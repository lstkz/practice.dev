import React from 'react';
import { Theme } from 'src/Theme';

interface WarningIconProps {
  color?: string;
  scale?: number;
}

export function WarningIcon(props: WarningIconProps) {
  const { color, scale = 1 } = props;
  return (
    <svg width={20 * scale} height={20 * scale} viewBox="0 0 20 20">
      <path
        d="M10 0a10 10 0 1010 10A9.987 9.987 0 0010 0zm0 16.667a1.333 1.333 0 111.333-1.333A1.337 1.337 0 0110 16.667zM11.333 10a1.333 1.333 0 11-2.667 0V4.667a1.333 1.333 0 012.667 0z"
        fill={color || Theme.orangeTag}
      />
    </svg>
  );
}
