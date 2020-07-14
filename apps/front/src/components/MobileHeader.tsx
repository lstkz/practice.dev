import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'src/Theme';
import { VoidLink } from './VoidLink';
import { MenuIcon } from 'src/icons/MenuIcon';
import { LogoLight } from 'src/icons/LogoLight';
import { Link } from './Link';
import { createUrl } from 'src/common/url';
import { useUser } from 'src/hooks/useUser';
import { Avatar } from './Avatar';
import { MobileSidebar } from './MobileSidebar';

interface MobileHeaderProps {
  className?: string;
}

const HEIGHT = 60;

const MenuButton = styled(VoidLink)`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  padding: 0 70px;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  height: 100%;
`;

const Right = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    font-size: 17px;
  }
`;

const _MobileHeader = (props: MobileHeaderProps) => {
  const { className } = props;
  const user = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  return (
    <>
      {isSidebarOpen && (
        <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
      )}
      <div className={className}>
        <MenuButton
          data-test="mobile-menu"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </MenuButton>
        <Center>
          <LogoLight />
        </Center>
        <Right>
          {user ? (
            <Avatar border avatarUrl={user.avatarUrl} testId="header-avatar" />
          ) : (
            <Link testId="header-login" href={createUrl({ name: 'login' })}>
              Login
            </Link>
          )}
        </Right>
      </div>
    </>
  );
};

export const MobileHeader = styled(_MobileHeader)`
  display: block;
  background: ${Theme.text};
  position: relative;
  color: white;
  height: ${HEIGHT}px;
`;
