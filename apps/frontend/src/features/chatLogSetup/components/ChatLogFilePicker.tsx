import { useRef } from "react";

import { Button } from "@/components/ui/button";

type ChatLogFilePickerProps = {
  onSelect: (file: File) => Promise<void>;
};

function ChatLogFilePicker({ onSelect }: ChatLogFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".log,text/plain,application/octet-stream"
        className="hidden"
        onChange={(event) => {
          const [file] = Array.from(event.target.files ?? []);
          if (file) void onSelect(file);
          event.target.value = "";
        }}
      />
      <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
        Sélectionner chat.log
      </Button>
    </>
  );
}

export default ChatLogFilePicker;
