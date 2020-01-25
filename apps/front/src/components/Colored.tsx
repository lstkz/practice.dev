import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const Colored = styled.span<{ color: 'red' | 'green' | 'green2' }>`
  color: ${props => {
    switch (props.color) {
      case 'red':
        return Theme.red;
      case 'green':
        return Theme.green;
      case 'green2':
        return Theme.green2;
      default:
        return null;
    }
  }};
`;
