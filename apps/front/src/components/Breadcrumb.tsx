import * as React from 'react';
import styled from 'styled-components';
import { Link } from './Link';
import { Theme } from 'src/common/Theme';

interface BreadcrumbProps {
  className?: string;
  url: string;
  icon: React.ReactChild;
  root: React.ReactChild;
  details?: React.ReactChild;
}

const Sep = styled.span`
  margin: 0 14px;
`;

const _Breadcrumb = (props: BreadcrumbProps) => {
  const { className, icon, root, details, url } = props;
  return (
    <div className={className}>
      {icon}
      {details ? (
        <>
          <Link href={url}>{root}</Link>
          <Sep>/</Sep>
          <span>{details}</span>
        </>
      ) : (
        <span>{root}</span>
      )}
    </div>
  );
};

export const Breadcrumb = styled(_Breadcrumb)`
  display: flex;
  margin: 30px 0;
  padding-left: 5px;
  align-items: center;
  svg {
    margin-right: 25px;
  }
  span {
    color: ${Theme.textDark};
  }
`;
