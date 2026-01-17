import ModalGeneric from "@/components/common/ModalGeneric";
import signinRequest from "@/lib/network/auth/signin";
import { Link } from "react-router-dom";
import SignInForm from "./components/SignInForm";
import type { LoginOutput } from "./validations";

function SignInPage() {
  const handleSubmit = async (values: LoginOutput) => {
    try {
      const response = await signinRequest(values);
    } catch (error) {
      console.log(error);
    }
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
