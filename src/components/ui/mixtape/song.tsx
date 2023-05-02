import { api } from "~/utils/api";

import { Container } from "../container";

import type { FC } from "react";
import type { MixtapeSong } from "~/types/song";
import type { Mixtape } from "@prisma/client";
import Link from "next/link";

export const SongDisplay: FC<{
  song: MixtapeSong;
  index: number;
  mixtape: Mixtape;
}> = ({ song, index, mixtape }) => {
  const trackMutation = api.spotify.playTracks.useMutation();

  const playTrack = async () => {
    await trackMutation.mutateAsync({
      mixtapeId: mixtape.id,
      trackIndex: index,
    });
  };

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-8 align-middle">
      <Container>
        <p className="mb-8 text-center text-xl font-bold">{index + 1}</p>
      </Container>
      <Container>
        <div className="grid w-full gap-8">
          <p hidden={!!!song.pre_description} className="prose prose-xl">
            {song.pre_description}
          </p>
          <div className="border border-stone-600">
            <div className="flex flex-col gap-4 p-4 lg:flex-row-reverse lg:justify-between">
              <div className="flex flex-shrink-0 items-center gap-4 py-2 lg:items-start lg:justify-end lg:py-0">
                {/* <button>
                <EllipsisVerticalIcon className="h-8 w-8" />
              </button> */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/Spotify_Logo_RGB_Black.png"
                  alt="Spotify"
                  className="h-6 w-auto"
                />
              </div>
              <div className="sm:flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={song.track.album.images[0]?.url}
                  alt="Album cover"
                  className="w-full sm:w-44"
                />
                <div className="my-auto pt-4 sm:pl-4 sm:pt-0">
                  <Link
                    href={song.track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tracking-7 text-xl font-bold leading-tight hover:underline sm:text-3xl"
                  >
                    {song.track.name}
                  </Link>
                  <p>
                    {song.track.artists.map((artist, i) => (
                      <Link
                        key={artist.id}
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="hover:underline">{artist.name}</span>
                        {i !== song.track.artists.length - 1 && ", "}
                      </Link>
                    ))}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 divide-x divide-stone-700 border-t border-stone-700">
              <button
                onClick={() => {
                  playTrack().catch(console.error);
                }}
                className="p-4"
              >
                Listen on Spotify
              </button>
              <Link
                href={song.track.external_urls.spotify}
                className="p-4 text-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                On Spotify
              </Link>
            </div>
          </div>
          <p hidden={!!!song.post_description} className="prose prose-xl">
            {song.post_description}
          </p>
        </div>
      </Container>
    </div>
  );
};
