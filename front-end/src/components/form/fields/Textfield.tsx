import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type TextFieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
};

export function TextField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: TextFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name as never}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
