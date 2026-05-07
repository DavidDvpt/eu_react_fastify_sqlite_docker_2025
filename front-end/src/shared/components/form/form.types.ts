import type { ChangeEvent, InputHTMLAttributes } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  FormState,
  Path,
  RegisterOptions,
  SubmitHandler,
  UseFormGetFieldState,
  UseFormProps,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import * as z4 from "zod/v4/core";

export type SchemaInput<TSchema extends z4.$ZodType> = z4.input<TSchema> &
  FieldValues;
export type SchemaOutput<TSchema extends z4.$ZodType> = z4.output<TSchema> &
  FieldValues;

export type FormExternalError<TFormValues extends FieldValues> = {
  key: Path<TFormValues>;
  msg: string;
};

export type GenericFormProps<TSchema extends z4.$ZodType> = {
  externalError?: FormExternalError<SchemaInput<TSchema>>[] | null;
  resetExternalError?: () => void;
  defaultValues?: UseFormProps<SchemaInput<TSchema>>["defaultValues"];
  onSubmit: SubmitHandler<SchemaOutput<TSchema>>;
  children: React.ReactNode;
  schema: TSchema;
  className?: string;
};

export type SafeFormContext = {
  control: Control<FieldValues>;
  errors: FieldErrors;
  formState: FormState<FieldValues>;
  getFieldState: UseFormGetFieldState<FieldValues>;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export interface InputRHFProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  name: string;
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>, name: string) => void;
  selectOnFocus?: boolean;
  hideErrorMessage?: boolean;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectRHFProps {
  name?: string;
  label?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  options: SelectOption[];
  hasAutocomplete?: boolean;
  wrapperClassName?: string;
  triggerClassName?: string;
  errorClassName?: string;
  hideErrorMessage?: boolean;
}
