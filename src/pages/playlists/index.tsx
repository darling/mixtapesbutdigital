import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { ceil, first } from "lodash-es";
import { Layout } from "~/components/layout";
import { useEffect, useState } from "react";
import { Container } from "~/components/ui/container";

const Page: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const spotifyRequest = api.spotify.getPlaylists.useQuery({
    page,
  });

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
        <h1 className="text-4xl font-bold">Playlists</h1>
        <Link href="/">Back</Link>
        {isSignedIn ? <p>Hi {user.id}.</p> : <p>Not signed in</p>}
        <Container>
          <div>
            <p>
              Page {page + 1} of {totalPages}
            </p>
            <button
              onClick={() => {
                if (page > 0) setPage(page - 1);
              }}
            >
              Previous Page
            </button>
            <button
              onClick={() => {
                if (page < totalPages - 1) setPage(page + 1);
              }}
            >
              Next Page
            </button>
          </div>
          <div className="grid grid-cols-4">
            {spotifyRequest.data?.items.map((playlist) => {
              return (
                <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first(playlist.images)?.url}
                    alt={playlist.name}
                    className="aspect-square w-full overflow-hidden"
                  />
                  <p className="truncate">{playlist.name}</p>
                </Link>
              );
            })}
          </div>
        </Container>
        <img src={user?.profileImageUrl} alt="Profile Picture" />
        <Link href="/sign-in">Sign In</Link>
        <Link href="/sign-up">Sign Up</Link>
        <button
          onClick={() => {
            signOut().catch((err) => console.error(err));
          }}
        >
          Sign Out
        </button>
      </Layout>
    </>
  );
};

export default Page;
