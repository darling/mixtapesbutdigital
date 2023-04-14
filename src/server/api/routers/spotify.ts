import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import {
  PlaylistFullSchema,
  CurrentUsersPlaylistsResponseSchema,
} from "~/schema/spotify";

export const spotifyRouter = createTRPCRouter({
  getPlaylists: publicProcedure.query(async ({ ctx }) => {
    const auth = ctx.auth;

    if (!auth || !auth.sessionId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const session = await clerkClient.users.getUserOauthAccessToken(
      auth.userId,
      "oauth_spotify"
    );

    const firstItem = session[0] ?? null;
    if (!firstItem) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const response =
      await axios.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
        "https://api.spotify.com/v1/me/playlists?limit=50",
        {
          headers: {
            Authorization: `Bearer ${firstItem.token}`,
          },
        }
      );

    // parse data with zod
    const parsed = CurrentUsersPlaylistsResponseSchema.parse(response.data);
    return parsed;
  }),
  getPlaylist: publicProcedure
    .input(
      z.object({
        playlistId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const auth = ctx.auth;
      const { playlistId } = input;

      if (!auth || !auth.sessionId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const session = await clerkClient.users.getUserOauthAccessToken(
        auth.userId,
        "oauth_spotify"
      );

      const firstItem = session[0] ?? null;
      if (!firstItem) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const response = await axios.get<SpotifyApi.SinglePlaylistResponse>(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${firstItem.token}`,
          },
        }
      );

      // parse data with zod
      const parsed = PlaylistFullSchema.parse(response.data);
      return parsed;
    }),
});
