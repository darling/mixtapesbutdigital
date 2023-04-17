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
          <div className="grid grid-cols-2 gap-8">
            {mixtapesRequest.data?.map((mixtape) => {
              return (
                <div key={mixtape.id}>
                  <Link href={`/mixtapes/${mixtape.id}`}>
                    <div className="h-32 bg-stone-200">
                      {mixtape.title || "Untitled Mixtape"}
                    </div>
                  </Link>
                  <div>
                    <button
                      onClick={() => {
                        handleDelete(mixtape.id).catch((e) => {
                          console.error(e);
                        });
                      }}
                    >
                      Delete
                    </button>
                  </div>
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
