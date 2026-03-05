import AppCard from "@/components/common/AppCard";
import signupApi from "@/modules/auth/services/network/signupApi";
import { Link, useNavigate } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import type { SignUpOutput } from "./validations";
import styles from "./styles/signup.module.css";

function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values: SignUpOutput) => {
    try {
      await signupApi(values);
      navigate("/auth/signin", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AppCard
      className={styles.card}
      title="Inscription"
      description="Creez votre compte utilisateur."
      content={
        <div className="space-y-4">
          <SignUpForm onSubmit={handleSubmit} />
          <div className="flex justify-center text-sm">
            <Link
              to="/auth/signin"
              className="text-sm font-medium text-info underline-offset-4 transition-colors hover:text-info/80 hover:underline"
            >
              Deja inscrit ? Connexion
            </Link>
          </div>
        </div>
      }
    />
  );
}

export default SignUpPage;
