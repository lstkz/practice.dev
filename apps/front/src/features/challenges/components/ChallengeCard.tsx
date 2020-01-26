import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const ChallengeCard = styled.div<{ block?: boolean }>`
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid ${Theme.grayLight};
  border-radius: 5px;
  display: ${props => (props.block ? 'block' : 'flex')};
  margin-bottom: 20px;
  padding: 20px 20px 25px 25px;
  position: relative;
`;
