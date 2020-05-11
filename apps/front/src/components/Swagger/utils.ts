import { SwaggerTag, SwaggerMethod, SwaggerSpec } from 'src/types';

export interface DisplayGroupItem {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete';
  def: SwaggerMethod;
}

export interface DisplayGroup {
  tag: SwaggerTag;
  items: DisplayGroupItem[];
}

export function getDisplayGroups(spec: SwaggerSpec): DisplayGroup[] {
  const group: Record<string, DisplayGroupItem[]> = {};
  Object.entries(spec.paths).forEach(([path, pathMap]) => {
    Object.entries(pathMap).forEach(([method, def]) => {
      const tag = def.tags[0];
      if (!tag) {
        throw new Error(`missing tag in ${path} ${method}`);
      }
      if (!group[tag]) {
        group[tag] = [];
      }
      group[tag].push({
        path,
        method: method as any,
        def,
      });
    });
  });
  return spec.tags.map(tag => {
    const items = group[tag.name];
    if (!items) {
      throw new Error('No items for tag: ' + tag.name);
    }
    return {
      tag,
      items,
    };
  });
}
