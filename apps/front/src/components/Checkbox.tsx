import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'src/Theme';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  children?: React.ReactNode;
  radio?: boolean;
  testId?: string;
}

const _Checkbox = (props: CheckboxProps) => {
  const { className, testId, children, style, radio, ...rest } = props;
  return (
    <label className={className} style={style} data-test={testId}>
      <input type="checkbox" {...rest} />
      {children}
      <span />
    </label>
  );
};

export const Checkbox = styled(_Checkbox)`
  padding-left: 24px;
  line-height: 19px;
  display: block;
  align-items: center;
  position: relative;
  ${props =>
    !props.children &&
    css`
      height: 18px;
      width: 18px;
      padding: 0;
    `}
  cursor: pointer;
  transition: all 0.3s ease;
  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
  & > span {
    border: 1px solid ${Theme.grayLight};
    border-radius: ${props => (props.radio ? '100%' : '2px')};
    background: white;
    position: absolute;
    top: 3px;
    height: 14px;
    width: 14px;
    left: 0;
    ${props =>
      !props.radio &&
      css`
        &:after {
          content: '';
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          margin-left: -2px;
          margin-top: -6px;
          width: 5px;
          height: 10px;
          border-width: 0 2px 2px 0 !important;
          transform: rotate(45deg);
          border: solid ${Theme.green};
        }
      `}
    ${props =>
      props.radio &&
      css`
        &:after {
          content: '';
          position: absolute;
          display: none;
          top: 50%;
          left: 50%;
          margin-left: -3px;
          margin-top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 100% !important;
          border: solid ${Theme.green};
          background: ${Theme.green};
        }
      `}
  }
  input:checked ~ span:after {
    display: block;
  }
`;
