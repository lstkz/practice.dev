import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/common/Theme';
import { Logo } from './Logo';
import { Container } from './Container';
import { Link } from './Link';
import { createUrl } from 'src/common/url';
import { MenuDropdown } from './MenuDropdown';
import { Dropdown, MenuItem, MenuSeparator } from './DropdownPopup';
import { VoidLink } from './VoidLink';
import { useActions } from 'typeless';
import { GlobalActions } from 'src/features/global/interface';
import { useUser } from 'src/hooks/useUser';
import { getRouterState } from 'typeless-router';
import { Button } from 'ui';
import { LoginActions } from 'src/features/login/interface';
import { RegisterActions } from 'src/features/register/interface';

interface HeaderProps {
  className?: string;
}

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

const Inner = styled.div`
  display: flex;
  height: 70px;
`;

const Nav = styled.div`
  margin: 0 auto;
  display: flex;
`;
const NavItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 25px;
  height: 100%;
  border-bottom: 4px solid
    ${props => (props.active ? Theme.green : 'transparent')};
  a {
    text-decoration: none;
    font-weight: ${props => (props.active ? 500 : null)};
    color: ${props => (props.active ? 'white' : Theme.grayLight)};
    &:hover {
      color: white;
    }
  }
`;

const Username = styled.div`
  font-weight: 500;
  margin-left: 10px;
  color: white;
`;

const Caret = styled.div`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid ${Theme.grayLight};
  margin-left: 5px;
`;

const UserInfoWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const UserInfo = styled(VoidLink)`
  display: flex;
  align-items: center;
  &:hover {
    text-decoration: none;
    cursor: pointer;
    ${Caret} {
      border-top-color: white;
    }
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ccc;
  border: 1px solid ${Theme.gray3};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  ${Button} + ${Button} {
    margin-left: 20px;
  }
`;

const _Header = (props: HeaderProps) => {
  const { className } = props;
  const { logout } = useActions(GlobalActions);
  const user = useUser();
  const pathname = getRouterState().location!.pathname;
  const { showModal: showLoginModal } = useActions(LoginActions);
  const { showModal: showRegisterModal } = useActions(RegisterActions);

  return (
    <div className={className}>
      <Container>
        <Inner>
          <Brand>
            <Logo type="light" />
          </Brand>
          <Nav>
            <NavItem active={pathname === '/' || pathname === '/challenges'}>
              <Link href={createUrl({ name: 'challenges' })}>Challenges</Link>
            </NavItem>
            <NavItem active={pathname === '/projects'}>
              <Link href={createUrl({ name: 'projects' })}>Projects</Link>
            </NavItem>
            <NavItem>
              <Link href={createUrl({ name: 'challenges' })}>Contests</Link>
            </NavItem>
            <NavItem>
              <Link href={createUrl({ name: 'challenges' })}>Forums</Link>
            </NavItem>
          </Nav>
          {user ? (
            <UserInfoWrapper>
              <MenuDropdown
                testId="header-menu"
                dropdown={
                  <Dropdown>
                    <MenuItem>
                      <Link
                        testId="my-profile-link"
                        href={createUrl({
                          name: 'profile',
                          username: user.username,
                        })}
                      >
                        My Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link href={createUrl({ name: 'challenges' })}>
                        Settings
                      </Link>
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem red>
                      <VoidLink data-test="logout-btn" onClick={logout}>
                        Logout
                      </VoidLink>
                    </MenuItem>
                  </Dropdown>
                }
              >
                <UserInfo>
                  <Avatar />
                  <Username data-test="current-username">
                    {user.username}
                  </Username>
                  <Caret />
                </UserInfo>
              </MenuDropdown>
            </UserInfoWrapper>
          ) : (
            <Buttons>
              <Button
                onClick={e => {
                  showLoginModal();
                  e.preventDefault();
                }}
                testId="header-login-btn"
                type="secondary"
                href={createUrl({ name: 'login' })}
              >
                LOGIN
              </Button>
              <Button
                onClick={e => {
                  showRegisterModal();
                  e.preventDefault();
                }}
                testId="header-register-btn"
                type="primary"
                href={createUrl({ name: 'register' })}
              >
                JOIN NOW
              </Button>
            </Buttons>
          )}
        </Inner>
      </Container>
    </div>
  );
};

export const Header = styled(_Header)`
  display: block;
  /* background: ${Theme.textDark}; */
  background: ${Theme.text};
`;
