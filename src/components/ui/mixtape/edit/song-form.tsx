import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { EditSongSchema } from "~/schema/song";
import { api } from "~/utils/api";

import { Button } from "../../buttons";
import { Container } from "../../container";
import { FormSection } from "../../form/section";
import { LongFormTextInput } from "../../form/text";

import type { FC } from "react";
import type { z } from "zod";
import type { MixtapeSong } from "~/types/song";

interface SongFormProps {
  song: MixtapeSong;
}

export const MixtapeSongForm: FC<SongFormProps> = ({ song }) => {
  const methods = useForm({
    defaultValues: {
      pre_description: song.pre_description,
      post_description: song.post_description,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(EditSongSchema),
    mode: "onBlur",
    shouldUseNativeValidation: true,
    shouldFocusError: true,
  });

  const songMutation = api.song.editSong.useMutation();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { invalidate } = api.useContext();

  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
    reset,
  } = methods;

  const onSubmit = async (data: z.infer<typeof EditSongSchema>) => {
    await songMutation.mutateAsync({
      id: song.id,
      song: data,
    });

    await invalidate();
  };

  return (
    <FormProvider {...methods}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit, console.error)}>
        <Container>
          <FormSection
            title={song.track.name}
            description={
              song.track.artists.map((a) => a.name).join(", ") +
              ". Edit the song's appearance on your mixtape."
            }
          >
            {errors.root && (
              <div className="col-span-full">
                <p className="text-sm text-red-500">{errors.root.message}</p>
              </div>
            )}
            <LongFormTextInput
              name="pre_description"
              label="Pre-Description"
              description="This will appear before the song on your mixtape."
            />
            <LongFormTextInput
              name="post_description"
              label="Post-Description"
              description="This will appear after the song on your mixtape."
            />
            <div
              hidden={!isDirty || isSubmitting || isSubmitted}
              className="col-span-full "
            >
              <div className="flex flex-row justify-end gap-4">
                <Button.Basic
                  type="button"
                  onClick={() => {
                    reset();
                  }}
                  disabled={!isDirty}
                >
                  Reset
                </Button.Basic>
                <Button.Primary
                  disabled={Object.keys(errors).length > 0 || !isDirty}
                  type="submit"
                >
                  Save
                </Button.Primary>
              </div>
            </div>
          </FormSection>
        </Container>
      </form>
    </FormProvider>
  );
};
