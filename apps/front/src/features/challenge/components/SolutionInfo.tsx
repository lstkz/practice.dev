import * as React from 'react';
import styled from 'styled-components';
import { Solution } from 'shared';
import { VoidLink } from 'src/components/VoidLink';
import { Tag } from 'src/components/Tag';
import { Theme } from 'ui';
import { useActions } from 'typeless';
import { ChallengeActions } from '../interface';
import { SolutionLike } from 'src/components/SolutionLike';
import { SolutionActions } from 'src/features/solution/interface';
import { Link } from 'src/components/Link';
import { createUrl } from 'src/common/url';

interface SolutionInfoProps {
  className?: string;
  solution: Solution;
}

const Left = styled.div`
  flex: 1 0 auto;
  width: calc(100% - 60px);
`;
const Right = styled.div`
  flex: 0 0 60px;
`;
const Title = styled(Link)`
  color: ${Theme.text};
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
  const { className, solution } = props;
  const { voteSolution } = useActions(ChallengeActions);
  const { show } = useActions(SolutionActions);
  return (
    <div className={className}>
      <Top>
        <Left>
          <Title
            href={createUrl({
              name: 'challenge',
              id: solution.challengeId,
              solutionSlug: solution.slug,
            })}
            onClick={() => show('view', solution)}
          >
            {solution.title}
          </Title>
          <By>
            By <VoidLink>@{solution.user.username}</VoidLink>
          </By>
        </Left>
        <Right>
          <SolutionLike solution={solution} voteSolution={voteSolution} />
        </Right>
      </Top>
      <Tags>
        {solution.tags.map(tag => (
          <Tag key={tag} type="difficulty">
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
