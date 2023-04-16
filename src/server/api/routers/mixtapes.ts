import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mixtapesRouter = createTRPCRouter({
  getMixtape: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const mixtape = await ctx.prisma.mixtape.findUnique({
        where: {
          id: input.id,
        },
        include: {
          songs: true,
        },
      });

      if (!mixtape) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return mixtape;
    }),
  getMixtapes: publicProcedure.query(async ({ ctx }) => {
    const auth = ctx.auth;

    if (!auth || !auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const mixtapes = await ctx.prisma.mixtape.findMany({
      where: {
        owner: auth.userId,
      },
    });

    return mixtapes;
  }),
  createMixtape: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        songs: z.array(z.string()).max(5).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth;

      if (!auth || !auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const mixtape = await ctx.prisma.mixtape.create({
        data: {
          title: input.title,
          owner: auth.userId,
          songs: {
            createMany: {
              data: input.songs.map((songId) => ({
                spotifyId: songId,
              })),
            },
          },
        },
      });

      return mixtape;
    }),
});
