import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import type { FC } from "react";
import type { MixtapeSong } from "~/types/song";

export const MixtapeSongTable: FC<{
  songs: MixtapeSong[];
}> = ({ songs }) => {
  return (
    <div>
      <table className="min-w-full divide-y divide-stone-300">
        <thead>
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-sm font-normal sm:pl-0"
            >
              #
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
            >
              Title
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-normal sm:pl-0"
            >
              <img
                className="mx-auto h-6 w-auto"
                src="/img/Spotify_Logo_RGB_Black.png"
                alt=""
              />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td className="py-3.5 pl-4 pr-3 text-center text-sm sm:pl-0">
                {index + 1}
              </td>
              <td className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-800 sm:pl-0">
                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-10 w-10"
                      src={song.track.album.images[0]?.url}
                      alt="Album"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-stone-800">
                      {song.track.name}
                    </div>
                    <div className="text-sm font-normal text-stone-500">
                      {song.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 pl-4 pr-3 text-center text-sm font-semibold text-stone-800 sm:pl-0">
                <Link
                  href={song.track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="mx-auto h-5 w-5 text-stone-500" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
