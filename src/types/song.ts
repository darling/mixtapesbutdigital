import type { Song } from "@prisma/client";

export type MixtapeSong = Song & { track: SpotifyApi.TrackObjectFull };
