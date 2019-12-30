import { APIClient } from 'shared';
import { getAccessToken } from './Storage';

export const api = new APIClient('http://localhost:3000/api', getAccessToken);
