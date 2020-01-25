import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const Colored = styled.span<{
  color: 'red' | 'green' | 'green2' | 'pink';
}>`
  color: ${props => {
    switch (props.color) {
      case 'red':
        return Theme.red;
      case 'green':
        return Theme.green;
      case 'green2':
        return Theme.green2;
      case 'pink':
        return Theme.pink;
      default:
        return null;
    }
  }};
`;
