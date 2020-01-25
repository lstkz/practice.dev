import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

interface HeaderProps {
  className?: string;
}

const Brand = styled.div``;

const _Header = (props: HeaderProps) => {
  const { className } = props;
  return <div className={className}> </div>;
};

export const Header = styled(_Header)`
  display: block;
  height: 70px;
  background: ${Theme.textDark};
`;
