import { SpotifyApiResponse } from "./types";

class SpotifyApiClient {
  private clientId: string;

  private clientSecret: string;

  private accessToken: string | null;

  private static instance: SpotifyApiClient;

  private constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = null;
  }

  public static getInstance(
    clientId: string,
    clientSecret: string
  ): SpotifyApiClient {
    if (!SpotifyApiClient.instance) {
      SpotifyApiClient.instance = new SpotifyApiClient(clientId, clientSecret);
    }

    return SpotifyApiClient.instance;
  }

  private async authenticate() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
      cache: "no-cache",
    });

    this.accessToken = (await response.json()).access_token;
  }

  private addAuthorizationHeader(options: RequestInit): RequestInit {
    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  public async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SpotifyApiResponse<T>> {
    const url = `https://api.spotify.com/v1${endpoint}`;

    if (!this.accessToken) {
      await this.authenticate();
    }

    let response = await fetch(url, this.addAuthorizationHeader(options));

    // If not authentificated, try to re-generate the access token and refetch
    if (response.status === 401) {
      await this.authenticate();
      response = await fetch(url, this.addAuthorizationHeader(options));
    }

    const data = await response.json();

    if (response.status >= 300) {
      return {
        kind: "error",
        error: data.error,
      };
    }

    return {
      kind: "success",
      data,
    };
  }
}

const spotifyApiClientInstance = SpotifyApiClient.getInstance(
  process.env.SPOTIFY_API_CLIENT_ID!,
  process.env.SPOTIFY_API_CLIENT_SECRET!
);

export default spotifyApiClientInstance;
