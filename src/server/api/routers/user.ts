import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  deleteSelf: publicProcedure.mutation(async ({ ctx }) => {
    const auth = ctx.auth;

    if (!auth || !auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    await ctx.prisma.song.deleteMany({
      where: {
        Mixtape: {
          owner: auth.userId,
        },
      },
    });

    const mixtapeIds = await ctx.prisma.mixtape.findMany({
      where: {
        owner: auth.userId,
      },
      select: {
        id: true,
      },
    });

    await ctx.prisma.mixtape.deleteMany({
      where: {
        owner: auth.userId,
      },
    });

    await ctx.redis.del(`mixtapes:${auth.userId}`);

    for (const mixtapeId of mixtapeIds) {
      await ctx.redis.del(`mixtape:${mixtapeId.id}`);
      await ctx.redis.del(`spotify:tracks:${mixtapeId.id}`);
    }

    await clerkClient.users.deleteUser(auth.userId);
    return true;
  }),
});
