import fetch from 'node-fetch';
import { ES_USERNAME, ES_PASSWORD, ES_URL, ES_INDEX_PREFIX } from '../config';
import { decLastKey, encLastKey } from './helper';
import { ElasticError } from './errors';

function _getHeaders() {
  return {
    Authorization:
      `Basic ` +
      Buffer.from(`${ES_USERNAME}:${ES_PASSWORD}`).toString('base64'),
    'Content-Type': 'application/json',
  };
}

function _getIndexName(indexName: string) {
  return (ES_INDEX_PREFIX
    ? ES_INDEX_PREFIX + indexName
    : indexName
  ).toLowerCase();
}

function _getUrl(path: string) {
  let url = ES_URL + path;
  if (process.env.NODE_ENV === 'test') {
    url += '?refresh';
  }
  return url;
}

export interface EsSearchCriteria {
  query?: any;
  limit: number;
  cursor?: string | null;
  sort: Array<Record<string, 'asc' | 'desc'>>;
}

export interface SearchResult<T> {
  items: T[];
  lastKey: string | null;
}

export interface BaseEntityClass {
  entityType: string;
  new (...args: any[]): any;
  fromJSON(values: Record<string, any>): any;
}

export async function esSearch<T extends BaseEntityClass>(
  Entity: T,
  criteria: EsSearchCriteria
): Promise<SearchResult<InstanceType<T>>> {
  const url = ES_URL + `/${_getIndexName(Entity.entityType)}/_search`;
  const requestBody = JSON.stringify({
    query: criteria.query,
    sort: criteria.sort,
    search_after: criteria.cursor ? decLastKey(criteria.cursor) : undefined,
    size: criteria.limit + 1,
  });
  const res = await fetch(url, {
    method: 'POST',
    headers: _getHeaders(),
    body: requestBody,
  });
  const body: any = await res.json();

  if (body.error) {
    if (body.error.type === 'index_not_found_exception') {
      return {
        items: [],
        lastKey: null,
      };
    }
    console.error(
      'esSearch fail',
      JSON.stringify({
        url,
        requestBody,
        responseBody: body,
      })
    );
    throw new ElasticError(body.error);
  }
  const hits: any[] = body.hits.hits;
  const hasLast = hits.length > criteria.limit;
  const items = hits.map((x: any) => x._source);
  const lastSort = hasLast && hits[hits.length - 2]?.sort;
  return {
    items: items.slice(0, criteria.limit).map(props => Entity.fromJSON(props)),
    lastKey: lastSort ? encLastKey(lastSort) : null,
  };
}

export interface IndexBulkItem {
  type: 'index' | 'delete';
  entity: {
    entityType: string;
    pk: string;
    sk: string;
  };
}
export async function exIndexBulk(items: IndexBulkItem[]) {
  if (!items.length) {
    return;
  }
  const data: string[] = [];
  items.forEach(({ entity, type }) => {
    if (!entity.entityType) {
      console.error('entityType missing', entity);
      return;
    }
    const _id =
      entity.pk === entity.sk ? entity.pk : entity.pk + '_' + entity.sk;
    data.push(
      JSON.stringify({
        [type]: { _index: _getIndexName(entity.entityType), _id },
      })
    );
    if (type === 'index') {
      data.push(JSON.stringify(entity));
    }
  });
  const res = await fetch(_getUrl(`/_bulk`), {
    method: 'POST',
    headers: _getHeaders(),
    body: data.join('\n') + '\n',
  });
  const body: any = await res.json();
  if (body.errors) {
    console.error(
      'exIndexBulk fail',
      JSON.stringify({
        responseBody: body,
      })
    );
    throw new ElasticError(body);
  }
}

export async function esClearIndex(indexName: string) {
  const url = _getUrl(`/${_getIndexName(indexName)}/_delete_by_query`);
  const res = await fetch(url, {
    method: 'POST',
    headers: _getHeaders(),
    body: JSON.stringify({
      query: {
        match_all: {},
      },
    }),
  });
  const body: any = await res.json();
  if (
    body.error &&
    !(body.error.reason as string).startsWith('no such index')
  ) {
    console.error(
      'esClearIndex fail',
      JSON.stringify({
        url,
        responseBody: body,
      })
    );
    throw new ElasticError(body.error);
  }
}
