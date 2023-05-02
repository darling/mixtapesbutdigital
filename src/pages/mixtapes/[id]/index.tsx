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
import Link from "next/link";
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

  const title = mixtapesRequest.data.title || "Untitled Mixtape";
  const isOwner = auth.isSignedIn && auth.userId === mixtapesRequest.data.owner;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Layout>
        <Container>
          <div className="my-12">
            <h1 className="pb-4 text-4xl font-bold leading-tight tracking-tight">
              {title}
            </h1>
            <p
              className="prose prose-xl"
              hidden={!mixtapesRequest.data.description}
            >
              {mixtapesRequest.data.description}
            </p>
          </div>
        </Container>
        <Container>
          <div>
            <Button.Basic
              onClick={() => {
                playMixtapeOnSpotify().catch((err) => {
                  console.error(err);
                });
              }}
            >
              {auth.isSignedIn ? "Play on Spotify" : "Sign in with Spotify"}
            </Button.Basic>
            {isOwner && (
              <Link
                className="ml-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-stone-900 shadow-sm ring-1 ring-inset ring-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                href={`/mixtapes/${id}/edit`}
              >
                Edit
              </Link>
            )}
          </div>
        </Container>
        <div className="flex flex-col">
          {songs.map((song, i) => (
            <SongDisplay
              key={song.id}
              song={song}
              index={i}
              mixtape={mixtapesRequest.data}
            />
          ))}
        </div>
        <Container>
          <div className="grid grid-cols-2 gap-4">
            <div className="prose">
              <h2>What is this?</h2>
              <p>
                This is a mixtape. It&apos;s a collection of songs that someone
                has put together for you to listen to. You can listen to it on
                Spotify by clicking the button above.
              </p>
              <p>
                The songs on each mixtape from this site can&apos;t be changed,
                and each mixtape is unique.
              </p>
              <p>
                Learn more about how this works <Link href="/about">here</Link>.
              </p>
            </div>
            <div className="prose">
              <h2>Share</h2>
              <p>
                You can share this mixtape with anyone by sending them this
                link:
              </p>
              <div className="flex">
                <span className="flex select-all items-center truncate rounded-l-md border-y border-l border-stone-300 bg-white pl-2 shadow-sm">
                  https://mixtapesbut.digital/mixtapes/{id}
                </span>
                <Button.Basic
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`https://mixtapesbut.digital/mixtapes/${id}`)
                      .catch(console.error);
                  }}
                  className="inline flex-shrink-0 rounded-l-none"
                >
                  Copy Link
                </Button.Basic>
              </div>
            </div>
          </div>
        </Container>
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
