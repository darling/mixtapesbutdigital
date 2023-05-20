import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Layout } from "~/components/layout";
import { MixtapeCoverDesign } from "~/components/mixtape/mixtape";
import { Container } from "~/components/ui/container";
import { api } from "~/utils/api";

const randomString32Length = () => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 32; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const Home: NextPage = () => {
  const mixtapesResolver = api.mixtapes.getMixtapes.useQuery();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <div className="">
          <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-2 bg-red-500">
            <div className="h-full w-full bg-orange-400">
              <div>
                <h1>Hello, world!</h1>
              </div>
            </div>
            <div className="h-full w-full">
              <img
                src="https://placehold.co/640"
                alt="https://placehold.co/640"
              />
            </div>
          </div>
        </div>
        <Container>
          {mixtapesResolver.isLoading ? (
            <div>Loading...</div>
          ) : mixtapesResolver.isError ? (
            <div>Error: {mixtapesResolver.error.message}</div>
          ) : (
            <>
              <div className="grid min-h-screen grid-cols-3">
                {mixtapesResolver.data?.map((mixtape) => (
                  <div key={mixtape.id}>
                    <div className="aspect-square w-full">
                      <MixtapeCoverDesign id={mixtape.id} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </Layout>
      {/* <Layout>
        <Container>
          <h1>Test</h1>
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={generateRandomString}
          >
            Generate new seed
          </button>
          <div>
            <p className="text-base text-gray-700">{randomString}</p>
          </div>
          <div className="aspect-square w-44">
            <MixtapeCoverDesign id={randomString || "none"} />
          </div>
        </Container>
      </Layout> */}
    </>
  );
};

export default Home;
