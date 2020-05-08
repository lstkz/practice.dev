import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';

interface SettingsSectionProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${Theme.textDark};
  margin-bottom: 20px;
`;

const _SettingsSection = (props: SettingsSectionProps) => {
  const { className, children, title } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      {children}
    </div>
  );
};

export const SettingsSection = styled(_SettingsSection)`
  display: block;
  margin-bottom: 40px;
`;
