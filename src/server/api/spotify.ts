import axios from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";
import { redis } from "~/server/db";

export const getClientCredentialsToken = async () => {
  const date = new Date().getTime();

  // check if token is cached with timestamp
  const cachedToken = await redis.get<string>("spotify:token");
  const cachedTimestamp = await redis.get<number>("spotify:timestamp");

  if (cachedToken && cachedTimestamp && cachedTimestamp > date) {
    return cachedToken;
  }

  const clientId = env.SPOTIFY_CLIENT_ID;
  const clientSecret = env.SPOTIFY_CLIENT_SECRET;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const req = axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const res = await req;

    const token = z
      .object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in: z.number(),
      })
      .parse(res.data);

    await redis.set("spotify:token", token.access_token, {
      ex: token.expires_in - 60,
    });
    await redis.set("spotify:timestamp", date + token.expires_in, {
      ex: token.expires_in - 60,
    });

    return token.access_token;

    // cache token for 1 hour
  } catch (error) {
    // throw error
    console.log(error);
    throw error;
  }
};

export const getTracks = async (token: string, ids: string[]) => {
  try {
    const request = await axios.get<SpotifyApi.MultipleTracksResponse>(
      "https://api.spotify.com/v1/tracks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: ids.join(","),
        },
      }
    );

    return request.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
