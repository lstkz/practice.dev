import * as React from 'react';
import styled, { css } from 'styled-components';
import { ChallengeDomain } from 'shared';
import { Theme } from 'src/common/Theme';
import { VoidLink } from './VoidLink';

interface TagProps {
  className?: string;
  type: ChallengeDomain | 'difficulty' | 'custom';
  onClick?: () => void;
  children: React.ReactChild;
}

const _Tag = (props: TagProps) => {
  const { className, children, onClick } = props;
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
    props.onClick &&
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
        return css`
          color: white;
          border-color: ${Theme.text};
          background: ${Theme.text};
        `;
      case 'custom':
        return css`
          color: ${Theme.text};
          border-color: ${Theme.text};
          background: ${Theme.bgLightGray6};
        `;
      default:
        return null;
    }
  }}
`;
