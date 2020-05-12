import * as React from 'react';
import styled from 'styled-components';
import { SwaggerObjectType, SwaggerType } from 'src/types';
import { SwitchType } from './SwitchType';

interface SchemaViewerProps {
  className?: string;
  type: SwaggerType;
  schemas: Record<string, SwaggerObjectType>;
}

const _SchemaViewer = (props: SchemaViewerProps) => {
  const { className, type, schemas } = props;

  return (
    <div className={className}>
      <SwitchType depth={0} type={type} schemas={schemas} />
    </div>
  );
};

export const SchemaViewer = styled(_SchemaViewer)`
  font-family: Courier;
  background-color: #dddee4;
  position: relative;
  padding: 20px;
  border-radius: 5px;
  overflow: auto;
`;
