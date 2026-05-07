import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, type Resolver, useForm } from "react-hook-form";
import * as z4 from "zod/v4/core";
import useWatchFields from "./hookForm/useWatchFields";
import type { GenericFormProps, SchemaInput, SchemaOutput } from "./form.types";

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
