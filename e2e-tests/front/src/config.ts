// if (!process.env.AWS) {
//   const dotenv = require('dotenv');
//   dotenv.config({
//     path: '../../.env',
//   });
// }

// if (!process.env.E2E_WEBSITE_URL) {
//   throw new Error('E2E_WEBSITE_URL is not set');
// }

export const WEBSITE_URL =
  process.env.E2E_WEBSITE_URL || 'http://localhost:9000';
