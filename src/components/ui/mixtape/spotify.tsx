/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PauseIcon, PlayIcon } from "@heroicons/react/20/solid";
import { type FC } from "react";
import { useSpotify } from "~/contexts/spotify-player";

export const SpotifyPlayer: FC = () => {
  const { isPlaying, controls, isActiveDevice, player } = useSpotify();

  if (!player.currentTrack) return null;

  return (
    <div
      hidden={!isActiveDevice}
      className="flex w-full items-start gap-2 rounded-md bg-stone-900 bg-opacity-60 p-2 text-white backdrop-blur-md"
    >
      <a
        href={player.currentTrack?.uri}
        className="aspect-square h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={player.currentTrack?.album.images?.[0]?.url} alt="" />
      </a>
      <div className="flex flex-grow flex-col justify-center">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-bold">
              {player.currentTrack?.name}
            </span>
            <span className="text-xs">
              {player.currentTrack?.artists
                ?.map((artist) => artist.name)
                .join(", ")}
            </span>
          </div>
        </div>
      </div>
      <div className="my-auto">
        <button
          onClick={() => {
            controls.togglePlay();
          }}
          className="rounded-lg px-4 py-2 text-white"
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>
      </div>
      <a
        className="aspect-square flex-shrink-0 overflow-hidden rounded-sm"
        href={"https://open.spotify.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/Spotify_Icon_RGB_White.png" className="h-6 w-6" alt="" />
      </a>
    </div>
  );
};
