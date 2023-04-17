import { z } from "zod";

export const EditSongSchema = z
  .object({
    pre_description: z.string().max(2048).optional().nullable(),
    post_description: z.string().max(2048).optional().nullable(),
  })
  .strict();
