import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { first } from "lodash-es";
import { Layout } from "~/components/layout";

const Page: NextPage = () => {
  const spotifyRequest = api.spotify.getPlaylists.useQuery();

  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <h1 className="text-4xl font-bold">Playlists</h1>
        <Link href="/">Back</Link>
        {/* <pre>
          <code>{JSON.stringify(spotifyRequest, null, 2)}</code>
        </pre> */}
        {isSignedIn ? <p>Hi {user.id}.</p> : <p>Not signed in</p>}
        <div className="max-w-4xl">
          <div className="grid grid-cols-4">
            {spotifyRequest.data?.items.map((playlist) => {
              return (
                <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={first(playlist.images)?.url}
                    alt={playlist.name}
                    className="w-full"
                  />
                  <p>{playlist.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
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
