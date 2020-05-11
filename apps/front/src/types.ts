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
  schema: { $ref: string };
}

export interface SwaggerResponse {
  description: string;
  content: Record<string, SchemaRef>;
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
  | SwaggerObjectType
  | SwaggerStringType
  | SwaggerBooleanType;

export interface SwaggerObjectType {
  type: 'object';
  required?: string[];
  properties: Record<string, SwaggerType>;
}

export interface SwaggerStringType {
  type: 'string';
}
export interface SwaggerBooleanType {
  type: 'boolean';
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
