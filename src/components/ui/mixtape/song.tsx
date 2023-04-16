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
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={song.track.album.images[0]?.url}
              className="mx-auto mb-8 aspect-square h-44 w-44"
              alt="Album"
            />
            <h2 className="text-center font-serif text-5xl font-bold drop-shadow-lg">
              {song.track.name}
            </h2>
            <p className="text-center text-stone-600">
              {song.track.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
          <p className="leading-8 tracking-wide">{song.post_description}</p>
        </div>
      </Container>
      <div>uwu</div>
    </div>
  );
};
