import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { ceil, first } from "lodash-es";
import { Layout } from "~/components/layout";
import { useEffect, useState } from "react";
import { Container } from "~/components/ui/container";
import { PageHeader } from "~/components/reusable/PageHeader";
import { Pagination } from "~/components/ui/pagination";

const Page: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const spotifyRequest = api.spotify.getPlaylists.useQuery(
    {
      page,
    },
    {
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );

  useEffect(() => {
    if (spotifyRequest.data) {
      setTotalPages(ceil(spotifyRequest.data.total / 50));
    }
    return;
  }, [page, spotifyRequest.data]);

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <div className="py-12">
            <PageHeader title="Create a Mixtape" />
            <p>
              To create a mixtape you need to first collect up to 5 songs you
              want inside a Spotify playlist. Then, you can create a mixtape
              from that playlist.
            </p>
          </div>
        </Container>
        <Container>
          <div hidden={spotifyRequest.isLoading}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              {spotifyRequest.data?.items.map((playlist) => {
                return (
                  <div className="" key={playlist.id}>
                    <Link href={`/playlists/${playlist.id}`}>
                      <div className="">
                        <div className="aspect-square overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={first(playlist.images)?.url}
                            alt={playlist.name}
                            className="h-full w-full bg-stone-200 object-cover"
                          />
                        </div>
                        <p className="pointer-events-none mt-2 block truncate text-sm font-medium">
                          {playlist.name}
                        </p>
                        <p className="pointer-events-none block text-sm font-medium text-stone-500">
                          {playlist.tracks.total} song
                          {playlist.tracks.total > 1 && "s"}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div hidden={!spotifyRequest.isLoading}>
            <div className="animate-pulse">Loading...</div>
          </div>
          <div className="mt-12">
            <Pagination
              currentIndex={page}
              totalPages={totalPages}
              onPageChange={(page) => {
                setPage(page);
              }}
            />
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
