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
import { Title } from './Title';

interface SolutionDetailsProps {
  className?: string;
  link?: boolean;
  onMenu: (action: 'edit' | 'delete') => void;
  voteSolution(id: string, like: boolean): any;
  solution: Solution;
  canEdit: boolean;
  borderBottom?: boolean;
  onTagClick?(tag: string): void;
  onShow?(): void;
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

const Desc = styled.div`
  white-space: pre-line;
`;

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
  const {
    className,
    solution,
    voteSolution,
    canEdit,
    onMenu,
    link,
    onTagClick,
    onShow,
  } = props;
  return (
    <div className={className} data-test={`solution-details-${solution.id}`}>
      <Left>
        {link ? (
          <Title
            data-test="title"
            href={createUrl({
              name: 'challenge',
              id: solution.challengeId,
              solutionSlug: solution.slug,
            })}
          >
            {solution.title}
          </Title>
        ) : (
          <Title link onClick={onShow} data-test="title">
            {solution.title}
          </Title>
        )}
        <By>
          By{' '}
          <Link
            href={createUrl({
              name: 'profile',
              username: solution.user.username,
            })}
            testId="author"
          >
            @{solution.user.username}
          </Link>
        </By>
        <Url data-test="url" href={solution.url} target="_blank">
          {solution.url}
        </Url>
        <Desc data-test="desc">{solution.description}</Desc>
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
      </Left>
      <Right>
        <SolutionLike solution={solution} voteSolution={voteSolution} />
        <DateWrapper data-test="date">
          {DateFns.format(new Date(solution.createdAt), 'dd.MM.yyyy')}
        </DateWrapper>
        {canEdit && (
          <Menu>
            <MenuDropdown
              testId="solution-menu-btn"
              dropdown={
                <Dropdown data-test="solution-menu" style={{ minWidth: 100 }}>
                  <MenuItem>
                    <VoidLink
                      data-test="edit-btn"
                      onClick={() => onMenu('edit')}
                    >
                      Edit
                    </VoidLink>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem red>
                    <VoidLink
                      data-test="delete-btn"
                      onClick={() => onMenu('delete')}
                    >
                      Remove
                    </VoidLink>
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
