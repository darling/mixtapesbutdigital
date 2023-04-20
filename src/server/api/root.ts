import { createTRPCRouter } from "~/server/api/trpc";
import { spotifyRouter } from "~/server/api/routers/spotify";
import { mixtapesRouter } from "~/server/api/routers/mixtapes";
import { songRouter } from "~/server/api/routers/song";
import { userRouter } from "~/server/api/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  mixtapes: mixtapesRouter,
  song: songRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
