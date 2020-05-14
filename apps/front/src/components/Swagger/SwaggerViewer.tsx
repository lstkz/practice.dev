import * as React from 'react';
import { SwaggerMenu } from './SwaggerMenu';
import { SwaggerSpec } from 'src/types';
import { getDisplayGroups } from './utils';
import { SwaggerDisplayGroup } from './SwaggerDisplayGroup';
import { SwaggerContext } from './SwaggerContext';
import { SchemaList } from './SchemaList';
import { TwoColLayout } from '../TwoColLayout';

interface SwaggerViewerProps {
  className?: string;
  spec: SwaggerSpec;
}

export function SwaggerViewer(props: SwaggerViewerProps) {
  const { spec } = props;
  const displayGroups = React.useMemo(() => getDisplayGroups(spec), [spec]);
  return (
    <SwaggerContext.Provider value={spec}>
      <TwoColLayout
        width={230}
        relative
        left={<SwaggerMenu />}
        right={
          <>
            {displayGroups.map(item => (
              <SwaggerDisplayGroup key={item.tag.name} group={item} />
            ))}
            <SchemaList />
          </>
        }
      />
    </SwaggerContext.Provider>
  );
}
