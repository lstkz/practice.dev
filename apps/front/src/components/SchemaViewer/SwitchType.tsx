import { SwaggerType, SwaggerObjectType } from 'src/types';
import { getRefType } from './utils';
import { ObjectType } from './ObjectType';
import React from 'react';
import { BasicType } from './BasicType';
import { ArrayType } from './ArrayType';

interface SwitchTypeProps {
  type: SwaggerType;
  schemas: Record<string, SwaggerObjectType>;
  depth: number;
  name?: string;
}

export function SwitchType(props: SwitchTypeProps) {
  const { type, schemas, depth, name } = props;
  if ('$ref' in type) {
    const { name, schema } = getRefType(type.$ref, schemas);
    return (
      <ObjectType depth={depth} schemas={schemas} name={name} schema={schema} />
    );
  }
  if (type.type === 'object') {
    return (
      <ObjectType name={name} depth={depth} schemas={schemas} schema={type} />
    );
  }
  if (type.type === 'array') {
    return <ArrayType depth={depth} schemas={schemas} schema={type} />;
  }
  return <BasicType type={type.type} />;
}
