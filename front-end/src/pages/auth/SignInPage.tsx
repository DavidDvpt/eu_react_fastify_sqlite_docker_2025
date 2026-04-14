import AppCard from "@/components/common/AppCard";
import { authMeThunk } from "@/modules/auth";
import signinApi from "@/modules/auth/services/network/signinApi";
import { useAppDispatch } from "@/store/hooks";
import SignInForm from "./components/SignInForm";
import type { LoginOutput } from "./validations";
import styles from "./styles/signin.module.css";
import { AppLink } from "@/components/common/AppLink";
function SignInPage() {
  const dispatch = useAppDispatch();

  const handleSubmit = async (values: LoginOutput) => {
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
    <AppCard
      className={styles.card}
      title="Connexion"
      content={
        <div className="space-y-4">
          <SignInForm onSubmit={handleSubmit} />
          <div className="flex justify-center text-sm">
            <AppLink
              to="/auth/signup"
              className="text-sm font-medium text-info underline-offset-4 transition-colors hover:text-info/80 hover:underline"
            >
              S&apos;inscrire
            </AppLink>
          </div>
        </div>
      }
    />
  );
}

export default SignInPage;
