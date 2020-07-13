import * as React from 'react';
import styled, { css } from 'styled-components';
import { VoidLink } from './VoidLink';
import { LogoLight } from 'src/icons/LogoLight';
import { CloseIcon } from 'src/icons/CloseIcon';
import { Theme, Button } from 'ui';
import { isMenuHighlighted } from 'src/common/helper';
import { getRouterState } from 'typeless-router';
import { createUrl } from 'src/common/url';
import { Link } from './Link';
import { ChallengesIcon } from 'src/icons/ChallengesIcon';
import { ContestsIcon } from 'src/icons/ContestsIcon';
import { ProjectsSmallIcon } from 'src/icons/ProjectsSmallIcon';
import { useUser } from 'src/hooks/useUser';
import { Avatar } from './Avatar';
import { useActions } from 'typeless';
import { GlobalActions } from 'src/features/global/interface';

interface MobileSidebarProps {
  className?: string;
  onClose(): void;
}

const Close = styled(VoidLink)`
  position: absolute;
  top: 40px;
  right: 30px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
`;

const Username = styled.div`
  font-size: 30px;
  margin-bottom: 20px;
`;

const ListItem = styled.li<ListItemProps>`
  border-left: 5px solid transparent;
  border-bottom: 1px solid ${Theme.bgSelectedMenu};

  &:first-child {
    border-top: 1px solid ${Theme.bgSelectedMenu};
  }

  svg {
    margin-right: 20px;
  }

  a,
  a:hover {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: ${Theme.grayLight};
    path {
      fill: ${Theme.grayLight};
    }
    padding: 15px 30px;
    text-decoration: none;
  }

  ${props =>
    props.active &&
    css`
      border-left-color: ${Theme.green};
      background: ${Theme.bgSelectedMenu};
      color: white;
      path {
        fill: white;
      }
    `}
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  margin-top: 40px;
`;

const Bottom = styled.div`
  font-size: 20px;
  margin-top: 40px;
  text-align: center;
  color: ${Theme.grayLight};
`;

const Logout = styled(VoidLink)`
  text-align: center;
  color: ${Theme.red};
  margin-top: 20px;
  font-size: 20px;
  display: block;
`;

interface ListItemProps {
  active?: boolean;
}

const _MobileSidebar = (props: MobileSidebarProps) => {
  const { className, onClose } = props;
  const pathname = getRouterState().location!.pathname;
  const user = useUser();
  const { logout } = useActions(GlobalActions);

  return (
    <div className={className} data-test="mobile-sidebar">
      <LogoLight />
      <Close onClick={onClose} data-test="close">
        <CloseIcon scale={2} />
      </Close>

      <UserDetails>
        {user ? (
          <>
            <Avatar size="large" border avatarUrl={user.avatarUrl} />
            <Username data-test="username">{user.username}</Username>
          </>
        ) : (
          <>
            <Username data-test="username">Hello Visitor!</Username>
            <Button
              testId="register"
              type="primary"
              onClick={onClose}
              href={createUrl({ name: 'register' })}
            >
              JOIN NOW
            </Button>
          </>
        )}
      </UserDetails>

      <List>
        <ListItem active={isMenuHighlighted(pathname, 'challenges')}>
          <Link onClick={onClose} href={createUrl({ name: 'challenges' })}>
            <ChallengesIcon /> Challenges
          </Link>
        </ListItem>
        <ListItem active={isMenuHighlighted(pathname, 'projects')}>
          <Link onClick={onClose} href={createUrl({ name: 'projects' })}>
            <ProjectsSmallIcon /> Projects
          </Link>
        </ListItem>
        <ListItem active={isMenuHighlighted(pathname, 'contents')}>
          <Link onClick={onClose} href={createUrl({ name: 'contests' })}>
            <ContestsIcon /> Contests
          </Link>
        </ListItem>
      </List>
      {user ? (
        <Logout
          data-test="logout"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Logout
        </Logout>
      ) : (
        <Bottom>
          Have an account?{' '}
          <Link
            testId="login"
            onClick={onClose}
            href={createUrl({ name: 'login' })}
          >
            Login
          </Link>
        </Bottom>
      )}
    </div>
  );
};

export const MobileSidebar = styled(_MobileSidebar)`
  display: block;
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 2;
  background: ${Theme.text};
  padding: 30px;
  color: white;
`;
