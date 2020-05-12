import { SwaggerSpec } from 'src/types';

export const exampleSwagger1: SwaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Simple password validation', version: '1.0.0' },
  tags: [
    {
      name: 'Validation',
    },
  ],
  paths: {
    '/validate': {
      post: {
        operationId: 'validate',
        tags: ['Validation'],
        description:
          'Validate if the password meets the following conditions:   \n1. Must contain at least 5 characters.\n2. Cannot start or end with a space.\n3. Must contain at least 1 special character from group: `!@#$`.\n\nNotes:\n- You can assume that the input `password` will be a string type, less than 100 characters, and not null or undefined.\n',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PasswordValues' },
            },
          },
        },
        responses: {
          '200': {
            description: 'The validation result.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationResult' },
              },
            },
          },
          '400': {
            description: 'The validation result.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationResult2' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PasswordValues: {
        type: 'object',
        required: ['password'],
        properties: { password: { type: 'string' } },
      },
      ValidationResult2: {
        type: 'object',
        required: ['isValid'],
        properties: {
          isValid: { type: 'boolean' },
          pageNo: {
            type: 'number',
          },
        },
      },
      ValidationResult: {
        type: 'object',
        required: ['isValid'],
        properties: {
          isValid: { type: 'boolean' },
          pageNo: {
            type: 'number',
          },
          totalPages: {
            type: 'integer',
          },
          nested: {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
          },
          foo: {
            type: 'string',
          },
          nestedRef: {
            $ref: '#/components/schemas/PasswordValues',
          },
          strArray: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          bar: {
            type: 'string',
          },
          objArray: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                foo: { type: 'string' },
                bar: { type: 'string' },
                baz: { type: 'string' },
              },
            },
          },
          refArray: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/PasswordValues',
            },
          },

          rec: {
            $ref: '#/components/schemas/ValidationResult',
          },
        },
      },
    },
  },
};
