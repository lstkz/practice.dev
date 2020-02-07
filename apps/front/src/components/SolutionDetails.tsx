import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { VoidLink } from './VoidLink';
import { Solution } from 'shared';
import { SolutionLike } from './SolutionLike';
import { Tag } from './Tag';
import { DotsIcon } from 'src/icons/DotsIcon';
import { MenuDropdown } from './MenuDropdown';
import { Dropdown, MenuItem, MenuSeparator } from './DropdownPopup';

interface SolutionDetailsProps {
  className?: string;
  onMenu: (action: 'edit' | 'delete') => void;
  voteSolution(id: string, like: boolean): any;
  solution: Solution;
}

const Left = styled.div`
  flex: 1 0 auto;
  width: calc(100% - 100px);
`;
const Right = styled.div`
  flex: 0 0 100px;
  padding-right: 20px;
  position: relative;
`;

const Title = styled(VoidLink)`
  color: ${Theme.textDark};
  font-size: 18px;
  font-weight: 500;
`;

const By = styled.div`
  color: ${Theme.textLight};
  a {
    font-weight: 500;
  }
`;

const Url = styled.a`
  color: ${Theme.textLight};
  font-style: italic;
  margin-bottom: 20px;
  display: block;
`;

const Desc = styled.div``;

const Tags = styled.div`
  margin-top: 12px;
  ${Tag} {
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;

const MenuButton = styled(VoidLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  &:hover {
    svg {
      path {
        fill: black;
      }
    }
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
`;

const _SolutionDetails = (props: SolutionDetailsProps) => {
  const { className, solution, voteSolution } = props;
  return (
    <div className={className}>
      <Left>
        <Title>{solution.title}</Title>
        <By>
          By <VoidLink>@{solution.user.username}</VoidLink>
        </By>
        <Url href={solution.url} target="_blank">
          {solution.url}
        </Url>
        <Desc>{solution.description}</Desc>
        <Tags>
          {solution.tags.map(tag => (
            <Tag key={tag} type="difficulty">
              {tag}
            </Tag>
          ))}
        </Tags>
      </Left>
      <Right>
        <SolutionLike solution={solution} voteSolution={voteSolution} />
        <Menu>
          <MenuDropdown
            dropdown={
              <Dropdown style={{ minWidth: 100 }}>
                <MenuItem>
                  <VoidLink>Edit</VoidLink>
                </MenuItem>
                <MenuSeparator />
                <MenuItem red>
                  <VoidLink>Remove</VoidLink>
                </MenuItem>
              </Dropdown>
            }
          >
            <MenuButton>
              <DotsIcon />
            </MenuButton>
          </MenuDropdown>
        </Menu>
      </Right>
    </div>
  );
};

export const SolutionDetails = styled(_SolutionDetails)`
  display: flex;
`;
