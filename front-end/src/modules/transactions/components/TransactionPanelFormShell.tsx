import type { PropsWithChildren, ReactNode } from "react";
import type * as z4 from "zod/v4/core";
import type { SubmitHandler, UseFormProps } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Section } from "@/shared/components/Containers";
import { GenericForm } from "@/shared/components/form/Genericform";
import type { SchemaInput, SchemaOutput } from "@/shared/components/form/form.types";

type TransactionPanelFormShellProps<
  TSchema extends z4.$ZodType,
> = PropsWithChildren<{
  formKey: string;
  schema: TSchema;
  defaultValues: UseFormProps<SchemaInput<TSchema>>["defaultValues"];
  onSubmit: SubmitHandler<SchemaOutput<TSchema>>;
  onBack: () => void;
  isPending: boolean;
  isError: boolean;
  errorMessage: ReactNode;
  submitLabel: string;
  buttonGapClassName?: string;
}>;

function TransactionPanelFormShell<
  TSchema extends z4.$ZodType,
>({
  formKey,
  schema,
  defaultValues,
  onSubmit,
  onBack,
  isPending,
  isError,
  errorMessage,
  submitLabel,
  buttonGapClassName = "gap-1",
  children,
}: TransactionPanelFormShellProps<TSchema>) {
  return (
    <Section variant="modal" className="p-2">
      <GenericForm
        key={formKey}
        schema={schema}
        defaultValues={defaultValues}
        className="space-y-2"
        onSubmit={onSubmit}
      >
        {children}

        {isError ? (
          <p className="m-0 text-sm text-destructive-300">{errorMessage}</p>
        ) : null}

        <div className={`flex justify-end ${buttonGapClassName}`}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-[110px] text-black"
            onClick={onBack}
            disabled={isPending}
          >
            Retour
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="min-w-[110px]"
            disabled={isPending}
          >
            {submitLabel}
          </Button>
        </div>
      </GenericForm>
    </Section>
  );
}

export default TransactionPanelFormShell;
