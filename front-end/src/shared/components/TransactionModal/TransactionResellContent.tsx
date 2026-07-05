import { Button } from "@/components/ui/button";

interface TransactionResellContentProps {
  onResellValidate: () => void;
}

function TransactionResellContent({
  onResellValidate,
}: TransactionResellContentProps) {
  return (
    <div>
      TransactionResellContent{" "}
      <Button onClick={onResellValidate}>Valider</Button>
    </div>
  );
}

export default TransactionResellContent;
