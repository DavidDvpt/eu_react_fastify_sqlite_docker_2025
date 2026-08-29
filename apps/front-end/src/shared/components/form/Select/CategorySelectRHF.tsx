import { cn } from "@/lib/utils";
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
    <div className={cn("flex flex-col", classname)}>
      {label && <span className="text-sm text-input-label">{label}</span>}
      <SelectRHF
        name="categoryId"
        options={options}
        onValueChange={(value) => updateValue?.("category", value)}
        placeholder="Choisir une categorie ..."
      />
    </div>
  );
}

export default CategorySelectRHF;
