import InputRHF from "@/shared/components/form/Input/InputRHF";
import { GenericForm } from "@/shared/components/form/Genericform";
import { Button } from "@/components/ui/button";

import {
  SignInBody,
  type SignInBodyOutput,
} from "@/api/generated/zod/model/signInBody.zod";

const loginDefaultValues = { pseudo: "", password: "" };
interface ILoginFormProps {
  className?: string;
  onSubmit: (values: SignInBodyOutput) => void | Promise<void>;
}

function SignInForm({ className, onSubmit }: ILoginFormProps) {
  return (
    <GenericForm
      schema={SignInBody}
      defaultValues={loginDefaultValues}
      onSubmit={onSubmit}
      className={`flex flex-col items-stretch justify-center space-y-3 ${className}`}
    >
      <InputRHF
        name="pseudo"
        label="Pseudo"
        type="text"
      />
      <InputRHF
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
      />
      <Button type="submit" className="mt-4" variant="primary">
        Se connecter
      </Button>
    </GenericForm>
  );
}

export default SignInForm;
