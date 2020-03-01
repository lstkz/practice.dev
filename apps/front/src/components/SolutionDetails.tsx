import * as React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from 'ui';
import { Link } from 'src/components/Link';
import { VoidLink } from './VoidLink';
import { Solution } from 'shared';
import { SolutionLike } from './SolutionLike';
import { Tag } from './Tag';
import { DotsIcon } from 'src/icons/DotsIcon';
import { MenuDropdown } from './MenuDropdown';
import { Dropdown, MenuItem, MenuSeparator } from './DropdownPopup';
import { createUrl } from 'src/common/url';
import * as DateFns from 'date-fns';

interface SolutionDetailsProps {
  className?: string;
  link?: boolean;
  onMenu: (action: 'edit' | 'delete') => void;
  voteSolution(id: string, like: boolean): any;
  solution: Solution;
  canEdit: boolean;
  borderBottom?: boolean;
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

const DateWrapper = styled.div`
  color: ${Theme.textLight};
`;

const _SolutionDetails = (props: SolutionDetailsProps) => {
  const { className, solution, voteSolution, canEdit, onMenu, link } = props;
  return (
    <div className={className}>
      <Left>
        {link ? (
          <Title
            as={Link}
            href={createUrl({
              name: 'challenge',
              id: solution.challengeId,
              solutionSlug: solution.slug,
            })}
          >
            {solution.title}
          </Title>
        ) : (
          <Title>{solution.title}</Title>
        )}
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
        <DateWrapper>
          {DateFns.format(new Date(solution.createdAt), 'dd.MM.yyyy')}
        </DateWrapper>
        {canEdit && (
          <Menu>
            <MenuDropdown
              dropdown={
                <Dropdown style={{ minWidth: 100 }}>
                  <MenuItem>
                    <VoidLink onClick={() => onMenu('edit')}>Edit</VoidLink>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem red>
                    <VoidLink onClick={() => onMenu('delete')}>Remove</VoidLink>
                  </MenuItem>
                </Dropdown>
              }
            >
              <MenuButton>
                <DotsIcon />
              </MenuButton>
            </MenuDropdown>
          </Menu>
        )}
      </Right>
    </div>
  );
};

export const SolutionDetails = styled(_SolutionDetails)`
  display: flex;

  ${props =>
    props.borderBottom &&
    css`
      padding-bottom: 35px;
      border-bottom: 1px solid ${Theme.bgLightGray8};
      margin-top: 35px;
      &:first-child {
        margin-top: 0;
      }
    `}
`;
