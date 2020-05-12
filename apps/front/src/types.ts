import { AC } from 'typeless';

export * from 'shared/src/types';

export interface RouteConfig {
  type: 'route';
  path: string | string[];
  exact?: boolean;
  auth: boolean | 'any';
  component: () => Promise<() => JSX.Element>;
  noLoader?: boolean;
  waitForAction?: AC;
}

export interface SelectOption<T = any> {
  label: string;
  value: T;
}

export type DeleteType = 'delete' | 'close';

export interface SchemaRef {
  schema: SwaggerRefType;
}

export interface SwaggerResponse {
  description: string;
  content: Record<string, SchemaRef> | SchemaRef;
}

export interface SwaggerMethod {
  operationId: string;
  description: string;
  tags: string[];
  requestBody: {
    required: boolean;
    content: Record<string, SchemaRef>;
  };
  responses: Record<string, SwaggerResponse>;
}

export type SwaggerType =
  | SwaggerRefType
  | SwaggerObjectType
  | SwaggerArrayType
  | SwaggerStringType
  | SwaggerBooleanType
  | SwaggerNumberType
  | SwaggerIntegerType;

export interface SwaggerObjectType {
  type: 'object';
  required?: string[];
  properties: Record<string, SwaggerType>;
}

export interface SwaggerRefType {
  $ref: string;
}

export interface SwaggerStringType {
  type: 'string';
}

export interface SwaggerBooleanType {
  type: 'boolean';
}

export interface SwaggerNumberType {
  type: 'number';
}

export interface SwaggerIntegerType {
  type: 'integer';
}

export interface SwaggerArrayType {
  type: 'array';
  items: SwaggerType;
}

export interface SwaggerTag {
  name: string;
  description?: string;
}

export interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  tags: SwaggerTag[];
  paths: Record<string, Record<string, SwaggerMethod>>;
  components: {
    schemas: Record<string, SwaggerObjectType>;
  };
}
