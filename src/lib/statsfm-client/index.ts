const statsfmFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `
https://api.stats.fm/api/v1/users/${process.env.STATSFM_USER_ID}${endpoint}`;

  const response = await fetch(url, options);

  return response.json();
};

export default statsfmFetch;
