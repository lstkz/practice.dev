import * as React from 'react';
import styled from 'styled-components';
import { SidebarTitle } from './SidebarTitle';
import { getChallengeState, ChallengeActions } from '../interface';
import { SolutionInfo } from './SolutionInfo';
import { useSolutions } from 'src/features/globalSolutions/useSolutions';
import { useActions } from 'typeless';

interface FavoriteSolutionsProps {
  className?: string;
}

const NoData = styled.div`
  text-align: center;
`;

const _FavoriteSolutions = (props: FavoriteSolutionsProps) => {
  const { className } = props;
  const { favoriteSolutions } = getChallengeState.useState();
  const solutions = useSolutions(favoriteSolutions);
  const { showSolutionsWithTag } = useActions(ChallengeActions);
  return (
    <div className={className} data-test="fav-solutions">
      <SidebarTitle marginBottom>Favorite Solutions</SidebarTitle>
      {solutions.length ? (
        solutions.map(item => (
          <SolutionInfo
            solution={item}
            key={item.id}
            onTagClick={tag => showSolutionsWithTag(tag)}
          />
        ))
      ) : (
        <NoData data-test="no-solutions">No solutions yet.</NoData>
      )}
    </div>
  );
};

export const FavoriteSolutions = styled(_FavoriteSolutions)`
  display: block;
`;
