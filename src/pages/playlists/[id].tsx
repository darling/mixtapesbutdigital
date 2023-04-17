import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Container } from "~/components/ui/container";
import { Layout } from "~/components/layout";
import { useState } from "react";
import { TrackSelection } from "~/components/ui/spotify/track-selection";
import { InformationCircleIcon, UsersIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import * as Dialog from "@radix-ui/react-dialog";
import { BackButton } from "~/components/ui/back";

const Page: NextPage = () => {
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
      title: spotifyRequest.data?.name,
    });

    setPostCreationAlert(true);
  };

  const [postCreationAlert, setPostCreationAlert] = useState(true);

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Dialog.Root open={postCreationAlert} onOpenChange={setPostCreationAlert}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <div className="rounded-md bg-white p-4 shadow-lg">
            <Dialog.Title className="text-lg font-medium">
              Mixtape created
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Your mixtape has been created. You can find it in your profile.
            </Dialog.Description>
            <div className="mt-4 flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Close
                </button>
              </Dialog.Close>
              <Link
                href={`/mixtapes/${mixtapes.data?.id ?? ""}`}
                type="button"
                className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to mixtape
              </Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      <Layout>
        <Container>
          <div className="grid gap-4">
            <BackButton href="/playlists">Return to playlists</BackButton>
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {spotifyRequest.data?.name}
                </h1>
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {spotifyRequest.data?.tracks.total} songs
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <InformationCircleIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    {spotifyRequest.data?.public ? "Public" : "Private"}{" "}
                    playlist
                  </div>
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span className="rounded-md shadow-sm">
                  <a
                    href={spotifyRequest.data?.external_urls.spotify}
                    type="button"
                    className="inline-flex items-center rounded-md border border-stone-400 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    On Spotify
                  </a>
                </span>

                <span className="ml-3 rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={createMixtape}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={selectedSongs.length <= 0}
                  >
                    Create Mixtape
                  </button>
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm italic">
                Select up to 5 songs from this playlist to create a mixtape. You
                won&apos;t be able to reorder the songs, however you can always
                edit the other parts of the mixtape after it&apos;s created.
              </p>
            </div>
            <div className="grid gap-4">
              {spotifyRequest.data?.tracks.items.map((track, i) => {
                const item = track.track;
                if (!item) return <></>;

                const selectHandler = () => {
                  // Do not allow duplicates or more than 5 songs to be selected
                  if (
                    selectedSongs.length >= 5 ||
                    selectedSongs.includes(item.id)
                  ) {
                    // remove the song from the list
                    setSelectedSongs(
                      selectedSongs.filter((id) => id !== item.id)
                    );
                    return;
                  }
                  setSelectedSongs([...selectedSongs, item.id]);
                };

                return (
                  <div className="w-full" key={item.id}>
                    <TrackSelection
                      track={item}
                      onSelect={selectHandler}
                      selectedIds={selectedSongs}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
