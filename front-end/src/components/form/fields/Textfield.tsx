import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type TextFieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputClassName?: string;
  labelClassName?: string;
  className?: string;
};

export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  inputClassName,
  labelClassName,
  className,
}: TextFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name as never}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={inputClassName}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
