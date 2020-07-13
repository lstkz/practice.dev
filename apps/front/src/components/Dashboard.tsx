import * as React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { AppErrorBanner } from './AppErrorBanner';
import { ConfirmModalView } from 'src/features/confirmModal/components/ConfirmModal';
import { ConfirmEmailWarning } from './ConfirmEmailWarning';
import { AppSuccessBanner } from './AppSuccessBanner';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileHeader } from './MobileHeader';

interface DashboardProps {
  className?: string;
  children: React.ReactNode;
}

const Content = styled.div`
  flex: 1 0 0;
`;

const _Dashboard = (props: DashboardProps) => {
  const { className, children } = props;
  const isMobile = useIsMobile();

  return (
    <>
      <div className={className}>
        {isMobile ? <MobileHeader /> : <Header />}
        <Content>
          <AppSuccessBanner />
          <AppErrorBanner />
          <ConfirmEmailWarning />
          {children}
        </Content>
        <Footer />
      </div>
      <ConfirmModalView />
    </>
  );
};

export const Dashboard = styled(_Dashboard)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;
