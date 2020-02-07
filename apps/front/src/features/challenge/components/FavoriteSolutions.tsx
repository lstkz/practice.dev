import * as React from 'react';
import styled from 'styled-components';
import { SidebarTitle } from './SidebarTitle';
import { getChallengeState } from '../interface';
import { SolutionInfo } from './SolutionInfo';

interface FavoriteSolutionsProps {
  className?: string;
}

const NoData = styled.div`
  text-align: center;
`;

const _FavoriteSolutions = (props: FavoriteSolutionsProps) => {
  const { className } = props;
  const { favoriteSolutions } = getChallengeState.useState();
  return (
    <div className={className}>
      <SidebarTitle marginBottom>Favorite Solutions</SidebarTitle>
      {favoriteSolutions.length ? (
        favoriteSolutions.map(item => (
          <SolutionInfo solution={item} key={item.id} />
        ))
      ) : (
        <NoData>No solutions yet.</NoData>
      )}
    </div>
  );
};

export const FavoriteSolutions = styled(_FavoriteSolutions)`
  display: block;
`;
