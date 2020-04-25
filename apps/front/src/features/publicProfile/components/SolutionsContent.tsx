import * as React from 'react';
import styled from 'styled-components';
import { getPublicProfileState, PublicProfileActions } from '../interface';
import { SolutionLoader } from 'src/components/SolutionLoader';
import { EmptySection } from './EmptySection';
import { VoidLink } from 'src/components/VoidLink';
import { SolutionDetails } from 'src/components/SolutionDetails';
import { useUser } from 'src/hooks/useUser';
import { useActions } from 'typeless';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { SolutionActions } from 'src/features/solution/interface';

interface SolutionsContentProps {
  className?: string;
}

const LoadMore = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const _SolutionsContent = (props: SolutionsContentProps) => {
  const { className } = props;
  const user = useUser();
  const { voteSolution } = useActions(GlobalSolutionsActions);
  const { show } = useActions(SolutionActions);
  const { loadSolutions } = useActions(PublicProfileActions);
  const {
    solutions: { isLoaded, isLoading, items, cursor },
  } = getPublicProfileState.useState();
  if (!isLoaded) {
    return (
      <>
        <SolutionLoader />
        <SolutionLoader />
        <SolutionLoader />
      </>
    );
  }
  if (!items.length) {
    return <EmptySection data-test="no-solutions">No Solutions</EmptySection>;
  }
  return (
    <div className={className}>
      {items.map(solution => (
        <SolutionDetails
          link
          borderBottom
          canEdit={user && solution.user.id === user.id}
          solution={solution}
          key={solution.id}
          onMenu={action => {
            if (action === 'edit') {
              show('edit', solution);
            }
            if (action === 'delete') {
              // remove(solution.id);
            }
          }}
          voteSolution={voteSolution}
        />
      ))}
      {cursor && (
        <LoadMore>
          {isLoading ? (
            <VoidLink>Loading...</VoidLink>
          ) : (
            <VoidLink
              data-test="load-more-btn"
              onClick={() => loadSolutions(true)}
            >
              Load More
            </VoidLink>
          )}
        </LoadMore>
      )}
    </div>
  );
};

export const SolutionsContent = styled(_SolutionsContent)`
  display: block;
`;
