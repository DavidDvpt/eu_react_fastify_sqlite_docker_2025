import { useEffect } from "react";
import { useWatch, type Control, type FieldValues, type Path } from "react-hook-form";

type WatchFieldError<TFormValues extends FieldValues> = {
  key: Path<TFormValues>;
};

type UseWatchFieldsProps<
  TFormValues extends FieldValues,
  TTransformedValues extends FieldValues = TFormValues,
> = {
  control: Control<TFormValues, object, TTransformedValues>;
  errorState: WatchFieldError<TFormValues>[] | null;
  onFieldChange: (fieldName: Path<TFormValues>, value: unknown) => void;
};

function useWatchFields<
  TFormValues extends FieldValues,
  TTransformedValues extends FieldValues = TFormValues,
>({
  errorState,
  onFieldChange,
  control,
}: UseWatchFieldsProps<TFormValues, TTransformedValues>) {
  const fieldNames = errorState?.map((e) => e.key) ?? [];

  const watchedValues = useWatch({
    control,
    name: fieldNames,
  });

  useEffect(() => {
    if (!fieldNames.length || !Array.isArray(watchedValues)) return;

    watchedValues.forEach((value, index) => {
      const fieldName = fieldNames[index];
      if (fieldName) {
        onFieldChange(fieldName, value);
      }
    });
  }, [fieldNames, onFieldChange, watchedValues]);
}

export default useWatchFields;
