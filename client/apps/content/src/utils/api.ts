const API_DOMAIN = 'http://localhost:8080';
const API_KEY = 'super-secret-api-key';

export const api = async <T>(endpoint: string) => {
  const url = `${API_DOMAIN}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    headers: {
      'X-Api-Key': API_KEY,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
};
