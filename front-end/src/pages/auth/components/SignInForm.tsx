import { TextField } from "@/components/form/fields/Textfield";
import { GenericForm } from "@/components/form/Genericform";
import { Button } from "@/components/ui/button";
import {
  loginDefaultValues,
  loginSchema,
  type LoginOutput,
} from "../validations";

interface ILoginFormProps {
  className?: string;
  onSubmit: (values: LoginOutput) => void | Promise<void>;
}
function SignInForm({ className, onSubmit }: ILoginFormProps) {
  return (
    <GenericForm
      schema={loginSchema}
      defaultValues={loginDefaultValues}
      onSubmit={onSubmit}
      className={`flex flex-col items-stretch justify-center ${className}`}
    >
      <TextField
        name="pseudo"
        label="Pseudo"
        type="text"
        inputClassName="py-2 mt-1"
      />
      <TextField
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
        inputClassName="pt-4 mt-1"
        className="pt-2"
      />
      <Button type="submit" className="mt-4" variant="info">
        Se connecter
      </Button>
    </GenericForm>
  );
}

export default SignInForm;
