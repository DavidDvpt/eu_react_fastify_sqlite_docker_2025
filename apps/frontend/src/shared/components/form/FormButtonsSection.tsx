import { Button } from "@/components/ui/button";

interface FormButtonSection {
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  cancelVisible?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
}

function FormButtonsSection(props: FormButtonSection) {
  return (
    <div className="flex justify-center m-4">
      <Button
        type="reset"
        variant="secondary"
        onClick={props.onCancel}
        size="lg"
        className="w-[140px] mr-4"
      >
        {props.cancelLabel ?? "Annuler"}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={props.submitDisabled}
        size="lg"
        className="w-[140px]"
      >
        {props.submitLabel ?? "Valider"}
      </Button>
    </div>
  );
}

export default FormButtonsSection;
