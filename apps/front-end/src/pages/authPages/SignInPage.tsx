import { authMeThunk } from "@/modules/auth";
import signinApi from "@/modules/auth/services/network/signinApi";
import { Section, SubSection } from "@/shared/components/Containers";
import { AppLink } from "@/shared/components/AppLink";
import { useAppDispatch } from "@/store/hooks";
import SignInForm from "./components/SignInForm";
import styles from "./styles/signin.module.css";
import type { UserSignInFormOutputBody } from "@eu/types";

function SignInPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: UserSignInFormOutputBody) => {
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
    <Section className={styles.section} aria-labelledby="signin-title">
      <SubSection className="gap-4 px-6 py-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h1
              id="signin-title"
              className="text-2xl font-bold leading-tight tracking-tight"
            >
              Connexion
            </h1>
          </div>

          <SignInForm onSubmit={handleSubmit} />

          <div className="flex justify-center text-sm">
            <AppLink
              to="/auth/signup"
              className="text-base font-medium text-primary-700 underline-offset-4 transition-colors hover:text-info/80 hover:underline"
            >
              S&apos;inscrire
            </AppLink>
          </div>
        </div>
      </SubSection>
    </Section>
  );
}

export default SignInPage;
