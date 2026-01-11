import ModalGeneric from "@/components/common/ModalGeneric";
import { Link } from "react-router-dom";
import SignInForm from "./components/SignInForm";

function SignInPage() {
  return (
    <ModalGeneric noClose dialogType="form" title={{ value: "Connexion" }}>
      <SignInForm className="p-16 w-[300px]" />
      <Link to="/auth/signup">S’inscrire</Link>
    </ModalGeneric>
  );
}

export default SignInPage;
