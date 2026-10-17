import { Button } from "@/components/ui/button";

type ChatLogFilePickerProps = {
  onSelect: () => Promise<void>;
};

function ChatLogFilePicker({ onSelect }: ChatLogFilePickerProps) {
  return (
    <Button type="button" variant="secondary" onClick={() => void onSelect()}>
      Sélectionner chat.log
    </Button>
  );
}

export default ChatLogFilePicker;
