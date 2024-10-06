import { config } from "@/lib/config";

const statsfmFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `https://api.stats.fm/api/v1/users/${config.statsfmUserId}${endpoint}`;

  const response = await fetch(url, options);

  return response.json();
};

export default statsfmFetch;
