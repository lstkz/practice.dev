import styled from 'styled-components';
import { Theme } from 'src/Theme';

export const MenuItem = styled.div<{ red?: boolean }>`
  a {
    color: ${props => (props.red ? Theme.red2 : Theme.text)};
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const MenuSeparator = styled.div`
  mix-blend-mode: multiply;
  border-top: 1px solid ${Theme.bgLightGray5};
  width: 100%;
  height: 0;
`;

export const Dropdown = styled.div`
  background: white;
  box-shadow: 0px 1px 3px #00000017;
  border-radius: 5px;
  padding: 14px 20px;
  min-width: 150px;

  & > * + * {
    margin-top: 10px;
  }
`;
