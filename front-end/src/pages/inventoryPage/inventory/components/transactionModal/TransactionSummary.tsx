import { cn } from "@/lib/utils";
import { FormatTools } from "@/shared/tools";

interface TransactionSummaryProps {
  ttValue: number;
  feeValue: number;
  ttcValue: number;
}

function TransactionSummary({
  ttValue,
  feeValue,
  ttcValue,
}: TransactionSummaryProps) {
  const deltaValue = ttcValue - ttValue;
  const markup = ttValue > 0 ? (ttcValue / ttValue) * 100 : 0;
  const netMarkup =
    ttValue > 0 && ttcValue > 0 ? ((ttcValue - feeValue) / ttValue) * 100 : 0;

  const deltaStyle = cn(
    "m-0",
    deltaValue < 0
      ? "text-destructive-700"
      : deltaValue === 0
        ? "text-black"
        : "text-success-700",
  );
  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between fle-row">
        <p className="m-0">
          Cout TT : {FormatTools.pedFormat().format(ttValue)} Ped
        </p>
        <p className={deltaStyle}>
          Delta : {FormatTools.pedFormat().format(deltaValue)} Ped
        </p>
      </div>
      <div className="flex justify-between fle-row">
        <p className="m-0">Markup : {markup.toFixed(2)}%</p>
        <p className={deltaStyle}>Delta : {deltaValue.toFixed(2)} Ped</p>
      </div>
      <div className="flex justify-between fle-row">
        <p className="m-0">Markup Net: {netMarkup.toFixed(2)}%</p>
        <p className={deltaStyle}>
          Delta : {FormatTools.pedFormat().format(deltaValue - feeValue)} Ped
        </p>
      </div>
    </div>
  );
}

export default TransactionSummary;
