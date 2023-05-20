import { api } from "~/utils/api";

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
    <div className="max-w-[65ch] py-8">
      <p className="mb-8 text-center text-xl font-bold">{index + 1}</p>
      <div className="grid w-full gap-8">
        <p hidden={!!!song.pre_description} className="prose">
          {song.pre_description}
        </p>
        <div className="">
          <div className="flex flex-col gap-4 lg:flex-row-reverse lg:justify-between">
            <div className="flex flex-shrink-0 items-center gap-4 py-2 lg:items-start lg:justify-end lg:py-0"></div>
            <div className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={song.track.album.images[0]?.url}
                alt="Album cover"
                className="mr-2 w-1/3 drop-shadow-md sm:w-44 lg:mr-0"
              />
              <div className="sm:pl-4 sm:pt-0 lg:my-auto lg:pt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/Spotify_Icon_RGB_Black.png"
                  alt="Spotify"
                  className="mb-4 h-6 w-auto lg:hidden"
                />
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
          <div className="hidden">
            <button
              onClick={() => {
                playTrack().catch(console.error);
              }}
              className="p-2 px-4"
            >
              Listen on Spotify
            </button>
            <Link
              href={song.track.external_urls.spotify}
              className="rounded-lg bg-stone-900 p-2 px-4 text-center text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              On Spotify
            </Link>
          </div>
        </div>
        <p hidden={!!!song.post_description} className="prose">
          {song.post_description}
        </p>
      </div>
    </div>
  );
};
