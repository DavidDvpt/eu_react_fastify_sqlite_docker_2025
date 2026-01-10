import { createContext } from "react";
import type { FieldPath, FieldValues } from "react-hook-form";

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

const FormItemContext = createContext<FormItemContextValue | null>(null);

export { FormFieldContext, FormItemContext };
