import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalStyle } from 'ui';
import styled from 'styled-components';

const MOUNT_NODE = document.getElementById('root')!;

const Outer = styled.div`
  padding: 30px;
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
  margin-bottom: 15px;
  padding: 20px;
  position: relative;
  margin: 0 auto;
  max-width: 850px;
`;

export function render(Component: React.SFC) {
  ReactDOM.unmountComponentAtNode(MOUNT_NODE);
  try {
    ReactDOM.render(
      <>
        <GlobalStyle />
        <Outer>
          <Wrapper>
            <Component />
          </Wrapper>
        </Outer>
      </>,
      MOUNT_NODE
    );
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e);
    throw e;
  }
}
