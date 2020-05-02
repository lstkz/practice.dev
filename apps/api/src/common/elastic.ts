import fetch from 'node-fetch';

function _getHeaders() {
  const username = process.env.ES_USERNAME!;
  const password = process.env.ES_PASSWORD!;
  return {
    Authorization:
      `Basic ` + Buffer.from(`${username}:${password}`).toString('base64'),
    'Content-Type': 'application/json',
  };
}

export async function esPutItem<T>(
  name: string,
  id: string,
  content: any
): Promise<T> {
  const url = process.env.ES_URL!;
  const res = await fetch(url + `/${name}/_doc/` + id, {
    method: 'PUT',
    headers: _getHeaders(),
    body: JSON.stringify(content),
  });
  return res.json();
}

export async function esSearch<T>(name: string, criteria: any): Promise<T> {
  const url = process.env.ES_URL!;
  console.log(JSON.stringify(criteria, null, 2));
  const res = await fetch(url + `/${name}/_search`, {
    method: 'POST',
    headers: _getHeaders(),
    body: JSON.stringify(criteria),
  });
  return res.json();
}
