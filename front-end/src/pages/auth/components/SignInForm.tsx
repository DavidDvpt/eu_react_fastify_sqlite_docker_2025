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
      className={`flex flex-col items-stretch justify-center space-y-3 ${className}`}
    >
      <TextField
        name="pseudo"
        label="Pseudo"
        type="text"
        inputClassName="py-2"
      />
      <TextField
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
