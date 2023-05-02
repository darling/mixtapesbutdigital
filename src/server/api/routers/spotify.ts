import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";
import { getMixtape } from "../mixtapes";
import { chain } from "lodash-es";

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

      return response.data;
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

      return response.data;
    }),
  getTracks: publicProcedure
    .input(
      z.object({
        mixtapeId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const mixtape = await getMixtape(input.mixtapeId);

      if (!mixtape) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const cache = await ctx.redis.get<SpotifyApi.MultipleTracksResponse>(
        `spotify:tracks:${mixtape.id}`
      );

      if (cache) {
        return cache;
      }

      const trackIds = mixtape.songs.map((song) => song.spotifyId);
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

      const freshTracks = await getTracks(token, trackIds);

      await ctx.redis.set(`spotify:tracks:${mixtape.id}`, freshTracks, {
        ex: 60 * 30,
      });

      return freshTracks;
    }),
  playTracks: publicProcedure
    .input(
      z.object({
        mixtapeId: z.string(),
        trackIndex: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const mixtape = await getMixtape(input.mixtapeId);

      if (!mixtape) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const trackIds = mixtape.songs.map((song) => song.spotifyId);

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

      const uris = chain(trackIds)
        .map((id) => `spotify:track:${id}`)
        .slice(input.trackIndex ?? 0)
        .value();

      await axios.put<SpotifyApi.PlayHistoryObject>(
        "https://api.spotify.com/v1/me/player/play",
        {
          uris,
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
