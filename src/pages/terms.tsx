import { useUser, useAuth } from "@clerk/nextjs";
import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const Home: NextPage<{ body: string }> = ({ body }) => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>Terms of Service</title>
      </Head>
      <Layout>
        <Container>
          <div
            className="prose prose-xl prose-stone py-32 prose-headings:text-stone-700"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          ></div>
        </Container>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(
    "https://www.iubenda.com/api/terms-and-conditions/62207639/no-markup"
  );

  const response: unknown = await res.json();

  const parse = z.object({
    content: z.string(),
  });

  const parsed = parse.parse(response);
  const bodyAsString = parsed.content;

  return {
    props: {
      body: bodyAsString,
    },
  };
};

export default Home;
