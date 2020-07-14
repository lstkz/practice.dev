import styled from 'styled-components';
import { Theme } from 'src/Theme';
import React from 'react';
import { VoidLink } from './VoidLink';
import { Link } from './Link';

export type SizeUnit = 'sm' | 'md' | 'lg';

function _getSizeUnit(unit: SizeUnit | undefined) {
  switch (unit) {
    case 'lg':
      return '40px';
    case 'md':
      return '20px';
    case 'sm':
      return '10px';
    default:
      return null;
  }
}

interface TitleProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  center?: boolean;
  mb?: SizeUnit;
  mt?: SizeUnit;
  link?: boolean;
  href?: string;
  testId?: string;
}

const _Title = (props: TitleProps) => {
  const { center, mb, href, link, testId, mt, ...rest } = props;
  if (link && !href) {
    return <VoidLink testId={testId} {...(rest as any)} />;
  }
  if (href) {
    return <Link testId={testId} href={href} {...(rest as any)} />;
  }
  return <div data-test={testId} {...rest} />;
};

export const Title = styled(_Title)`
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: ${Theme.textDark};
  text-align: ${props => (props.center ? 'center' : null)};
  margin-bottom: ${props => _getSizeUnit(props.mb)};
  margin-top: ${props => _getSizeUnit(props.mt)};
`;
