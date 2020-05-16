import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { getAvatarUrl } from 'src/common/helper';

interface AvatarProps {
  className?: string;
  avatarUrl: string | null | undefined;
}

const _Avatar = (props: AvatarProps) => {
  const { className, avatarUrl } = props;
  return (
    <div className={className}>
      {avatarUrl && <img src={getAvatarUrl(avatarUrl, 'sm')!} />}
    </div>
  );
};

export const Avatar = styled(_Avatar)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${Theme.gray4};
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;
