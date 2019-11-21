import * as React from 'react';
import styled, { css } from 'styled-components';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { Theme } from '../common/Theme';
import { Spinner } from './Spinner';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  color?: 'default' | 'warning';
  size?: 'small' | 'default' | 'large' | 'extra-large';
  soft?: boolean;
  outline?: boolean;
  block?: boolean;
  loading?: boolean;
  type:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'link'
    | 'neutral';
  hoverTranslateY?: boolean;
  href?: string;
  icon?: React.ReactNode;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void;
}

const Icon = styled.span`
  margin-right: 12px;
  svg {
    vertical-align: middle;
    border-style: none;
  }
`;

const _Button = (props: ButtonProps) => {
  const { className, href, onClick, children, icon, htmlType, loading } = props;
  const { push } = useActions(RouterActions);
  const inner = (
    <>
      {loading && <Spinner />}
      {icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </>
  );
  if (href) {
    return (
      <a
        className={className}
        href={href}
        onClick={e => {
          e.preventDefault();
          if (href) {
            const [pathname, search] = href.split('?');
            push({
              pathname,
              search,
            });
          }
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {inner}
      </a>
    );
  } else {
    return (
      <button
        disabled={loading}
        onClick={onClick as any}
        className={className}
        type={htmlType || 'button'}
      >
        {inner}
      </button>
    );
  }
};

export const Button = styled(_Button)`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.75rem;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: center;
  vertical-align: middle;
  color: #8492a6;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background-color: transparent;
  position: relative;
  transition: all 0.2s ease;
  width: ${props => (props.block ? '100%' : null)};
  outline: none;

  ${Spinner} {
    margin-right: 10px;
  }

  &:hover {
    transform: ${props => props.hoverTranslateY && 'translateY(-3px)'};
  }

  &:disabled {
    opacity: 0.65;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  ${props => {
    switch (props.size || 'default') {
      case 'small':
        return css`
          font-size: 0.875rem;
          line-height: 1.5;
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
        `;
      case 'large':
        return css`
          font-size: 1rem;
          line-height: 1.5;
          padding: 1rem 1.875rem;
          border-radius: 0.5rem;
        `;
    }
    return null;
  }}
  ${props => {
    switch (props.type) {
      case 'primary':
        return css`
          color: #fff;
          border-color: ${Theme.bgPrimary};
          background-color: ${Theme.bgPrimary};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: #fff;
            border-color: ${Theme.bgPrimaryDark};
            background-color: #0055e5;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(12, 102, 255, 0.35);
          }
          &:disabled {
            color: #fff;
            border-color: ${Theme.bgPrimary};
            background-color: ${Theme.bgPrimary};
          }
        `;
      case 'secondary':
        return css`
          color: ${Theme.bgDark};
          border-color: ${Theme.bgSecondary};
          background-color: ${Theme.bgSecondary};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: ${Theme.bgDark};
            border-color: ${Theme.bgSecondaryDark};
            background-color: #d6ddea;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(239, 242, 247, 0.35);
          }
          &:disabled {
            color: ${Theme.bgDark};
            border-color: ${Theme.bgSecondary};
            background-color: ${Theme.bgSecondary};
          }
        `;
      case 'success':
        return css`
          color: #fff;
          border-color: ${Theme.bgSuccess};
          background-color: ${Theme.bgSuccess};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: #fff;
            border-color: ${Theme.bgSuccessDark};
            background-color: #26ab76;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(45, 202, 140, 0.35);
          }
          &:disabled {
            color: #fff;
            border-color: ${Theme.bgSuccess};
            background-color: ${Theme.bgSuccess};
          }
        `;
      case 'danger':
        return css`
          color: #fff;
          border-color: ${Theme.bgDanger};
          background-color: ${Theme.bgDanger};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: #fff;
            border-color: ${Theme.bgDangerDark};
            background-color: #ff3655;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(255, 92, 117, 0.35);
          }
          &:disabled {
            color: #fff;
            border-color: ${Theme.bgDanger};
            background-color: ${Theme.bgDanger};
          }
        `;
      case 'warning':
        return css`
          color: ${Theme.bgDark};
          border-color: ${Theme.bgWarning};
          background-color: ${Theme.bgWarning};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: ${Theme.bgDark};
            border-color: ${Theme.bgWarningDark};
            background-color: #ffb117;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(255, 190, 61, 0.35);
          }
          &:disabled {
            color: ${Theme.bgDark};
            border-color: ${Theme.bgWarning};
            background-color: ${Theme.bgWarning};
          }
        `;
      case 'info':
        return css`
          color: #fff;
          border-color: ${Theme.bgInfo};
          background-color: ${Theme.bgInfo};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: #fff;
            border-color: ${Theme.bgInfoDark};
            background-color: #2aa5ff;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(80, 181, 255, 0.35);
          }
          &:disabled {
            color: #fff;
            border-color: ${Theme.bgInfo};
            background-color: ${Theme.bgInfo};
          }
        `;
      case 'dark':
        return css`
          color: #fff;
          border-color: ${Theme.bgDark};
          background-color: ${Theme.bgDark};
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
          &:hover {
            color: #fff;
            border-color: ${Theme.bgDarkDark};
            background-color: #19212c;
          }
          &:focus {
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15),
              0 0 0 rgba(39, 52, 68, 0.35);
          }
          &:disabled {
            color: #fff;
            border-color: ${Theme.bgDark};
            background-color: ${Theme.bgDark};
          }
        `;
      case 'link':
        return css`
          font-weight: 400;
          text-decoration: none;
          color: ${Theme.bgPrimary};
          &:hover {
            text-decoration: none;
            color: #0047bf;
          }
          &:focus {
            text-decoration: none;
            box-shadow: none;
          }
          &:disabled {
            pointer-events: none;
            color: #c0ccda;
          }
        `;
      case 'neutral':
        return css`
          font-weight: 400;
          text-decoration: none;
          color: ${Theme.bgDark};
          border: 1px solid ${Theme.bgSecondary};
          &:hover {
            border-color: #e5eaf2;
            background-color: #f7f7f7;
          }
          &:focus {
            border-color: #dfdfdf;
            background-color: #e6e6e6;
          }
          &:disabled {
            pointer-events: none;
            color: #c0ccda;
          }
        `;
    }
    return null;
  }}
`;
