import { SignIn, useSignIn } from "@clerk/nextjs";
import { Layout } from "~/components/layout";
import { Container } from "~/components/ui/container";

const SignInPage = () => {
  return (
    <>
      <Layout>
        <Container>
          <div className="flex items-center justify-center py-12">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          </div>
        </Container>
      </Layout>
    </>
  );
};

export default SignInPage;
