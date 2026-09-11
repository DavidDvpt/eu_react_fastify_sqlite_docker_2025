import signinApi from "@/modules/auth/services/network/signinApi";
import { Panel, Section } from "@/shared/components/Containers";
import { AppLink } from "@/shared/components/AppLink";
import { useAppDispatch } from "@/store/hooks";
import SignInForm from "./components/SignInForm";
import type { UserSignInFormBody } from "@eu/zod-schemas";
import { authMeThunk } from "@/store";

function SignInPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: UserSignInFormBody) => {
    try {
      const response = await signinApi(values);

      if (response.message === "Success") {
        dispatch(authMeThunk());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Panel aria-labelledby="signin-title" className="flex justify-center">
      <Section className="p-6 w-[400px]">
        <h1 id="signin-title" className="text-center">
          Connexion
        </h1>

        <SignInForm onSubmit={handleSubmit} />

        <div className="flex justify-center mt-2">
          <AppLink
            to="/auth/signup"
            className="text-primary-700 hover:text-primary-900"
          >
            S&apos;inscrire
          </AppLink>
        </div>
      </Section>
    </Panel>
  );
}

export default SignInPage;
