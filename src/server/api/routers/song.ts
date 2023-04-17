import { TRPCError } from "@trpc/server";
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
        },
      });

      return updatedSong;
    }),
});
