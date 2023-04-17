import { toString } from "lodash-es";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";
import { SongDisplay } from "~/components/ui/mixtape/song";
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

import type { Mixtape, Song } from "@prisma/client";
import type { MixtapeSong } from "~/types/song";
import { useAuth, useSignIn } from "@clerk/nextjs";

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { signIn } = useSignIn();
  const auth = useAuth();
  const router = useRouter();
  const id = toString(router.query.id);

  const mixtapesRequest = api.mixtapes.getMixtape.useQuery(
    {
      id,
    },
    {
      enabled: !!router.query.id,
      initialData: props.mixtape,
    }
  );

  const songsRequest = api.spotify.getTracks.useQuery(
    {
      trackIds: mixtapesRequest.data?.songs.map((song) => song.spotifyId) || [],
    },
    {
      enabled: !!mixtapesRequest.data?.songs,
      initialData: props.songs,
    }
  );

  if (mixtapesRequest.isLoading || songsRequest.isLoading)
    return <Layout>Loading...</Layout>;

  if (!mixtapesRequest.data || !songsRequest.data)
    return <Layout>Not found. Please report this error.</Layout>;

  const mutation = api.spotify.playTracks.useMutation();

  const playMixtapeOnSpotify = async () => {
    if (!auth.isSignedIn) {
      await signIn?.authenticateWithRedirect({
        strategy: "oauth_spotify",
        redirectUrl: `/mixtapes/${id}`,
        redirectUrlComplete: `/mixtapes/${id}`,
      });
      return;
    }

    await mutation.mutateAsync({
      trackIds: mixtapesRequest.data.songs.map((song) => song.spotifyId),
    });
  };

  const songs: MixtapeSong[] = mixtapesRequest.data.songs.map((song) => {
    const trackData = songsRequest.data.tracks.find(
      (spotifySong) => spotifySong.id === song.spotifyId
    );

    if (!trackData) throw new Error("Track data not found");

    return {
      ...song,
      track: trackData,
    };
  });

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="text-4xl font-bold">
            {mixtapesRequest.data.title || "Untitled Mixtape"}
          </h1>
          <button
            className="rounded bg-green-500 p-2 text-white"
            onClick={() => {
              playMixtapeOnSpotify().catch((err) => {
                console.error(err);
              });
            }}
          >
            {auth.isSignedIn ? "Play on Spotify" : "Sign in with Spotify"}
          </button>
        </Container>
        <div className="flex flex-col">
          {songs.map((song, i) => (
            <SongDisplay key={song.id} song={song} index={i} />
          ))}
        </div>
      </Layout>
    </>
  );
};

interface PageProps {
  mixtape:
    | (Mixtape & {
        songs: Song[];
      })
    | null;
  songs: SpotifyApi.MultipleTracksResponse | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const { id } = context.query;
  const parsedId = toString(id);

  const mixtape = await prisma.mixtape.findUnique({
    where: {
      id: parsedId,
    },
    include: {
      songs: true,
    },
  });

  if (!mixtape) {
    return {
      notFound: true,
      props: {
        mixtape: null,
        songs: null,
      },
    };
  }

  const songs = await getTracks(
    await getClientCredentialsToken(),
    mixtape.songs.map((song) => song.spotifyId)
  );

  return {
    props: {
      mixtape: mixtape ?? null,
      songs: songs ?? null,
    },
  };
};

export default Page;
