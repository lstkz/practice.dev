import styled from 'styled-components';

export const SidebarStack = styled.div`
  & > * + * {
    margin-top: 30px;
  }
`;
