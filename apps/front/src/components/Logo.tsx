import * as React from 'react';
import { createUrl } from 'src/common/url';
import { LogoDark } from 'src/icons/LogoDark';
import { Link } from 'typeless-router';
import { LogoLight } from 'src/icons/LogoLight';
import styled from 'styled-components';

interface LogoProps {
  className?: string;
  type: 'dark' | 'light';
}

const _Logo = (props: LogoProps) => {
  const { className, type } = props;
  return (
    <div className={className}>
      <Link href={createUrl({ name: 'home' })} aria-label="logo">
        {type === 'dark' ? <LogoDark /> : <LogoLight />}
      </Link>
    </div>
  );
};

export const Logo = styled(_Logo)`
  a {
    display: flex;
  }
`;
