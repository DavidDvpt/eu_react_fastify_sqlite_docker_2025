import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ModalGeneric } from '@/shared/components';
import { GenericForm } from '@/shared/components/form/Genericform';
import InputRHF from '@/shared/components/form/Input/InputRHF';

const schema = z.object({
  inGameUsername: z.string().trim().min(1, 'Le pseudo en jeu est requis'),
});

type InGameUsernameSetupModalProps = {
  error: string | null;
  isOpen: boolean;
  onSubmit: (value: { inGameUsername: string }) => Promise<void>;
};

function InGameUsernameSetupModal({
  error,
  isOpen,
  onSubmit,
}: InGameUsernameSetupModalProps) {
  return (
    <ModalGeneric
      dialogType="form"
      open={isOpen}
      noClose
      title={{ value: 'Configurer le pseudo en jeu' }}
      description={{
        value:
          "Ce pseudo permet d'identifier vos événements Mining dans chat.log. Respectez exactement les majuscules et minuscules du pseudo affiché dans Entropia Universe.",
      }}
    >
      <GenericForm
        schema={schema}
        defaultValues={{ inGameUsername: '' }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <InputRHF
          name="inGameUsername"
          label="Pseudo Entropia Universe"
          placeholder="Votre pseudo en jeu"
          autoComplete="off"
        />
        <Button type="submit">Enregistrer</Button>
        {error && <p className="m-0 text-sm text-error-500">{error}</p>}
      </GenericForm>
    </ModalGeneric>
  );
}

export default InGameUsernameSetupModal;
