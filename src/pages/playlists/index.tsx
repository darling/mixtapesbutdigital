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
              To create a mixtape you need to first collect the 5 songs you want
              in a Spotify playlist. Then, you can create a mixtape from that
              playlist.
            </p>
          </div>
        </Container>
        <Container>
          <div className="grid grid-cols-2 gap-4">
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
                        />
                      </div>
                      <p className="truncate">{playlist.name}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <Pagination
            currentIndex={page}
            totalPages={totalPages}
            onPageChange={(page) => {
              setPage(page);
            }}
          />
        </Container>
      </Layout>
    </>
  );
};

export default Page;
