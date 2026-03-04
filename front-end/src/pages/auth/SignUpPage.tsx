import AppCard from "@/components/common/AppCard";
import SignUpForm from "./components/SignUpForm";
import { Link } from "react-router-dom";

function SignUpPage() {
  return (
    <AppCard
      className="w-full max-w-md"
      title="Inscription"
      description="Creez votre compte utilisateur."
      content={
        <div className="space-y-4">
          <SignUpForm />
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
