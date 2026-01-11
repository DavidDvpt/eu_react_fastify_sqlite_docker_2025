import { GenericForm } from "@/components/form/Genericform";
import { signUpDefaultValues, signUpSchemaAdmin } from "../validations";
interface ISignUpFormProps {
  className?: string;
}

function SignUpForm({ className }: ISignUpFormProps) {
  const handleSubmit = () => {};
  return (
    <GenericForm
      schema={signUpSchemaAdmin}
      defaultValues={signUpDefaultValues}
      onSubmit={handleSubmit}
      className={`flex flex-col items-stretch justify-center ${className}`}
    >
      SignUpForm
    </GenericForm>
  );
}

export default SignUpForm;

//   id            String  @id @default(uuid())
//   firstname     String?
//   lastname      String?
//   pseudo        String  @unique
//   email         String  @unique
//   password_hash String
//   role          Role
//   date_created  String
//   date_updated  String?
//   is_active     Boolean @default(true)
