import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "~/components/layout";

const Home: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <main>
          <h1 className="text-4xl font-bold">Welcome to T3!</h1>
          {isSignedIn ? (
            <div>
              <p>Hi {user.firstName}.</p>
              <div>
                <Link href="/playlists">Playlists</Link>
              </div>
            </div>
          ) : (
            <p>Not signed in</p>
          )}
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
      </Layout>
    </>
  );
};

export default Home;
