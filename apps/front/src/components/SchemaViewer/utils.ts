import * as R from 'remeda';
import { SwaggerObjectType } from 'src/types';

export function getRefType(
  ref: string,
  schemas: Record<string, SwaggerObjectType>
) {
  if (!ref.startsWith('#/components/schemas/')) {
    throw new Error('$ref must start with #/components/schemas/');
  }
  const name = R.last(ref.split('/'))!;
  const schema = schemas[name];
  if (!schema) {
    throw new Error(`Schema ${name} not found`);
  }
  return { name, schema };
}
