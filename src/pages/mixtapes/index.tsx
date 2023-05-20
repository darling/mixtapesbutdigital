import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";
import { MixtapeCoverDesign } from "~/components/mixtape/mixtape";

const Page: NextPage = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  const mixtapesRequest = api.mixtapes.getMixtapes.useQuery();

  const deletedMixtape = api.mixtapes.deleteMixtape.useMutation();

  const handleDelete = async (id: string) => {
    const res = await deletedMixtape.mutateAsync({ id });
    console.log(res);
    await mixtapesRequest.refetch();
  };

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="text-4xl font-bold">Mixtapes</h1>
          <div className="grid gap-8 lg:grid-cols-2">
            {mixtapesRequest.data?.map((mixtape) => {
              return (
                <div key={mixtape.id}>
                  <Link href={`/mixtapes/${mixtape.id}`}>
                    <div className="flex rounded-lg p-4 hover:bg-stone-300">
                      <div className="aspect-square h-12 w-12 flex-shrink-0">
                        <MixtapeCoverDesign
                          id={mixtape.id}
                          tiny
                          highPerformance
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="text-lg font-bold">{mixtape.title}</h2>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
