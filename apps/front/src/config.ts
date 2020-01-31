if (!process.env.GITHUB_CLIENT_ID) {
  throw new Error('GITHUB_CLIENT_ID is not set');
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set');
}

if (!process.env.BUNDLE_BASE_URL) {
  throw new Error('GOOGLE_CLIENT_ID is not set');
}

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const BUNDLE_BASE_URL = process.env.BUNDLE_BASE_URL;
