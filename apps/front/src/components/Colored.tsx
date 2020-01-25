import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const Colored = styled.span<{ color: 'red' | 'green' }>`
  color: ${props => {
    switch (props.color) {
      case 'red':
        return Theme.red;
      case 'green':
        return Theme.green;
      default:
        return null;
    }
  }};
`;
