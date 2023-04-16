import { createTRPCRouter } from "~/server/api/trpc";
import { spotifyRouter } from "~/server/api/routers/spotify";
import { mixtapesRouter } from "~/server/api/routers/mixtapes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  mixtapes: mixtapesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
