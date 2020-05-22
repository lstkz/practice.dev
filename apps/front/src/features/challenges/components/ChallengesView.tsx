import React from 'react';
import { useChallengesModule } from '../module';
import { Dashboard } from 'src/components/Dashboard';
import styled from 'styled-components';
import { ChallengeInfo } from './ChallengeInfo';
import { getChallengesState } from '../interface';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { createUrl } from 'src/common/url';
import { ChallengesIcon } from 'src/icons/ChallengesIcon';
import { ChallengeFilter } from './ChallengeFilter';
import { Loader } from 'src/components/Loader';
import { FilterLayout } from 'src/components/FilterLayout';

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

export function ChallengesView() {
  useChallengesModule();
  const { items, isLoading } = getChallengesState.useState();

  return (
    <Dashboard>
      <Container data-test="challenges-page">
        <Breadcrumb
          icon={<ChallengesIcon />}
          url={createUrl({ name: 'challenges' })}
          root="Challenges"
        />
        <FilterLayout
          content={
            <>
              {isLoading ? (
                <Loader center />
              ) : items.length === 0 ? (
                <NoData data-test="no-challenges">No Challenges</NoData>
              ) : (
                items.map(item => (
                  <ChallengeInfo key={item.id} challenge={item} />
                ))
              )}
            </>
          }
          filter={<ChallengeFilter />}
        />
      </Container>
    </Dashboard>
  );
}
