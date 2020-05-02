import fetch from 'node-fetch';
import * as R from 'remeda';
import { ES_USERNAME, ES_PASSWORD, ES_URL } from '../config';
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

export async function esPutItem<T>(
  name: string,
  id: string,
  content: any
): Promise<T> {
  const res = await fetch(ES_URL + `/${name}/_doc/` + id, {
    method: 'PUT',
    headers: _getHeaders(),
    body: JSON.stringify(content),
  });
  return res.json();
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

export async function esSearch<
  T extends {
    entityType: string;
    new (...args: any[]): any;
  }
>(
  Entity: T,
  criteria: EsSearchCriteria
): Promise<SearchResult<InstanceType<T>>> {
  const res = await fetch(ES_URL + `/${Entity.entityType}/_search`, {
    method: 'POST',
    headers: _getHeaders(),
    body: JSON.stringify({
      query: criteria.query,
      sort: criteria.sort,
      search_after: criteria.cursor ? decLastKey(criteria.cursor) : undefined,
    }),
  });
  const body: any = res.json();
  if (body.error) {
    throw new ElasticError(body.error);
  }
  const hits: any[] = body.hits.hits;
  const items = hits.map((x: any) => x._source);
  const lastSort = R.last(hits)?.sort;
  return {
    items: items.map(props => new Entity(props)),
    lastKey: lastSort ? encLastKey(lastSort) : null,
  };
}
