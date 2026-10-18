import { Button } from "@/components/ui/button";

type ChatLogFilePickerProps = {
  onSelect: (file?: File) => Promise<void>;
};

type FilePickerWindow = Window & {
  showOpenFilePicker?: () => Promise<unknown[]>;
};

function ChatLogFilePicker({ onSelect }: ChatLogFilePickerProps) {
  const supportsLiveFileAccess = typeof (window as FilePickerWindow).showOpenFilePicker === "function";

  return (
    <>
      <Button type="button" variant="secondary" onClick={() => void onSelect()} disabled={!supportsLiveFileAccess}>
        Sélectionner chat.log (accès live)
      </Button>
      {!supportsLiveFileAccess && (
        <p className="m-0 text-sm text-error-500">
          Utilisez Chrome ou Brave pour permettre le suivi en direct de chat.log.
        </p>
      )}
    </>
  );
}

export default ChatLogFilePicker;
