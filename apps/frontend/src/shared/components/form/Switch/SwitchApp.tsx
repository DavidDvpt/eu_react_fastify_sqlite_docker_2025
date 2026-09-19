import { Switch } from "@/components/ui/switch";

interface SwitchAppProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  containerClassName?: string;
  switchClassName?: string;
  labelClassName?: string;
  trueValue?: string;
  falseValue?: string;
  ariaLabel?: string;
  visible?: boolean;
}

function SwitchApp(props: SwitchAppProps) {
  const { trueValue = "", falseValue = "", visible = true } = props;

  if (!visible) {
    return null;
  }
  const containerClassName =
    props.containerClassName ||
    "flex h-full min-h-0 flex-col items-center justify-start gap-2 py-1";

  return (
    <div className={containerClassName}>
      <span className={props.labelClassName}>{falseValue}</span>
      <Switch
        checked={props.value}
        onCheckedChange={props.onChange}
        aria-label={props.ariaLabel}
        className={props.switchClassName}
      />
      <span className={props.labelClassName}>{trueValue}</span>
    </div>
  );
}

export default SwitchApp;
