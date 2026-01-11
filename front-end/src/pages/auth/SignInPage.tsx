import ModalGeneric from "@/components/common/ModalGeneric";
import { Link } from "react-router-dom";
import SignInForm from "./components/SignInForm";
import type { LoginOutput } from "./validations";

function SignInPage() {
  const handleSubmit = (values: LoginOutput) => {
    console.log(values);
  };

  return (
    <ModalGeneric noClose dialogType="form" title={{ value: "Connexion" }}>
      <SignInForm className="p-16 w-[300px]" onSubmit={handleSubmit} />

      <div className="flex justify-center">
        <Link to="/auth/signup">S’inscrire</Link>
      </div>
    </ModalGeneric>
  );
}

export default SignInPage;
