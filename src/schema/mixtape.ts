import { z } from "zod";

export const EditMixtapeSchema = z
  .object({
    title: z.string().max(128).optional().nullable(),
    description: z.string().max(2048).optional().nullable(),
    public: z.boolean(),
  })
  .strict();
