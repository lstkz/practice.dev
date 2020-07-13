import * as React from 'react';
import styled from 'styled-components';
import { Title } from 'src/components/Title';

interface SettingsSectionProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const _SettingsSection = (props: SettingsSectionProps) => {
  const { className, children, title } = props;
  return (
    <div className={className}>
      <Title mb="md">{title}</Title>
      {children}
    </div>
  );
};

export const SettingsSection = styled(_SettingsSection)`
  display: block;
  margin-bottom: 40px;
  padding: 0 40px;
`;
