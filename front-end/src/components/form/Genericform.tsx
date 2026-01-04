import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";

type GenericFormProps<TSchema extends z.ZodObject> = {
  schema: TSchema;

  // What the user types / what your inputs produce
  defaultValues: DefaultValues<z.input<TSchema>>;

  // What you get after Zod parsing (can differ if schema transforms)
  onSubmit: SubmitHandler<z.output<TSchema>>;

  children: React.ReactNode;
  className?: string;
};

export function GenericForm<TSchema extends z.ZodObject>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: GenericFormProps<TSchema>) {
  const methods = useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}
