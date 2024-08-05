export type SpotifyApiResponse<T> =
  | {
      kind: "success";
      data: T;
    }
  | {
      kind: "error";
      error: {
        status: number;
        message: string;
      };
    };
