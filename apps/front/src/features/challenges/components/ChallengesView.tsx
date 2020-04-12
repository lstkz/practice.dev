import React from 'react';
import { useChallengesModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import styled from 'styled-components';
import { ChallengeInfo } from './ChallengeInfo';
import { getChallengesState } from '../interface';
import { Container } from 'src/components/Container';
import { ConfirmEmailWarning } from 'src/components/ConfirmEmailWarning';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { createUrl } from 'src/common/url';
import { ChallengesIcon } from 'src/icons/ChallengesIcon';
import { ChallengeFilter } from './ChallengeFilter';
import { Theme } from 'src/common/Theme';
import { ChallengePlaceholder } from './ChallengePlaceholder';

const ChallengesCol = styled.div`
  flex-grow: 1;
`;

const FilterCol = styled.div`
  display: flex;
  width: 220px;
  flex-grow: 0;
  flex-shrink: 0;
`;

const SepCol = styled.div`
  width: 1px;
  background: ${Theme.bgLightGray6};
  margin-left: 40px;
  margin-right: 30px;
  flex-shrink: 0;
`;

const Wrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export function ChallengesView() {
  useChallengesModule();
  const { items, isLoading } = getChallengesState.useState();

  return (
    <Dashboard>
      <ConfirmEmailWarning />
      <Container data-test="challenges-page">
        <Breadcrumb
          icon={<ChallengesIcon />}
          url={createUrl({ name: 'challenges' })}
          root="Challenges"
        />
        <Wrapper>
          <ChallengesCol>
            {isLoading ? (
              <>
                <ChallengePlaceholder />
                <ChallengePlaceholder />
                <ChallengePlaceholder />
              </>
            ) : items.length === 0 ? (
              <NoData>No Challenges</NoData>
            ) : (
              items.map(item => (
                <ChallengeInfo key={item.id} challenge={item} />
              ))
            )}
          </ChallengesCol>
          <SepCol />
          <FilterCol>
            <ChallengeFilter />
          </FilterCol>
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
