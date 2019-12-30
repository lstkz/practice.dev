import * as React from 'react';
import styled from 'styled-components';
import { Link } from './Link';
import { createUrl } from 'src/common/url';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { Button } from './Button';
import { useActions } from 'typeless';
import { MenuDropdown } from './DropdownTrigger';
import {
  DropdownMenu,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from './DropdownMenu';

interface HeaderProps {
  className?: string;
}

const Brand = styled(Link)`
  font-size: 1.25rem;
  line-height: inherit;
  display: inline-block;
  margin-right: 16px;
  white-space: nowrap;
  color: black;
`;

const Menu = styled.ul`
  display: flex;
  flex-direction: row;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
  margin: 0 auto;
`;

const MenuItem = styled.li`
  margin-right: 8px;
  a {
    font-family: inherit;
    font-weight: 400;
    padding: 16px;
    border-radius: 0;
    color: rgba(31, 45, 61, 0.5);
    transition: all 0.15s linear;
    letter-spacing: 0;
    text-transform: none;
  }
`;

const Username = styled.div`
  color: #3c4858;
`;

const _Header = (props: HeaderProps) => {
  const { className } = props;
  const { user } = getGlobalState.useState();
  const { logout } = useActions(GlobalActions);
  const userRef = React.useRef(user);

  React.useEffect(() => {
    if (user) {
      userRef.current = user;
    }
  }, [user]);

  return (
    <header className={className}>
      <Brand href={createUrl({ name: 'home' })}>Practice.dev</Brand>
      <Menu>
        <MenuItem>
          <Link href={createUrl({ name: 'challenges' })}>Challenges</Link>
          <Link href={createUrl({ name: 'challenges' })}>Other link</Link>
        </MenuItem>
      </Menu>
      <Username>
        <MenuDropdown
          dropdown={
            <DropdownMenu>
              <DropdownHeader>User menu</DropdownHeader>
              <DropdownItem>
                <i className="fas fa-user-circle"></i>Profile
              </DropdownItem>
              <DropdownItem>
                <i className="fas fa-cog"></i>
                Settings
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={logout}>
                <i className="fas fa-sign-out-alt"></i>Sign out
              </DropdownItem>
            </DropdownMenu>
          }
        >
          <Button type="secondary" size="small">
            Hi, {userRef.current?.username}
          </Button>
        </MenuDropdown>
      </Username>
    </header>
  );
};

export const Header = styled(_Header)`
  display: flex;
  background: white;
  box-shadow: 0 0 10px rgba(31, 45, 61, 0.03);
  padding-right: 30px;
  padding-left: 30px;
  flex-wrap: nowrap;
  border-bottom: 1px solid #eff2f7;
  align-items: center;
  min-height: 60px;
`;
