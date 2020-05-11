import * as React from 'react';
import styled from 'styled-components';
import { SwaggerObjectType } from 'src/types';
import { ObjectType } from './ObjectType';

interface SchemaViewerProps {
  className?: string;
  obj: SwaggerObjectType;
  name: string;
}

const _SchemaViewer = (props: SchemaViewerProps) => {
  const { className, obj, name } = props;

  const renderType = () => {
    if (obj.type === 'object') {
      return <ObjectType name={name} obj={obj} />;
    }
    return null;
  };

  return <div className={className}>{renderType()}</div>;
};

export const SchemaViewer = styled(_SchemaViewer)`
  font-family: Courier;
  background-color: #272822;
  position: relative;
  padding: 10px;
  border-radius: 5px;
  color: rgb(249, 248, 245);
  font-weight: bold;
`;
