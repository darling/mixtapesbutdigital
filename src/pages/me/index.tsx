import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/layout";
import { PageHeader } from "~/components/reusable/PageHeader";
import { Button } from "~/components/ui/buttons";
import { Container } from "~/components/ui/container";
import { api } from "~/utils/api";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

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
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                        Delete Account
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-stone-900 bg-opacity-25 backdrop-blur-sm transition-opacity" />
                      <AlertDialog.Content className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <div className="relative transform overflow-hidden rounded-lg bg-stone-200 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="text-center sm:text-left">
                              <AlertDialog.Title className="text-base font-semibold leading-6">
                                Are you sure?
                              </AlertDialog.Title>
                              <div className="mt-2">
                                <AlertDialog.Description className="text-sm">
                                  All of your data will be permanently removed
                                  from our servers forever. This action cannot
                                  be undone.
                                </AlertDialog.Description>
                              </div>
                            </div>
                            <div className="mt-5 flex gap-4 sm:mt-4 sm:flex-row-reverse">
                              <AlertDialog.Action asChild>
                                <button
                                  className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                  onClick={() => {
                                    handleDelete().catch(console.error);
                                  }}
                                >
                                  Yes, I&apos;m sure
                                </button>
                              </AlertDialog.Action>
                              <AlertDialog.Cancel asChild>
                                <button className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
                                  Cancel
                                </button>
                              </AlertDialog.Cancel>
                            </div>
                          </div>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
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
