import styled from 'styled-components';
import React from 'react';
import { useSolutions } from 'src/features/globalSolutions/useSolutions';
import { SolutionDetails } from './SolutionDetails';
import { SolutionActions } from 'src/features/solution/interface';
import { useActions } from 'typeless';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';
import { useUser } from 'src/hooks/useUser';
import { Loader } from './Loader';
import { LoadMoreButton } from './LoadMoreButton';

const NoData = styled.div`
  text-align: center;
  margin-top: 40px;
`;

interface SolutionListProp {
  isLoaded: boolean;
  cursor: string | null;
  items: string[];
  isLoading: boolean;
  load(loadMore: boolean): void;
  remove(id: string): void;
  onTagClick?(tag: string): void;
  emptyText?: string;
  noAutoLoad?: boolean;
  noLink?: boolean;
}

export function SolutionList(props: SolutionListProp) {
  const {
    isLoaded,
    cursor,
    items,
    isLoading,
    load,
    remove,
    onTagClick,
    emptyText,
    noAutoLoad,
    noLink,
  } = props;
  const user = useUser();
  const { show } = useActions(SolutionActions);
  const solutions = useSolutions(items);
  const { voteSolution } = useActions(GlobalSolutionsActions);
  React.useEffect(() => {
    if (!isLoaded && !noAutoLoad) {
      load(false);
    }
  }, [isLoaded, noAutoLoad]);
  if (!isLoaded) {
    return (
      <>
        <Loader center />
      </>
    );
  }
  if (!items.length) {
    return (
      <NoData data-test="no-solutions">{emptyText || 'No Solutions'}</NoData>
    );
  }
  return (
    <div>
      {solutions.map(solution => (
        <SolutionDetails
          link={!noLink}
          borderBottom
          canEdit={user && solution.user.id === user.id}
          solution={solution}
          key={solution.id}
          onMenu={action => {
            if (action === 'edit') {
              show('edit', solution);
            }
            if (action === 'delete') {
              remove(solution.id);
            }
          }}
          voteSolution={voteSolution}
          onTagClick={onTagClick}
          onShow={noLink ? () => show('view', solution) : undefined}
        />
      ))}
      {cursor && (
        <LoadMoreButton isLoading={isLoading} onClick={() => load(true)} />
      )}
    </div>
  );
}
