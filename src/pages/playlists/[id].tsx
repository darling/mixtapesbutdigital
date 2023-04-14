import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const Page: NextPage = () => {
  const { query } = useRouter();
  const id = query.id as string;

  const spotifyRequest = api.spotify.getPlaylist.useQuery({
    playlistId: id,
  });

  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <main>
        <h1 className="text-4xl font-bold">{spotifyRequest.data?.name}</h1>
        <Link href="/playlists">Back</Link>
        {/* <pre>
          <code>{JSON.stringify(spotifyRequest, null, 2)}</code>
        </pre> */}
        {isSignedIn ? <p>Hi {user.id}.</p> : <p>Not signed in</p>}
        <pre>
          <code>{JSON.stringify(spotifyRequest, null, 2)}</code>
        </pre>
        <div className="max-w-4xl">
          <div className="grid grid-cols-4"></div>
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
      </main>
    </>
  );
};

export default Page;
