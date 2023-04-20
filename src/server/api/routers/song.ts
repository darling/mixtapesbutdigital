import { TRPCError } from "@trpc/server";
import { isEmpty } from "lodash-es";
import { z } from "zod";
import { EditSongSchema } from "~/schema/song";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const songRouter = createTRPCRouter({
  editSong: publicProcedure
    .input(
      z.object({
        id: z.string(),
        song: EditSongSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth;

      if (!auth || !auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const song = await ctx.prisma.song.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Mixtape: true,
        },
      });

      if (!song) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (song.Mixtape.owner !== auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const updatedSong = await ctx.prisma.song.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.song,
          pre_description: isEmpty(input.song.pre_description)
            ? null
            : input.song.pre_description,
          post_description: isEmpty(input.song.post_description)
            ? null
            : input.song.post_description,
        },
      });

      await ctx.redis.del(`mixtape:${song.Mixtape.id}`);

      return updatedSong;
    }),
});
