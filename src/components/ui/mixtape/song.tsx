import type { FC } from "react";
import type { MixtapeSong } from "~/types/song";
import { Container } from "../container";

export const SongDisplay: FC<{ song: MixtapeSong; index: number }> = ({
  song,
  index,
}) => {
  return (
    <div className="flex min-h-screen flex-col justify-between border-t border-stone-700 align-middle">
      <div>Uwu</div>
      <Container>
        <div className="flex flex-col gap-8">
          <p className="leading-8 tracking-wide">{song.pre_description}</p>
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={song.track.album.images[0]?.url}
              className="aspect-square h-44 w-44"
              alt="Album"
            />
            <div className="flex flex-col gap-4 text-center lg:gap-0 lg:text-left">
              <h2 className="font-serif text-3xl font-bold drop-shadow-lg lg:text-5xl">
                {song.track.name}
              </h2>
              <p className="text-stone-600">
                {song.track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </div>
          <p className="leading-8 tracking-wide">{song.post_description}</p>
        </div>
      </Container>
      <div>uwu</div>
    </div>
  );
};
