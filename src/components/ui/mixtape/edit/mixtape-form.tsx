import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { EditMixtapeSchema } from "~/schema/mixtape";
import { api } from "~/utils/api";

import { Button } from "../../buttons";
import { Container } from "../../container";
import { CheckBoxInput } from "../../form/checkbox";
import { FormSection } from "../../form/section";
import { FormTextInput, LongFormTextInput } from "../../form/text";

import type { Mixtape } from "@prisma/client";
import type { FC } from "react";
import type { z } from "zod";

interface MixtapeFormProps {
  mixtape: Mixtape;
  invalidate: () => Promise<Mixtape>;
}

export const MixtapeForm: FC<MixtapeFormProps> = ({ mixtape, invalidate }) => {
  const methods = useForm({
    defaultValues: {
      title: mixtape.title,
      description: mixtape.description,
      public: mixtape.public,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(EditMixtapeSchema),
    mode: "onBlur",
    shouldUseNativeValidation: true,
    shouldFocusError: true,
  });

  const mixtapeMutation = api.mixtapes.editMixtape.useMutation();

  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (data: z.infer<typeof EditMixtapeSchema>) => {
    await mixtapeMutation.mutateAsync({
      id: mixtape.id,
      mixtape: data,
    });
    const fresh = await invalidate();

    // take only the keys that we want to reset
    const { title, description, public: isPublic } = fresh;

    reset({
      title,
      description,
      public: isPublic,
    });
  };

  return (
    <FormProvider {...methods}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit, console.error)}>
        <Container>
          <FormSection
            title="Mixtape Details"
            description="Edit the details of your Mixtape here."
          >
            {errors.root && (
              <div className="col-span-full">
                <p className="text-sm text-red-500">{errors.root.message}</p>
              </div>
            )}
            <FormTextInput name="title" label="Title" />
            <LongFormTextInput
              name="description"
              label="Description"
              description="If you want to add more information about your mixtape, you can do so here."
            />
            <CheckBoxInput
              name="public"
              label="Public"
              description="Public mixtapes are visible and sharable to everyone. Private mixtapes can only be seen by you."
            />

            <div hidden={!isDirty || isSubmitting} className="col-span-full ">
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
                  disabled={Object.keys(errors).length > 0}
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
