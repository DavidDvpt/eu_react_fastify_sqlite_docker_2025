import { useLocation, useNavigate } from "react-router-dom";

import CheckboxApp from "@/shared/components/form/Checkbox/CheckboxApp";
import SwitchApp from "@/shared/components/form/Switch/SwitchApp";

type UrlParamFlagKind = "checkbox" | "switch";

type UrlParamFlagProps = {
  paramKey: string;
  kind: UrlParamFlagKind;
  checkboxLabel?: string;
  switchTrueLabel?: string;
  switchFalseLabel?: string;
  checkboxWrapperClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  switchClassName?: string;
  ariaLabel?: string;
};

function UrlParamFlag({
  paramKey,
  kind,
  checkboxLabel,
  switchTrueLabel = "",
  switchFalseLabel = "",
  checkboxWrapperClassName,
  containerClassName,
  labelClassName,
  switchClassName,
  ariaLabel,
}: UrlParamFlagProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const checked = searchParams.has(paramKey);

  const updateParam = (nextChecked: boolean) => {
    const nextSearchParams = new URLSearchParams(location.search);

    if (nextChecked) {
      nextSearchParams.set(paramKey, "1");
    } else {
      nextSearchParams.delete(paramKey);
    }

    navigate({
      pathname: location.pathname,
      search: nextSearchParams.toString(),
    });
  };

  if (kind === "checkbox") {
    return (
      <CheckboxApp
        name={paramKey}
        value={checked}
        label={checkboxLabel}
        wrapperClassName={checkboxWrapperClassName}
        labelClassName={labelClassName}
        onCheckedChange={updateParam}
      />
    );
  }

  return (
    <SwitchApp
      value={checked}
      onChange={updateParam}
      trueValue={switchTrueLabel}
      falseValue={switchFalseLabel}
      visible
      ariaLabel={ariaLabel}
      containerClassName={containerClassName}
      labelClassName={labelClassName}
      switchClassName={switchClassName}
    />
  );
}

export default UrlParamFlag;
