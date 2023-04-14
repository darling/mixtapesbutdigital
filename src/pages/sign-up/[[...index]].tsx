import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />;
};

export default SignUpPage;
