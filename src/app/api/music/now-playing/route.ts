import { NextResponse } from "next/server";

import { config } from "@/lib/config";

export const revalidate = 0;

export async function GET() {
  const data = await fetch(config.spotifyNowPlayingUrl).then((res) => res.text());

  if (data.includes("No song playing") || data.includes("⏸️")) {
    return new NextResponse("Pas de musique en cours de lecture actuellement !");
  }

  const [rawArtists, rawTrack] = data.replace("▶️ ", "").split(" -> ")[0].split(" - ");
  const artists = rawArtists.split(", ");
  const track = rawTrack.slice(1, -1);

  if (artists.length === 1) {
    return new NextResponse(`"${track}" par ${artists[0]}`);
  }

  const cleanArtists = `${artists.slice(0, -1).join(", ")} et ${artists[artists.length - 1]}`;

  return new NextResponse(`"${track}" par ${cleanArtists}`);
}
