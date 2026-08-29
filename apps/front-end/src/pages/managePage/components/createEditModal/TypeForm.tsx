import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import CategorySelectRHF from "@/shared/components/form/Select/CategorySelectRHF";
import useSystemMutation from "@/shared/hooks/useSystemMutation";
import type { TypeDto, TypeFormBody } from "@eu/types";
import { typeFormSchema } from "@eu/zod-schemas";

interface TypeFormProps {
  type?: TypeDto;
  onClose: () => void;
}

const defaultValues: TypeFormBody = {
  name: "",
  isActive: true,
  isStackable: false,
  categoryId: "",
};

function TypeForm({ type, onClose }: TypeFormProps) {
  const { typeMutation } = useSystemMutation();

  const handleSubmit = (values: TypeFormBody) => {
    console.log(values);
    typeMutation.mutate(
      { type, values },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <GenericForm
      onSubmit={handleSubmit}
      schema={typeFormSchema}
      defaultValues={defaultValues}
      className="flex flex-col gap-4"
    >
      <div className="flex-1 flex flex-col gap-2">
        <InputRHF
          name="name"
          label="Nom: "
          className="mt-2"
          placeholder="Nom obligatoire"
        />
        <CategorySelectRHF label="Catégorie: " />
        <CheckboxRHF name="isActive" label="Actif" />
        <CheckboxRHF name="isStackable" label="Stackable" />
      </div>
      <FormButtonsSection
        submitDisabled={typeMutation.isPending}
        cancelDisabled={typeMutation.isPending}
        submitLabel={type ? "Modifier" : "Créer"}
        onCancel={onClose}
      />
    </GenericForm>
  );
}

export default TypeForm;
