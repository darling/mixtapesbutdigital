import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
  type NextPage,
} from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";
import { useRouter } from "next/router";
import { toString } from "lodash-es";
import type { Mixtape, Song } from "@prisma/client";
import { prisma } from "~/server/db";
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";
import { MixtapeSong } from "~/types/song";
import { SongDisplay } from "~/components/ui/mixtape/song";

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
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

  const playMixtapeOnSpotify = () => {
    mutation.mutate({
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
          <h1 className="text-4xl font-bold">A Mixtape</h1>
          <button
            className="rounded bg-green-500 p-2 text-white"
            onClick={playMixtapeOnSpotify}
          >
            Play on Spotify
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
