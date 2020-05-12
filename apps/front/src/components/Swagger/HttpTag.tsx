import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'ui';

interface HttpTagProps {
  className?: string;
  type: 'get' | 'post' | 'put' | 'delete';
}

const _HttpTag = (props: HttpTagProps) => {
  const { className, type } = props;
  return <div className={className}>{type.toUpperCase()}</div>;
};

export const HttpTag = styled(_HttpTag)`
  display: inline-flex;
  font-size: 12px;
  padding: 0 13px;
  height: 26px;
  align-items: center;
  border-radius: 3px;
  color: white;

  ${props => {
    switch (props.type) {
      case 'get':
        return css`
          background: ${Theme.httpGetDark};
        `;
      case 'post':
        return css`
          background: ${Theme.httpPostDark};
        `;
      case 'put':
        return css`
          background: ${Theme.httpPutDark};
        `;
      case 'delete':
        return css`
          background: ${Theme.httpDeleteDark};
        `;
    }
  }}
`;
