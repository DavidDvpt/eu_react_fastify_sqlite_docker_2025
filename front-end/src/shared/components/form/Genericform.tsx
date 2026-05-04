import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import {
  type FieldValues,
  FormProvider,
  type Path,
  type Resolver,
  type UseFormProps,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import * as z4 from "zod/v4/core";
import useWatchFields from "./hookForm/useWatchFields";

type SchemaInput<TSchema extends z4.$ZodType> = z4.input<TSchema> & FieldValues;
type SchemaOutput<TSchema extends z4.$ZodType> = z4.output<TSchema> & FieldValues;

export type FormExternalError<TFormValues extends FieldValues> = {
  key: Path<TFormValues>;
  msg: string;
};

type GenericFormProps<TSchema extends z4.$ZodType> = {
  externalError?: FormExternalError<SchemaInput<TSchema>>[] | null;
  resetExternalError?: () => void;
  defaultValues?: UseFormProps<SchemaInput<TSchema>>["defaultValues"];
  onSubmit: SubmitHandler<SchemaOutput<TSchema>>;
  children: React.ReactNode;
  schema: TSchema;
  className?: string;
};

export function GenericForm<TSchema extends z4.$ZodType>({
  externalError = null,
  resetExternalError,
  defaultValues,
  onSubmit,
  children,
  schema,
  className,
}: GenericFormProps<TSchema>) {
  const resolver = zodResolver(schema as never) as Resolver<
    SchemaInput<TSchema>,
    object,
    SchemaOutput<TSchema>
  >;

  const methods = useForm<SchemaInput<TSchema>, object, SchemaOutput<TSchema>>({
    resolver,
    defaultValues,
  });

  useWatchFields<SchemaInput<TSchema>, SchemaOutput<TSchema>>({
    control: methods.control,
    errorState: externalError,
    onFieldChange: () => resetExternalError?.(),
  });

  useEffect(() => {
    if (!externalError?.length) return;

    externalError.forEach((error) => {
      methods.setError(error.key, {
        type: "manual",
        message: error.msg,
      });
    });
  }, [externalError, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
