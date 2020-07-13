import styled from 'styled-components';
import { Theme, MOBILE } from 'ui';

interface BoxProps {
  full?: boolean;
}

export const Box = styled.div<BoxProps>`
  width: ${props => (props.full ? '100%' : '420px')};
  padding: 40px 36px;
  background: white;
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  margin: 0 auto;
  & > * {
    margin-top: 0;
  }

  ${MOBILE} {
    width: 100%;
  }
`;
