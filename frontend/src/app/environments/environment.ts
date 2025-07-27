export const env = {
  apiUrl: (globalThis as any)?.process?.env?.['NG_APP_API_URL'] || 'https://blogbee.onrender.com/api',
  baseUrl: (globalThis as any)?.process?.env?.['NG_APP_BASE_URL'] || 'https://blogbee.onrender.com',
};
