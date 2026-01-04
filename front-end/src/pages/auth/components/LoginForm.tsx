import { TextField } from "@/components/form/fields/Textfield";
import { GenericForm } from "@/components/form/Genericform";
import { Button } from "@/components/ui/button";
import {
  loginDefaultValues,
  loginSchema,
  type LoginOutput,
} from "../validations";

function LoginForm() {
  const handleSubmit = (values: LoginOutput) => {
    console.log(values);
  };

  return (
    <GenericForm
      schema={loginSchema}
      defaultValues={loginDefaultValues}
      onSubmit={handleSubmit}
      className="w-full flex flex-col items-center justify-center"
    >
      <TextField name="pseudo" label="Pseudo" type="text" />
      <TextField
        name="password"
        label="Mot de passe"
        type="password"
        autoComplete="current-password"
      />
      <Button type="submit">Se connecter</Button>
    </GenericForm>
  );
}

export default LoginForm;
