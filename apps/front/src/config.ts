if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set');
}

if (!process.env.BUNDLE_BASE_URL) {
  throw new Error('BUNDLE_BASE_URL is not set');
}

if (!process.env.API_URL) {
  throw new Error('API_URL is not set');
}

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL is not set');
}

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const BUNDLE_BASE_URL = process.env.BUNDLE_BASE_URL;

export const API_URL = process.env.API_URL;

export const SOCKET_URL = process.env.SOCKET_URL;
