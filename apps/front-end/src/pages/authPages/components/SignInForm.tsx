import InputRHF from "@/shared/components/form/Input/InputRHF";
import { GenericForm } from "@/shared/components/form/Genericform";
import { Button } from "@/components/ui/button";

import { userSignInSchema } from "@eu/zod-schemas";
import type { UserSignInFormOutputBody } from "@eu/types";

const loginDefaultValues = { pseudo: "", password: "" };
interface ILoginFormProps {
  className?: string;
  onSubmit: (values: UserSignInFormOutputBody) => void | Promise<void>;
}

function SignInForm({ className, onSubmit }: ILoginFormProps) {
  return (
    <GenericForm
      schema={userSignInSchema}
      defaultValues={loginDefaultValues}
      onSubmit={onSubmit}
      className={`flex flex-col items-stretch justify-center space-y-3 ${className}`}
    >
      <InputRHF
        name="pseudo"
        label="Pseudo"
        type="text"
        inputClassName="py-2"
      />
      <InputRHF
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
        inputClassName="py-2"
      />
      <Button type="submit" className="mt-4" variant="primary">
        Se connecter
      </Button>
    </GenericForm>
  );
}

export default SignInForm;
