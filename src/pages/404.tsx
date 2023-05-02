import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
            <div className="flex flex-col gap-8 text-center">
              <h1 className="text-center text-4xl font-bold sm:text-6xl">
                Lost?
              </h1>
              <p className="text-lg leading-8 tracking-wide">
                This page doesn&apos;t exist.
              </p>
              <div className="flex flex-row items-center justify-center gap-4">
                <Link href="/about" className="font-bold">
                  Go Home →
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Home;
