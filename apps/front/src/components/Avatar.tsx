import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/Theme';
import { getAvatarUrl } from 'src/common/helper';

interface AvatarProps {
  className?: string;
  avatarUrl: string | null | undefined;
  border?: boolean;
  testId?: string;
  size?: 'default' | 'large';
}

const _Avatar = (props: AvatarProps) => {
  const { className, avatarUrl, testId, size } = props;
  return (
    <div className={className} data-test={testId}>
      {avatarUrl && (
        <img src={getAvatarUrl(avatarUrl, size === 'large' ? 'lg' : 'sm')!} />
      )}
    </div>
  );
};

const sizeMap = {
  default: 40,
  large: 70,
};

export const Avatar = styled(_Avatar)`
  width: ${props => sizeMap[props.size ?? 'default']}px;
  height: ${props => sizeMap[props.size ?? 'default']}px;
  border-radius: 50%;
  background: ${Theme.gray4};
  border: ${props => props.border && `1px solid ${Theme.gray3}`};
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
