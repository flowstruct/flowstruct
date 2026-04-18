const SITE_GENERATOR_API_KEY = process.env.SITE_GENERATOR_API_KEY || 'super-secret-api-key';
const API_PORT = process.env.API_PORT || 8080;

export const api = async <T>(endpoint: string) => {
  const url = `http://localhost:${API_PORT}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: {
      'X-Site-Generator-Api-Key': SITE_GENERATOR_API_KEY,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
};
