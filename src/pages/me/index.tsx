import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/layout";
import { PageHeader } from "~/components/reusable/PageHeader";
import { Button } from "~/components/ui/buttons";
import { Container } from "~/components/ui/container";
import { api } from "~/utils/api";

const Page: NextPage = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const userMutation = api.user.deleteSelf.useMutation();

  const handleDelete = async () => {
    await userMutation.mutateAsync();
    await signOut();
  };

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <div className="py-12">
            <PageHeader title={user?.fullName || "..."} />
          </div>
        </Container>
        <Container>
          <div className="grid gap-12">
            <div className="sm:rounded-lg">
              <div className="">
                <h3 className="text-base font-semibold leading-6 text-stone-800">
                  Thank you
                </h3>
                <div className="mt-2 max-w-xl text-sm text-stone-500">
                  <p>
                    It&apos;s awesome having you as part of our community, and I
                    hope you&apos;re enjoying creating and sharing mixtapes as
                    much as I enjoyed building the platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="sm:rounded-lg">
              <div className="">
                <h3 className="text-base font-semibold leading-6 text-stone-800">
                  Manage your account
                </h3>
                <div className="mt-5">
                  <Button.Basic
                    onClick={() => {
                      signOut().catch(console.error);
                    }}
                  >
                    Sign Out
                  </Button.Basic>
                  <Button.Basic className="ml-2" disabled>
                    Manage on Spotify
                  </Button.Basic>
                </div>
              </div>
            </div>
            <div className="sm:rounded-lg">
              <div className="">
                <h3 className="text-base font-semibold leading-6 text-stone-800">
                  Delete your account
                </h3>
                <div className="mt-2 max-w-xl text-sm">
                  <p>
                    Deleting your account will permanently remove all of your
                    data.
                  </p>
                  <p>This action cannot be undone.</p>
                </div>
                <div className="mt-5">
                  <Button.Danger
                    onClick={() => {
                      handleDelete().catch(console.error);
                    }}
                  >
                    Delete Account
                  </Button.Danger>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
