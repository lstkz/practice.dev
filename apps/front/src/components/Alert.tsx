import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const Alert = styled.div<{ type: 'error' }>`
  padding: 10px 12px;
  border-radius: 4px;
  background: ${Theme.red};
  color: white;
  margin-bottom: 20px;
`;
