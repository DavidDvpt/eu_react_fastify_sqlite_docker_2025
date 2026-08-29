import CategoryForm from "@/pages/managePage/components/createEditModal/CategoryForm";
import TypeForm from "@/pages/managePage/components/createEditModal/TypeForm";
import { ModalGeneric } from "@/shared/components";
import type { ManageTab } from "@/shared/types/managePageTypes";
import type { ItemDto, TypeDto } from "@eu/types";
import type { CategoryDto } from "@eu/types";
import { useNavigate } from "react-router-dom";

interface CreatEditModalProps {
  tab: ManageTab;
  entity?: CategoryDto | TypeDto | ItemDto;
}
function CreateEditModal({ tab, entity }: CreatEditModalProps) {
  const navigate = useNavigate();

  const onclose = () => navigate(`/manage/${tab}`);
  return (
    <ModalGeneric
      onOpenChange={onclose}
      dialogType="form"
      title={{ value: entity ? "Edition" : "Creation" }}
    >
      {tab === "category" && (
        <CategoryForm category={entity as CategoryDto} onClose={onclose} />
      )}
      {tab === "type" && (
        <TypeForm type={entity as TypeDto} onClose={onclose} />
      )}
      {/* {tab === "item"} */}
    </ModalGeneric>
  );
}

export default CreateEditModal;
