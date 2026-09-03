import FormButtonsSection from "@/shared/components/form/FormButtonsSection";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import { useNexusMutation } from "@/shared/hooks";
import type { NexusFormBody, NexusUpdateDto } from "@eu/types";
import { nexusFormSchema } from "@eu/zod-schemas";

type NexusFormProps = {
  nexus: NexusUpdateDto;
  onClose: () => void;
};

function NexusForm({ nexus, onClose }: NexusFormProps) {
  const { updateMutation } = useNexusMutation();

  const defaultValues: NexusFormBody = {
    appTypeName: nexus.appTypeName,
    nexusName: nexus.nexusName ?? nexus.appTypeName,
    nexusRequestType: nexus.nexusRequestType ?? "",
  };

  const handleSubmit = (values: NexusFormBody) => {
    updateMutation.mutate(
      { nexus, values },
      {
        onSuccess() {
          onClose();
        },
      },
    );
  };

  return (
    <GenericForm
      key={nexus.id}
      onSubmit={handleSubmit}
      schema={nexusFormSchema}
      defaultValues={defaultValues}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <InputRHF
          name="appTypeName"
          label="Nom"
          placeholder="Nom du type"
        />
        <InputRHF
          name="nexusName"
          label="Nexus name"
          placeholder="Nom Nexus"
        />
        <InputRHF
          name="nexusRequestType"
          label="Nexus request type"
          placeholder="Type de requete Nexus"
        />
      </div>
      <FormButtonsSection
        submitDisabled={updateMutation.isPending}
        cancelDisabled={updateMutation.isPending}
        submitLabel="Modifier"
        onCancel={onClose}
      />
    </GenericForm>
  );
}

export default NexusForm;
