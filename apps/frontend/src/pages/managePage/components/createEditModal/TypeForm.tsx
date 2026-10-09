import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import CategorySelectRHF from "@/shared/components/form/Select/CategorySelectRHF";
import useSystemMutation from "@/shared/hooks/useSystemMutation";
import { useFormContext } from "react-hook-form";
import type { TypeViewModel } from "@zod-schemas";
import {
  TypeCreate,
  type TypeCreateOutput,
} from "@/api/generated/zod/model/typeCreate.zod";

interface TypeFormProps {
  type?: TypeViewModel;
  onClose: () => void;
}

const defaultValues: TypeCreateOutput = {
  name: "",
  isActive: true,
  isStackable: false,
  hasTierOption: false,
  categoryId: "",
  nexusName: null,
};

function TypeForm({ type, onClose }: TypeFormProps) {
  const { typeMutation } = useSystemMutation();
  const formValues: TypeCreateOutput = type
    ? {
        name: type.name,
        isActive: type.isActive,
        isStackable: type.isStackable,
        hasTierOption: !type.isStackable && (type.hasTierOption ?? false),
        categoryId: type.categoryId,
        nexusName: type.nexusName ?? null,
      }
    : defaultValues;

  const handleSubmit = (values: TypeCreateOutput) => {
    typeMutation.mutate(
      {
        type,
        values: {
          ...values,
          nexusName: values.nexusName?.trim() || null,
        },
      },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <GenericForm
      key={type?.id ?? "create-type"}
      onSubmit={handleSubmit}
      schema={TypeCreate}
      defaultValues={formValues}
      className="flex flex-col gap-4"
    >
      <TypeFormFields />
      <FormButtonsSection
        submitDisabled={typeMutation.isPending}
        cancelDisabled={typeMutation.isPending}
        submitLabel={type ? "Modifier" : "Créer"}
        onCancel={onClose}
      />
    </GenericForm>
  );
}

function TypeFormFields() {
  const form = useFormContext<TypeCreateOutput>();
  const isStackable = Boolean(form.watch("isStackable"));

  return (
    <div className="flex-1 flex flex-col gap-2">
      <InputRHF name="name" label="Nom: " placeholder="Nom obligatoire" />
      <InputRHF
        name="nexusName"
        label="Nom Nexus: "
        placeholder="Nom Nexus optionnel"
      />
      <CategorySelectRHF label="Catégorie: " />
      <CheckboxRHF name="isActive" label="Actif" />
      <CheckboxRHF
        name="isStackable"
        label="Stackable"
        onCheckedChange={(checked) => {
          if (checked) {
            form.setValue("hasTierOption", false, {
              shouldDirty: true,
            });
          }
        }}
      />
      {!isStackable ? (
        <CheckboxRHF name="hasTierOption" label="Tierable" />
      ) : null}
    </div>
  );
}

export default TypeForm;
