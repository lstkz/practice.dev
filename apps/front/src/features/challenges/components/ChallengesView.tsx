import React from 'react';
import { useChallengesModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import styled from 'styled-components';
import { ChallengeInfo } from './ChallengeInfo';
import { getChallengesState } from '../interface';
import { Container } from 'src/components/Container';

const ChallengesCol = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
`;

const FilterCol = styled.div`
  width: 300px;
  flex-grow: 0;
  flex-shrink: 0;
  padding-left: 15px;
`;

const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

export function ChallengesView() {
  useChallengesModule();
  const { items } = getChallengesState.useState();

  return (
    <Dashboard>
      <Container>
        <Wrapper>
          <ChallengesCol>
            {items.map(item => (
              <ChallengeInfo key={item.id} challenge={item} />
            ))}
          </ChallengesCol>
          <FilterCol></FilterCol>
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
