import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type {
  TransactionAction,
  TransactionModalQueries,
  UseTransactionQueriesResult,
} from "../types";

function parseTransactionModalQuery(
  query: string | null,
): TransactionModalQueries | null {
  if (!query) return null;

  try {
    const params = JSON.parse(decodeURIComponent(query)) as Record<
      string,
      string
    >;

    if (!params.action || !params.itemId || !params.closePath) {
      return null;
    }

    return {
      action: params.action as TransactionAction,
      itemId: params.itemId || "",
      quantity: Number(params.quantity) || 0,
      ttc: Number(params.ttc) || 0,
      closePath: params.closePath,
    };
  } catch {
    return null;
  }
}

function useTransactionQueries(): UseTransactionQueriesResult {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("transactionModal");

  const queries = useMemo(
    () => parseTransactionModalQuery(query),
    [query],
  );

  const updateQueries = useCallback(
    (nextQueries: TransactionModalQueries | null) => {
      if (!nextQueries) {
        if (queries?.closePath) {
          navigate(queries.closePath);
        }
        return;
      }

      const search = new URLSearchParams();
      search.set("transactionModal", JSON.stringify(nextQueries));

      navigate({
        pathname: nextQueries.closePath,
        search: `?${search.toString()}`,
      });
    },
    [navigate, queries],
  );

  return { queries, updateQueries };
}

export default useTransactionQueries;
