import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getClientCredentialsToken, getTracks } from "../spotify";
import { compact, isEmpty } from "lodash-es";
import { deleteMixtape, getMixtape } from "../mixtapes";
import { EditMixtapeSchema } from "~/schema/mixtape";
import { Mixtape, Song } from "@prisma/client";

export const mixtapesRouter = createTRPCRouter({
  getMixtape: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const mixtape = await getMixtape(input.id);

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

    const cache = await ctx.redis.get<Mixtape[]>("mixtapes:" + auth.userId);

    if (cache) {
      return cache;
    }

    const mixtapes = await ctx.prisma.mixtape.findMany({
      where: {
        owner: auth.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await ctx.redis.set("mixtapes:" + auth.userId, mixtapes, {
      ex: 60 * 60 * 12,
    });

    return mixtapes;
  }),
  pagedMixtapes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth;

      if (!auth || !auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const cache = await ctx.redis.get<Mixtape[]>(
        `mixtapes:${auth.userId}:${input.offset}:${input.limit}`
      );

      if (cache) {
        return cache;
      }

      const mixtapes = await ctx.prisma.mixtape.findMany({
        where: {
          owner: auth.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: input.offset,
        take: input.limit,
      });

      await ctx.redis.set(
        `mixtapes:${auth.userId}:${input.offset}:${input.limit}`,
        mixtapes,
        {
          ex: 60,
        }
      );

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

      const verifyRequest = await getTracks(
        await getClientCredentialsToken(),
        input.songs
      );

      if (compact(verifyRequest.tracks).length !== input.songs.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid song IDs",
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

      await ctx.redis.del("mixtapes:" + auth.userId);

      return mixtape;
    }),
  deleteMixtape: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth;

      if (!auth || !auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

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

      if (mixtape.owner !== auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      await ctx.redis.del("mixtapes:" + auth.userId);
      await deleteMixtape(mixtape.id);

      return true;
    }),
  editMixtape: publicProcedure
    .input(
      z.object({
        id: z.string(),
        mixtape: EditMixtapeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const auth = ctx.auth;

      if (!auth || !auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const mixtape = await ctx.prisma.mixtape.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!mixtape) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (mixtape.owner !== auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const updatedMixtape = await ctx.prisma.mixtape.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.mixtape,
          title: isEmpty(input.mixtape.title) ? null : input.mixtape.title,
          description: isEmpty(input.mixtape.description)
            ? null
            : input.mixtape.description,
        },
        include: {
          songs: true,
        },
      });

      await ctx.redis.set(`mixtape:${input.id}`, updatedMixtape, {
        ex: 60 * 60 * 12,
      });
      await ctx.redis.del("mixtapes:" + auth.userId);

      return updatedMixtape;
    }),
});
