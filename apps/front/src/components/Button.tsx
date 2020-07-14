import * as React from 'react';
import styled, { css } from 'styled-components';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { Theme } from '../Theme';
import { Spinner } from './Spinner';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  block?: boolean;
  loading?: boolean;
  type: 'primary' | 'secondary' | 'danger';
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement, MouseEvent>
  ) => void;
  'data-dropdown-toggle'?: boolean;
  testId?: string;
}

const Icon = styled.span`
  margin-right: 10px;
  display: inline-flex;
  align-items: center;
  svg {
    vertical-align: middle;
    border-style: none;
  }
`;

const _Button = (props: ButtonProps, ref: any) => {
  const {
    className,
    href,
    onClick,
    children,
    icon,
    htmlType,
    loading,
    disabled,
    testId,
  } = props;
  const { push } = href ? useActions(RouterActions) : { push: null! };
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
        data-test={testId}
        data-dropdown-toggle={props['data-dropdown-toggle']}
        className={className + (disabled ? ' disabled' : '')}
        href={href}
        ref={ref}
        onClick={e => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          if (onClick) {
            onClick(e);
            if (e.isDefaultPrevented()) {
              return;
            }
          }
          e.preventDefault();
          if (href) {
            const [pathname, search] = href.split('?');
            push({
              pathname,
              search,
            });
          }
        }}
      >
        {inner}
      </a>
    );
  } else {
    return (
      <button
        data-test={testId}
        data-dropdown-toggle={props['data-dropdown-toggle']}
        disabled={loading || disabled}
        onClick={onClick as any}
        className={className}
        type={htmlType || 'button'}
        ref={ref}
      >
        {inner}
      </button>
    );
  }
};

export const Button = styled(React.forwardRef(_Button))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  height: 40px;
  user-select: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: center;
  vertical-align: middle;
  color: #8492a6;
  border: 1px solid transparent;
  border-radius: 5px;
  background-color: transparent;
  position: relative;
  white-space: nowrap;
  // transition: all 0.2s ease;
  width: ${props => (props.block ? '100%' : null)};
  font: inherit;
  outline: none;
  && {
    text-decoration: none;
  }

  ${Spinner} {
    margin-right: 10px;
  }

  &:not(:disabled),
  &:not(.disabled) {
    cursor: pointer;
  }

  &.disabled,
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &[data-dropdown-toggle] {
    &::after {
      font-family: 'Font Awesome 5 Free';
      font-weight: 700;
      font-style: normal;
      font-variant: normal;
      display: inline-block;
      margin-left: 10.2px;
      content: '\f107';
      text-rendering: auto;
      -webkit-font-smoothing: antialiased;
    }
  }

  ${props => {
    switch (props.type) {
      case 'primary':
        return css`
          color: #fff;
          background: ${Theme.primaryGradient};
          &:hover {
            background: ${Theme.primaryGradientHover};
          }
          &:focus {
            background: ${Theme.primaryGradientActive};
            box-shadow: 0 0 0 3px rgb(35, 122, 210, 0.5);
          }
          &.disabled,
          &:disabled {
            background: ${Theme.primaryGradient};
            box-shadow: none;
          }
        `;
      case 'secondary':
        return css`
          color: ${Theme.textDark};
          background: white;
          border-color: ${Theme.border};
          &:hover {
            background: ${Theme.bgLightGray2};
          }
          &:focus {
            background: ${Theme.bgLightGray3};
            box-shadow: 0 0 0 3px rgba(216, 217, 219, 0.5);
          }
        `;
      case 'danger':
        return css`
          color: white;
          background: ${Theme.dangerGradient};
          &:hover {
            background: ${Theme.dangerGradientHover};
          }
          &:focus {
            background: ${Theme.dangerGradientActive};
            box-shadow: 0 0 0 3px rgb(210, 35, 35, 0.5);
          }
          &.disabled,
          &:disabled {
            background: ${Theme.dangerGradient};
            box-shadow: none;
          }
        `;
    }
    return null;
  }}
`;
