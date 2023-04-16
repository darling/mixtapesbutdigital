import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Container } from "~/components/ui/container";
import { Layout } from "~/components/layout";
import { useState } from "react";

const Page: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const { query } = useRouter();
  const id = query.id as string;

  const spotifyRequest = api.spotify.getPlaylist.useQuery(
    {
      playlistId: id,
    },
    {
      enabled: !!id,
    }
  );

  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const mixtapes = api.mixtapes.createMixtape.useMutation();
  const createMixtape = () => {
    mixtapes.mutate({
      songs: selectedSongs,
    });
  };

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="text-4xl font-bold">{spotifyRequest.data?.name}</h1>
          <Link href="/playlists">Back</Link>
          <div>
            <pre>
              <code>{JSON.stringify(selectedSongs, null, 2)}</code>
            </pre>
          </div>
          <button onClick={createMixtape}>Create</button>
          <div className="grid gap-4">
            {spotifyRequest.data?.tracks.items.map((track, i) => {
              return (
                <button
                  onClick={() => {
                    // Do not allow duplicates or more than 5 songs to be selected
                    if (
                      selectedSongs.length >= 5 ||
                      selectedSongs.includes(track.track.id)
                    ) {
                      // remove the song from the list
                      setSelectedSongs(
                        selectedSongs.filter((id) => id !== track.track.id)
                      );
                      return;
                    }

                    setSelectedSongs([...selectedSongs, track.track.id]);
                  }}
                  className="flex flex-row gap-4 text-left"
                  key={track.track.id}
                >
                  <div className="w-4 text-right font-mono">{i + 1}</div>
                  <div className="flex flex-col">
                    <p>{track.track.name}</p>
                    <p className="text-sm text-gray-700">
                      {track.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <pre>
            <code>{JSON.stringify(spotifyRequest, null, 2)}</code>
          </pre>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
