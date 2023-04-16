import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import {
  PlaylistFullSchema,
  CurrentUsersPlaylistsResponseSchema,
} from "~/schema/spotify";
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";

export const spotifyRouter = createTRPCRouter({
  getPlaylists: publicProcedure
    .input(
      z
        .object({
          page: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
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
            params: {
              offset: input?.page ? input.page * 50 : 0,
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
  getTracks: publicProcedure
    .input(
      z.object({
        trackIds: z.array(z.string()).min(1).max(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { trackIds } = input;
      const auth = ctx.auth;
      let token;

      if (!auth || !auth.sessionId) {
        token = await getClientCredentialsToken();
      } else {
        const session = await clerkClient.users.getUserOauthAccessToken(
          auth.userId,
          "oauth_spotify"
        );

        const firstItem = session[0] ?? null;
        if (!firstItem) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        token = firstItem.token;
      }

      return getTracks(token, trackIds);
    }),
  playTracks: publicProcedure
    .input(
      z.object({
        trackIds: z.array(z.string()).min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { trackIds } = input;
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

      // set shuffle to false

      // await axios.put(
      //   "https://api.spotify.com/v1/me/player/shuffle",
      //   {
      //     state: false,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${firstItem.token}`,
      //     },
      //   }
      // );

      await axios.put<SpotifyApi.PlayHistoryObject>(
        "https://api.spotify.com/v1/me/player/play",
        {
          uris: trackIds.map((id) => `spotify:track:${id}`),
        },
        {
          headers: {
            Authorization: `Bearer ${firstItem.token}`,
          },
        }
      );

      return {
        message: "success",
      };
    }),
});
