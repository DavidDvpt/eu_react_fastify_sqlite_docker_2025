import CheckboxRHF from "@/shared/components/form/Checkbox/CheckboxRHF";
import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import SelectRHF from "@/shared/components/form/Select/SelectRHF";
import { selectOptionsHelper } from "@/shared/helpers/selectHelper";
import useSystemMutation from "@/shared/hooks/useSystemMutation";
import { useSystemDatas } from "@/shared/hooks";
import type { ItemDto, ItemForm } from "@eu/zod-schemas";
import { itemFormSchema } from "@eu/zod-schemas";

interface ItemFormProps {
  item?: ItemDto;
  onClose: () => void;
}

const defaultValues: ItemForm = {
  id: null,
  name: "",
  typeId: "",
  imageUrlId: null,
  value: 0,
  nexusId: null,
  description: null,
  weight: null,
  decay: null,
  isLimited: null,
  isActive: true,
  isUntradeable: null,
  isRare: null,
};

function ManageItemForm({ item, onClose }: ItemFormProps) {
  const { itemMutation } = useSystemMutation();
  const { types } = useSystemDatas();
  const typeOptions = selectOptionsHelper(types.typeDatas);

  const formValues: ItemForm = item
    ? {
        id: item.id,
        name: item.name,
        typeId: item.typeId,
        imageUrlId: item.imageUrlId,
        value: item.value,
        nexusId: item.nexusId,
        description: item.description,
        weight: item.weight,
        decay: item.decay,
        isLimited: item.isLimited,
        isActive: item.isActive,
        isUntradeable: item.isUntradeable,
        isRare: item.isRare,
      }
    : defaultValues;

  const handleSubmit = (values: ItemForm) => {
    itemMutation.mutate(
      { item, values },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <GenericForm
      key={item?.id ?? "create-item"}
      onSubmit={handleSubmit}
      schema={itemFormSchema}
      defaultValues={formValues}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-1 flex-col gap-2">
        <InputRHF name="name" label="Nom: " placeholder="Nom obligatoire" />
        <SelectRHF
          name="typeId"
          label="Type: "
          options={typeOptions}
          placeholder="Choisir un type ..."
        />
        <InputRHF
          name="value"
          label="Valeur: "
          type="number"
          min={0}
          step="any"
        />
        <InputRHF name="description" label="Description: " />
        <InputRHF name="imageUrlId" label="Image: " />
        <InputRHF
          name="weight"
          label="Poids: "
          type="number"
          step="any"
          registerOptions={{ valueAsNumber: true }}
        />
        <InputRHF
          name="decay"
          label="Decay: "
          type="number"
          step="any"
          registerOptions={{ valueAsNumber: true }}
        />
        <div className="grid grid-cols-2 gap-2">
          <CheckboxRHF name="isActive" label="Actif" />
          <CheckboxRHF name="isLimited" label="Limited" />
          <CheckboxRHF name="isUntradeable" label="Non échangeable" />
          <CheckboxRHF name="isRare" label="Rare" />
        </div>
      </div>
      <FormButtonsSection
        submitDisabled={itemMutation.isPending}
        cancelDisabled={itemMutation.isPending}
        submitLabel={item ? "Modifier" : "Créer"}
        onCancel={onClose}
      />
    </GenericForm>
  );
}

export default ManageItemForm;
