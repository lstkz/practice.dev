import * as React from 'react';
import styled from 'styled-components';
import { Solution } from 'shared';
import ReactTooltip from 'react-tooltip';
import { VoidLink } from 'src/components/VoidLink';
import { Tag } from 'src/components/Tag';
import { Theme } from 'ui';
import { LikeIcon } from 'src/icons/LikeIcon';

interface SolutionInfoProps {
  className?: string;
  solution: Solution;
}

const Left = styled.div`
  flex: 1 0 auto;
  width: calc(100% - 60%);
`;
const Right = styled.div`
  flex: 0 0 60px;
`;
const Title = styled(VoidLink)`
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

const Like = styled(VoidLink)`
  display: inline-flex;
  align-items: center;
  color: ${Theme.pink};
  margin-right: 5px;
  && {
    text-decoration: none;
  }
  &:hover {
    path {
      fill: ${Theme.pink};
    }
  }
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const _SolutionInfo = (props: SolutionInfoProps) => {
  const { className, solution } = props;
  return (
    <div className={className}>
      <Top>
        <Left>
          <Title>{solution.title}</Title>
          <By>
            By <VoidLink>@{solution.user.username}</VoidLink>
          </By>
        </Left>
        <Right>
          <Center>
            <Like data-tip="Like">
              <LikeIcon size="16px" empty />
            </Like>
            {solution.likes}
            <ReactTooltip place="top" type="dark" effect="solid" />
          </Center>
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
