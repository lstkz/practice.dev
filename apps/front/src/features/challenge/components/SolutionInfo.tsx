import * as React from 'react';
import styled from 'styled-components';
import { Solution } from 'shared';
import { Tag } from 'src/components/Tag';
import { Theme } from 'ui';
import { useActions } from 'typeless';
import { SolutionLike } from 'src/components/SolutionLike';
import { Link } from 'src/components/Link';
import { createUrl } from 'src/common/url';
import { GlobalSolutionsActions } from 'src/features/globalSolutions/interface';

interface SolutionInfoProps {
  className?: string;
  solution: Solution;
  full?: boolean;
  onTagClick?(tag: string): void;
}

const Left = styled.div`
  flex: 1 0 auto;
  width: calc(100% - 60px);
`;
const Right = styled.div`
  flex: 0 0 60px;
`;
const Title = styled(Link)`
  color: ${Theme.textDark};
  font-weight: 500;
`;

const By = styled.div`
  color: ${Theme.textLight};
  a {
    font-weight: 500;
  }
`;

const Tags = styled.div`
  margin-top: 12px;
  ${Tag} {
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const Top = styled.div`
  display: flex;
`;

const _SolutionInfo = (props: SolutionInfoProps) => {
  const { className, solution, onTagClick } = props;
  const { voteSolution } = useActions(GlobalSolutionsActions);
  return (
    <div className={className} data-test={`solution-${solution.id}`}>
      <Top>
        <Left>
          <Title
            testId="title"
            href={createUrl({
              name: 'challenge',
              id: solution.challengeId,
              solutionSlug: solution.slug,
            })}
          >
            {solution.title}
          </Title>
          <By>
            By{' '}
            <Link
              href={createUrl({
                name: 'profile',
                username: solution.user.username,
              })}
              data-test="author"
            >
              @{solution.user.username}
            </Link>
          </By>
        </Left>
        <Right>
          <SolutionLike solution={solution} voteSolution={voteSolution} />
        </Right>
      </Top>
      <Tags>
        {solution.tags.map(tag => (
          <Tag
            testId="tag"
            key={tag}
            type="difficulty"
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
          >
            {tag}
          </Tag>
        ))}
      </Tags>
    </div>
  );
};

export const SolutionInfo = styled(_SolutionInfo)`
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${Theme.bgLightGray2};
`;
