import * as React from 'react';
import styled from 'styled-components';
import { SwaggerArrayType, SwaggerObjectType } from 'src/types';
import { SwitchType } from './SwitchType';

interface ArrayTypeProps {
  className?: string;
  schema: SwaggerArrayType;
  schemas: Record<string, SwaggerObjectType>;
  depth: number;
}

const _ArrayType = (props: ArrayTypeProps) => {
  const { className, schema, schemas, depth } = props;

  return (
    <div className={className}>
      <strong>[</strong>
      <SwitchType depth={depth + 1} type={schema.items} schemas={schemas} />
      <strong>]</strong>
    </div>
  );
};

export const ArrayType = styled(_ArrayType)`
  display: block;
`;
