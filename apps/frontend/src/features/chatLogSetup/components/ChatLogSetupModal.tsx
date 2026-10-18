import { z } from "zod";

import { Button } from "@/components/ui/button";
import { ModalGeneric } from "@/shared/components";
import { GenericForm } from "@/shared/components/form/Genericform";
import InputRHF from "@/shared/components/form/Input/InputRHF";
import ChatLogFilePicker from "./ChatLogFilePicker";
import type { ChatLogFileStatus } from "../hooks/useChatLogSetup";

const schema = z.object({ fileName: z.string() });

type ChatLogSetupModalProps = {
  error: string | null;
  fileName: string;
  isOpen: boolean;
  onRequestPermission: () => Promise<void>;
  onSelectFile: (file?: File) => Promise<void>;
  status: ChatLogFileStatus;
  isBlocked?: boolean;
};

function ChatLogSetupModal({ error, fileName, isBlocked = false, isOpen, onRequestPermission, onSelectFile, status }: ChatLogSetupModalProps) {
  const needsPermission = status === "permission-required";
  return (
    <ModalGeneric
      dialogType="form"
      open={isOpen && !isBlocked}
      noClose
      title={{ value: "Configurer le fichier chat.log" }}
      description={{ value: "Entropia Manager a besoin du fichier chat.log d'Entropia Universe pour permettre le tracking des événements de jeu." }}
    >
      <GenericForm
        schema={schema}
        defaultValues={{ fileName: "" }}
        onSubmit={async () => {
          if (needsPermission) await onRequestPermission();
          else await onSelectFile();
        }}
        className="flex flex-col gap-4"
      >
        <InputRHF name="fileName" label="Fichier sélectionné" placeholder="Aucun fichier sélectionné" value={fileName} readOnly />
        {needsPermission ? (
          <Button type="submit">Autoriser l'accès au fichier</Button>
        ) : (
          <ChatLogFilePicker onSelect={(file) => onSelectFile(file)} />
        )}
        {error && <p className="m-0 text-sm text-error-500">{error}</p>}
      </GenericForm>
    </ModalGeneric>
  );
}

export default ChatLogSetupModal;
