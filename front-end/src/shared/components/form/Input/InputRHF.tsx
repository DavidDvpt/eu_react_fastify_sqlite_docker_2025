import { Eye, EyeOff } from "lucide-react";
import { type ChangeEvent, type InputHTMLAttributes, useState } from "react";
import { type FieldValues, type RegisterOptions } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useSafeFormContext from "@/shared/components/form/hookForm/useSafeFormContext";

interface InputRHFProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>, name: string) => void;
  selectOnFocus?: boolean;
  hideErrorMessage?: boolean;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

function InputRHF({
  name,
  type = "text",
  label,
  className,
  wrapperClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  onInputChange,
  selectOnFocus = false,
  hideErrorMessage = false,
  registerOptions,
  ...props
}: InputRHFProps) {
  const rhf = useSafeFormContext();
  const [visible, setVisible] = useState(false);

  if (!name) return null;

  const registration = rhf.register(name, registerOptions);
  const fieldState = rhf.getFieldState(name, rhf.formState);
  const {
    ref: registrationRef,
    name: registrationName,
    onBlur: onRegistrationBlur,
    onChange: onRegistrationChange,
  } = registration;
  const isPasswordField = type === "password";

  const effectiveType =
    isPasswordField && visible ? "text" : (type as InputHTMLAttributes<HTMLInputElement>["type"]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange?.(event, name);
    onRegistrationChange(event);
    props.onChange?.(event);
  };

  return (
    <div className={cn("space-y-1", wrapperClassName)}>
      {label ? (
        <label
          htmlFor={props.id ?? name}
          className={cn("text-sm text-input-label", labelClassName)}
        >
          {label}
        </label>
      ) : null}

      <div className="relative">
        <Input
          {...props}
          id={props.id ?? name}
          ref={registrationRef}
          name={registrationName}
          type={effectiveType}
          className={cn(
            className,
            inputClassName,
            fieldState.error ? "border-destructive-300 ring-destructive-300" : "",
            isPasswordField ? "pr-10" : "",
          )}
          onBlur={(event) => {
            onRegistrationBlur(event);
            props.onBlur?.(event);
          }}
          onChange={handleChange}
          onFocus={(event) => {
            if (selectOnFocus) {
              event.currentTarget.select();
            }
            props.onFocus?.(event);
          }}
        />

        {isPasswordField ? (
          <button
            type="button"
            className="absolute inset-y-0 right-2 inline-flex items-center text-input-label"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        ) : null}
      </div>

      {!hideErrorMessage && fieldState.error?.message ? (
        <p className={cn("m-0 text-[0.8rem] italic text-destructive-300", errorClassName)}>
          {String(fieldState.error.message)}
        </p>
      ) : null}
    </div>
  );
}

export default InputRHF;
