import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const Home: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="flex flex-col gap-8 text-center">
              <h1 className="text-center font-serif text-4xl font-bold sm:text-6xl">
                Experience the magic of mixtapes with Spotify
              </h1>
              <p className="text-lg leading-8 tracking-wide">
                Looking to express yourself through music? Curate a personalized
                musical experience that&apos;s a reflection of your feelings and
                memories.
              </p>
              <div className="flex flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-in"
                  className="rounded-full bg-stone-700 px-4 py-2 font-bold text-stone-100"
                >
                  Get Started
                </Link>
                <Link href="/about" className="font-bold">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </Container>
        <main>
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
