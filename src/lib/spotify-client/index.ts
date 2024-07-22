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
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
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

  public async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `https://api.spotify.com/v1${endpoint}`;

    if (!this.accessToken) {
      await this.authenticate();
    }

    const response = await fetch(url, this.addAuthorizationHeader(options));

    // If authentificated, return the response
    if (response.status !== 401) {
      return response.json();
    }

    // Else, try to re-generate the access token
    await this.authenticate();

    // Then, retry the request
    return (await fetch(url, this.addAuthorizationHeader(options))).json();
  }
}

const spotifyApiClientInstance = SpotifyApiClient.getInstance(
  process.env.SPOTIFY_API_CLIENT_ID!,
  process.env.SPOTIFY_API_CLIENT_SECRET!
);

export default spotifyApiClientInstance;
