import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const Page: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const mixtapesRequest = api.mixtapes.getMixtapes.useQuery();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="text-4xl font-bold">Mixtapes</h1>
          <div className="grid grid-cols-4">
            {mixtapesRequest.data?.map((mixtape) => {
              return (
                <Link href={`/mixtapes/${mixtape.id}`} key={mixtape.id}>
                  <div className="p-4">
                    {mixtape.title} {mixtape.id}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
