import SelectRHF from "@/shared/components/form/Select/SelectRHF";
import { selectOptionsHelper } from "@/shared/helpers/selectHelper";
import { useSystemDatas } from "@/shared/hooks";

interface CategorySelectRHFProps {
  updateValue?: (label: string, value: string) => void;
  classname?: string;
  label?: string;
}
function CategorySelectRHF({
  updateValue,
  classname,
  label,
}: CategorySelectRHFProps) {
  const { categories } = useSystemDatas();

  const options = selectOptionsHelper(categories.data ?? []);

  return (
    <SelectRHF
      name="categoryId"
      label={label}
      options={options}
      wrapperClassName={classname}
      onValueChange={(value) => updateValue?.("category", value)}
      placeholder="Choisir une categorie ..."
    />
  );
}

export default CategorySelectRHF;
