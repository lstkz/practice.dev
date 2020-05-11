import * as React from 'react';
import styled from 'styled-components';
import { Theme } from 'ui';
import { SwaggerMenu } from './SwaggerMenu';
import { SwaggerSpec } from 'src/types';
import { getDisplayGroups } from './utils';
import { SwaggerDisplayGroup } from './SwaggerDisplayGroup';

interface SwaggerViewerProps {
  className?: string;
  spec: SwaggerSpec;
}

const Left = styled.div`
  padding: 0 30px;
  width: 230px;
  border-right: 1px solid ${Theme.grayLight};
`;

const Right = styled.div`
  padding: 0 50px;
  height: 2000px;
`;

const _SwaggerViewer = (props: SwaggerViewerProps) => {
  const { className, spec } = props;
  const displayGroups = React.useMemo(() => getDisplayGroups(spec), [spec]);
  return (
    <div className={className}>
      <Left>
        <SwaggerMenu spec={spec} />
      </Left>
      <Right>
        {displayGroups.map(item => (
          <SwaggerDisplayGroup key={item.tag.name} group={item} />
        ))}
      </Right>
    </div>
  );
};

export const SwaggerViewer = styled(_SwaggerViewer)`
  display: flex;
  position: relative;
  padding-top: 40px;
  padding-bottom: 60px;
`;
