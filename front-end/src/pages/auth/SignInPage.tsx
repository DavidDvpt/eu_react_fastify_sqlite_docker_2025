import ModalGeneric from "@/components/common/ModalGeneric";
import { authMeThunk } from "@/modules/auth";
import signinApi from "@/modules/auth/services/network/signinApi";
import { useAppDispatch } from "@/store/hooks";
import { Link } from "react-router-dom";
import SignInForm from "./components/SignInForm";
import type { LoginOutput } from "./validations";

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
    <ModalGeneric noClose dialogType="form" title={{ value: "Connexion" }}>
      <SignInForm className="p-16 w-[300px]" onSubmit={handleSubmit} />

      <div className="flex justify-center">
        <Link to="/auth/signup">S’inscrire</Link>
      </div>
    </ModalGeneric>
  );
}

export default SignInPage;
