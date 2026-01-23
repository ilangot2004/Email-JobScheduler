// Frontend environment configuration
export const env = {
  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  },
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  },
};