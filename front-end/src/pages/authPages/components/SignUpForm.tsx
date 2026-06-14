import InputRHF from "@/shared/components/form/Input/InputRHF";
import { GenericForm } from "@/shared/components/form/Genericform";
import { Button } from "@/components/ui/button";
import {
  signUpDefaultValues,
  signUpSchema,
  type SignUpOutput,
} from "./validations";

interface ISignUpFormProps {
  className?: string;
  onSubmit: (values: SignUpOutput) => void | Promise<void>;
}

function SignUpForm({ className, onSubmit }: ISignUpFormProps) {
  return (
    <GenericForm
      schema={signUpSchema}
      defaultValues={signUpDefaultValues}
      onSubmit={onSubmit}
      className={`flex flex-col items-stretch justify-center space-y-3 ${className}`}
    >
      <InputRHF
        name="pseudo"
        label="Pseudo"
        type="text"
        autoComplete="username"
        inputClassName="py-2"
      />
      <InputRHF
        name="firstname"
        label="Prenom (optionnel)"
        type="text"
        autoComplete="given-name"
        inputClassName="py-2"
      />
      <InputRHF
        name="lastname"
        label="Nom (optionnel)"
        type="text"
        autoComplete="family-name"
        inputClassName="py-2"
      />
      <InputRHF
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        inputClassName="py-2"
      />
      <InputRHF
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="new-password"
        inputClassName="py-2"
      />
      <Button type="submit" className="mt-4" variant="primary">
        S&apos;inscrire
      </Button>
    </GenericForm>
  );
}

export default SignUpForm;
