import type { FC } from "react";
import * as Toggle from "@radix-ui/react-toggle";

const classNames = (...classes: unknown[]) => classes.filter(Boolean).join(" ");

interface TrackSelectionProps {
  track: SpotifyApi.TrackObjectFull;
  onSelect: (track: SpotifyApi.TrackObjectFull) => void;
  selectedIds: string[];
}

export const TrackSelection: FC<TrackSelectionProps> = ({
  track,
  onSelect,
  selectedIds,
}) => {
  const isSelected = selectedIds.includes(track.id);
  const isNotAValidTrack = track.type !== "track";
  const isDisabled = isNotAValidTrack;
  const selectedPosition = selectedIds.indexOf(track.id) + 1;

  return (
    <Toggle.Root
      className={classNames(
        "flex w-full items-center gap-4 rounded-md py-2 pr-2 text-left transition duration-100 disabled:opacity-50",
        isSelected && "bg-indigo-600 text-white"
      )}
      onPressedChange={() => onSelect(track)}
      pressed={isSelected}
      disabled={isDisabled}
    >
      <div
        className={classNames(
          "aspect-square h-8 w-8 items-center justify-center rounded-md border border-stone-400 text-center font-serif text-2xl font-bold transition duration-100 disabled:cursor-not-allowed disabled:bg-red-200",
          isSelected && "border-0 bg-indigo-600 text-white"
        )}
      >
        {isSelected && selectedPosition}
      </div>
      <div>
        <div className="font-bold">{track.name}</div>
        <div className="text-sm">
          {track.artists.map((artist) => artist.name).join(", ")}
        </div>
      </div>
    </Toggle.Root>
  );
};
