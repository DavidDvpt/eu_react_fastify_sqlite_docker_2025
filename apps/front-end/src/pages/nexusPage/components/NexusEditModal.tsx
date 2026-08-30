import { ModalGeneric } from "@/shared/components";
import type { NexusUpdateDto } from "@eu/types";
import NexusForm from "./NexusForm";

type NexusEditModalProps = {
  nexus: NexusUpdateDto;
  open: boolean;
  onClose: () => void;
};

function NexusEditModal({ nexus, open, onClose }: NexusEditModalProps) {
  return (
    <ModalGeneric
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      dialogType="form"
      title={{ value: "Edition" }}
    >
      <NexusForm nexus={nexus} onClose={onClose} />
    </ModalGeneric>
  );
}

export default NexusEditModal;
