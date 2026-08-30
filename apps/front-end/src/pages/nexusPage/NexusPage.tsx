import { Panel } from "@/shared/components/Containers";
import { NexusList } from "./components";

function NexusPage() {
  return (
    <Panel className="min-h-0 gap-2">
      <NexusList className="min-h-0" />
    </Panel>
  );
}

export default NexusPage;
