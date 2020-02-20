import * as React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';
import { AppErrorBanner } from './AppErrorBanner';
import { ConfirmModalView } from 'src/features/confirmModal/components/ConfirmModal';

interface DashboardProps {
  className?: string;
  children: React.ReactNode;
}

const Content = styled.div`
  flex: 1 0 0;
`;

const _Dashboard = (props: DashboardProps) => {
  const { className, children } = props;
  return (
    <>
      <div className={className}>
        <Header />
        <Content>
          <AppErrorBanner />
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
