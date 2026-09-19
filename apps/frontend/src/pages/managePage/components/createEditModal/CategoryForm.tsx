import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import useSystemMutation from "@/shared/hooks/useSystemMutation";
import type { CategoryViewModel } from "@zod-schemas";
import {
  CategoryCreate,
  type CategoryCreateOutput,
} from "@/api/generated/zod/model/categoryCreate.zod";

interface CategoyFormProps {
  category?: CategoryViewModel;
  onClose: () => void;
}

const defaultValues: CategoryCreateOutput = { name: "", isActive: true };

function CategoryForm({ category, onClose }: CategoyFormProps) {
  const { categoryMutation } = useSystemMutation();
  const formValues: CategoryCreateOutput = category
    ? {
        name: category.name,
        isActive: category.isActive,
      }
    : defaultValues;

  const handleSubmit = (values: CategoryCreateOutput) => {
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
      schema={CategoryCreate}
      defaultValues={formValues}
      className="flex flex-col gap-4"
    >
      <div className="flex-1 flex flex-col gap-2">
        <InputRHF name="name" label="Nom: " placeholder="Nom obligatoire" />
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
