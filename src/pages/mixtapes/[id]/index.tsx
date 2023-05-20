import { useAuth, useSignIn } from "@clerk/nextjs";
import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { toString } from "lodash-es";
import Head from "next/head";
import { useRouter } from "next/router";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";
import { SongDisplay } from "~/components/ui/mixtape/song";
import { getMixtape } from "~/server/api/mixtapes";
import { getClientCredentialsToken, getTracks } from "~/server/api/spotify";
import { redis } from "~/server/db";
import { api } from "~/utils/api";

import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import type { Mixtape, Song } from "@prisma/client";
import type { MixtapeSong } from "~/types/song";
import { Button } from "~/components/ui/buttons";
import { MixtapeCoverDesign } from "~/components/mixtape/mixtape";
import { MixtapeSongTable } from "~/components/ui/mixtape/table";
import { useSpotify } from "~/contexts/spotify-player";
import Link from "next/link";

const Page: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { playMixtape } = useSpotify();
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

  const { description } = mixtapesRequest.data;

  const title = mixtapesRequest.data.title || "Untitled Mixtape";
  const isOwner = auth.isSignedIn && auth.userId === mixtapesRequest.data.owner;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <div className="px-4 lg:px-8">
          <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-1 lg:grid-cols-5 lg:gap-8">
            <div className="order-1 h-full w-full lg:col-span-3 lg:pt-16">
              <div className="pb-4 lg:pb-8">
                <h1 className="mt-2 max-w-2xl py-2 text-4xl font-bold leading-7 sm:text-5xl sm:tracking-tight">
                  {title}
                </h1>
                <p>a mixtape by {props.user}</p>
              </div>
              <p hidden={!description} className="prose lg:pb-8">
                {description}
              </p>
              <div className="pt-4 lg:hidden lg:pb-8">
                <button
                  onClick={() => {
                    playMixtape(id);
                  }}
                  className="rounded-lg bg-stone-900 px-4 py-2 text-white"
                >
                  Play on Spotify
                </button>
                <Link
                  href={`/mixtapes/${id}/edit`}
                  passHref
                  className="ml-4"
                  hidden={!isOwner}
                >
                  Edit mixtape
                </Link>
              </div>
              {songs.map((song, i) => {
                return (
                  <SongDisplay
                    mixtape={mixtapesRequest.data}
                    index={i}
                    song={song}
                    key={song.id}
                  />
                );
              })}
            </div>
            <div className="order-first w-full lg:order-2 lg:col-span-2 lg:pt-12">
              <div className="my-4 aspect-video w-full">
                <MixtapeCoverDesign id={id} />
              </div>
              <div className="hidden lg:block">
                <div>
                  <div className="flex items-center pb-4">
                    <button
                      onClick={() => {
                        playMixtape(id);
                      }}
                      className="rounded-lg bg-stone-900 px-4 py-2 text-white"
                    >
                      Play on Spotify
                    </button>
                    <Link
                      href={`/mixtapes/${id}/edit`}
                      passHref
                      className="ml-4"
                      hidden={!isOwner}
                    >
                      Edit mixtape
                    </Link>
                  </div>
                </div>
              </div>
              <div className="sticky top-4 hidden lg:block">
                <MixtapeSongTable songs={songs} />
              </div>
            </div>
          </div>
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
  user: string | null;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const auth = getAuth(context.req);
  const { id } = context.query;
  const parsedId = toString(id);

  const mixtape = await getMixtape(parsedId);
  const cachedTracks = await redis.get<SpotifyApi.MultipleTracksResponse>(
    `spotify:tracks:${parsedId}`
  );

  if (mixtape && cachedTracks) {
    const ownerId = mixtape.owner;
    const owner = await clerkClient.users.getUser(ownerId);

    const isOwnerOrPublic = mixtape.public || ownerId === auth.userId;

    return {
      notFound: !isOwnerOrPublic || !owner,
      props: {
        mixtape,
        songs: cachedTracks,
        user: owner.firstName,
        ...buildClerkProps(context.req),
      },
    };
  }

  if (!mixtape) {
    return {
      notFound: true,
      props: {
        mixtape: null,
        songs: null,
        user: null,
        ...buildClerkProps(context.req),
      },
    };
  }

  const trackIds = mixtape.songs.map((song) => song.spotifyId);
  const tracks = await getTracks(await getClientCredentialsToken(), trackIds);

  await redis.set(`spotify:tracks:${mixtape.id}`, tracks, {
    ex: 60 * 30,
  });

  const ownerId = mixtape.owner;
  const owner = await clerkClient.users.getUser(ownerId);
  const isOwnerOrPublic = mixtape.public || ownerId === auth.userId;

  return {
    notFound: !isOwnerOrPublic || !owner,
    props: {
      mixtape: mixtape ?? null,
      songs: tracks ?? null,
      user: owner.firstName,
      ...buildClerkProps(context.req),
    },
  };
};

export default Page;
