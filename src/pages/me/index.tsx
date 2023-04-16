import { useUser, useAuth } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const Page: NextPage = () => {
  const { user } = useUser();
  //   const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>T3</title>
      </Head>
      <Layout>
        <Container>
          <h1 className="font-serif text-7xl font-bold">{user?.firstName}</h1>
        </Container>
      </Layout>
    </>
  );
};

export default Page;
