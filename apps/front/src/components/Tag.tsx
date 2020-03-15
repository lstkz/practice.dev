import * as React from 'react';
import styled, { css } from 'styled-components';
import { ChallengeDomain } from 'shared';
import { Theme } from 'src/common/Theme';
import { VoidLink } from './VoidLink';
import { Link } from './Link';

interface TagProps {
  className?: string;
  type:
    | ChallengeDomain
    | 'difficulty'
    | 'custom'
    | 'pass'
    | 'fail'
    | 'pending'
    | 'solution';
  onClick?: () => void;
  children: React.ReactChild;
  url?: string;
}

const _Tag = (props: TagProps) => {
  const { className, children, onClick, url } = props;
  if (url) {
    return (
      <Link className={className} onClick={onClick} href={url}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <VoidLink className={className} onClick={onClick}>
        {children}
      </VoidLink>
    );
  }
  return <div className={className}>{children}</div>;
};

export const Tag = styled(_Tag)`
  display: inline-flex;
  font-size: 12px;
  padding: 0 13px;
  height: 26px;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  ${props =>
    (props.onClick || props.url) &&
    css`
      &:hover {
        opacity: 0.8;
        text-decoration: none;
      }
    `}

  ${props => {
    switch (props.type) {
      case 'frontend':
        return css`
          color: ${Theme.blueTag};
          border-color: ${Theme.blueTag};
          background: ${Theme.blueTagBg};
        `;
      case 'fullstack':
        return css`
          color: ${Theme.pinkTag};
          border-color: ${Theme.pinkTag};
          background: ${Theme.pinkTagBg};
        `;
      case 'backend':
        return css`
          color: ${Theme.orangeTag};
          border-color: ${Theme.orangeTag};
          background: ${Theme.orangeTagBg};
        `;
      case 'difficulty':
      case 'solution':
        return css`
          color: white;
          border-color: ${Theme.textLight};
          background: ${Theme.textLight};
        `;
      case 'custom':
        return css`
          color: ${Theme.text};
          border-color: ${Theme.text};
          background: ${Theme.bgLightGray6};
        `;
      case 'fail':
        return css`
          color: ${Theme.red2};
          border-color: ${Theme.lightRed};
          background: ${Theme.lightRed};
        `;
      case 'pending':
        return css`
          color: ${Theme.blueTag};
          border-color: ${Theme.blueTagBg};
          background: ${Theme.blueTagBg};
        `;
      case 'pass':
        return css`
          color: ${Theme.green2};
          border-color: ${Theme.lightGreen2};
          background: ${Theme.lightGreen2};
        `;
      default:
        return null;
    }
  }}
`;
