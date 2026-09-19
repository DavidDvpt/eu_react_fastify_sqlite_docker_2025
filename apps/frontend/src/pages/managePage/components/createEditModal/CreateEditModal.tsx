import CategoryForm from "@/pages/managePage/components/createEditModal/CategoryForm";
import ManageItemForm from "@/pages/managePage/components/createEditModal/ItemForm";
import TypeForm from "@/pages/managePage/components/createEditModal/TypeForm";
import { ModalGeneric } from "@/shared/components";
import type { ManageTab } from "@/shared/types/managePageTypes";
import type { ItemDto, TypeDto, CategoryDto } from "@eu/zod-schemas";
import { useLocation, useNavigate } from "react-router-dom";

interface CreatEditModalProps {
  tab: ManageTab;
  entity?: CategoryDto | TypeDto | ItemDto;
}
function CreateEditModal({ tab, entity }: CreatEditModalProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const onclose = () =>
    navigate({
      pathname: `/manage/${tab}`,
      search: location.search,
    });
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
      {tab === "item" && (
        <ManageItemForm item={entity as ItemDto} onClose={onclose} />
      )}
    </ModalGeneric>
  );
}

export default CreateEditModal;
