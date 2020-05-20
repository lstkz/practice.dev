import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalStyle, Theme } from 'ui';
import styled from 'styled-components';

const MOUNT_NODE = document.getElementById('root')!;

const Outer = styled.div`
  padding: 30px;
  width: 100%;
`;

const Wrapper = styled.div`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 40px 50px;
  position: relative;
  margin: 0 auto;
  max-width: 810px;
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
