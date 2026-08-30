import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import useSystemMutation from "@/shared/hooks/useSystemMutation";
import type { CategoryDto, CategoryFormBody } from "@eu/types";
import { categoryFormSchema } from "@eu/zod-schemas";

interface CategoyFormProps {
  category?: CategoryDto;
  onClose: () => void;
}

const defaultValues: CategoryFormBody = { name: "", isActive: true };

function CategoryForm({ category, onClose }: CategoyFormProps) {
  const { categoryMutation } = useSystemMutation();
  const formValues: CategoryFormBody = category
    ? {
        name: category.name,
        isActive: category.isActive,
      }
    : defaultValues;

  const handleSubmit = (values: CategoryFormBody) => {
    categoryMutation.mutate(
      { category, values },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <GenericForm
      key={category?.id ?? "create-category"}
      onSubmit={handleSubmit}
      schema={categoryFormSchema}
      defaultValues={formValues}
      className="flex flex-col gap-4"
    >
      <div className="flex-1 flex flex-col gap-2">
        <InputRHF
          name="name"
          label="Nom: "
          className="mt-2"
          placeholder="Nom obligatoire"
        />
        <CheckboxRHF name="isActive" label="Actif" />
      </div>
      <FormButtonsSection
        submitDisabled={categoryMutation.isPending}
        cancelDisabled={categoryMutation.isPending}
        submitLabel={category ? "Modifier" : "Créer"}
        onCancel={onClose}
      />
    </GenericForm>
  );
}

export default CategoryForm;
