import { Button } from "@/components/ui/button";
import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
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
      onSubmit={handleSubmit}
      schema={categoryFormSchema}
      defaultValues={defaultValues}
      className="flex flex-col h-[200px]"
    >
      <div className="flex-1">
        <InputRHF name="name" label="Nom: " className="mt-2 mb-4" />
        <CheckboxRHF name="isActive" label="Actif" />
      </div>
      <div>
        <Button type="reset" variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={categoryMutation.isPending}
        >
          {category ? "Modifier" : "Créer"}
        </Button>
      </div>
    </GenericForm>
  );
}

export default CategoryForm;
