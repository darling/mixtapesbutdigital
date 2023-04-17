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
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

import type { Mixtape, Song } from "@prisma/client";
import type { MixtapeSong } from "~/types/song";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { BackButton } from "~/components/ui/back";
import { MixtapeForm } from "~/components/ui/mixtape/edit/mixtape-form";
import { Button } from "~/components/ui/buttons";

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
      mixtapeId: id,
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
      mixtapeId: id,
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
          <BackButton href={`/mixtapes/${id}`}>Return to mixtape</BackButton>
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
                Editing: {mixtapesRequest.data.title || "Untitled Mixtape"}
              </h2>
            </div>
            <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0">
              <Button.Basic
                onClick={() => {
                  playMixtapeOnSpotify().catch((err) => {
                    console.error(err);
                  });
                }}
              >
                Play on Spotify
              </Button.Basic>
              <Button.Primary className="ml-2">Save</Button.Primary>
            </div>
          </div>
        </Container>
        <MixtapeForm mixtape={mixtapesRequest.data} />
        {/* TODO: Create forms for these bad boys */}
        {songs.map((song) => (
          <div key={song.id}>
            {song.track.name} -{" "}
            {song.track.artists.map((artist) => artist.name).join(", ")}
          </div>
        ))}
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
  const { userId } = getAuth(context.req);
  const { id } = context.query;
  const parsedId = toString(id);

  if (!userId) {
    return {
      redirect: {
        destination: `/sign-in?redirect=/mixtapes/${parsedId}/edit`,
        permanent: false,
      },
      props: {
        mixtape: null,
        songs: null,
        ...buildClerkProps(context.req),
      },
    };
  }

  const mixtape = await prisma.mixtape.findUnique({
    where: {
      id: parsedId,
    },
    include: {
      songs: true,
    },
  });

  if (!mixtape || mixtape.owner !== userId) {
    return {
      notFound: true,
      props: {
        mixtape: null,
        songs: null,
        ...buildClerkProps(context.req),
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
      ...buildClerkProps(context.req),
    },
  };
};

export default Page;
