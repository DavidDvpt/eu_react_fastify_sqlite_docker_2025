import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FormButtonSection {
  className?: string;
  fullWidth?: boolean;
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
    <div className={cn('flex justify-center m-4', props.className)}>
      {props.cancelVisible !== false && (
        <Button
          type="reset"
          variant="secondary"
          onClick={props.onCancel}
          disabled={props.cancelDisabled}
          size="lg"
          className={cn(
            props.fullWidth ? 'min-w-0 flex-1' : 'w-[140px]',
            'mr-4',
          )}
        >
          {props.cancelLabel ?? 'Annuler'}
        </Button>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={props.submitDisabled}
        size="lg"
        className={props.fullWidth ? 'min-w-0 flex-1' : 'w-[140px]'}
      >
        {props.submitLabel ?? 'Valider'}
      </Button>
    </div>
  );
}

export default FormButtonsSection;
