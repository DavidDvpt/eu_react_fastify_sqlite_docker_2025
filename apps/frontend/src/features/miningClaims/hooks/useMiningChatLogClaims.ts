import { useEffect, useRef } from "react";

import { useCreateClaimApiV2MiningSessionIdClaimsPost } from "@/api/generated/react-query/entropiaManagerAPI";
import type { ItemResponse } from "@/api/generated/react-query/model/itemResponse";
import { getChatLog } from "@/features/chatLogSetup/services/chatLogStorage";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { getauthState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { MiningClaimParser } from "../services/miningClaimParser";
import type { MiningClaimPayload } from "../services/miningClaimParser";

const POLL_INTERVAL_MS = 1000;

type ClaimDepletedInfo = MiningClaimPayload & { depositSize: number | null };

export function useMiningChatLogClaims(
  sessionId: string | undefined,
  items: ItemResponse[],
  onClaimDepleted?: (claim: ClaimDepletedInfo) => void,
) {
  const parserRef = useRef(new MiningClaimParser());
  const inGameUsername = useAppSelector((state) => getauthState(state).user.result?.inGameUsername?.trim() ?? "");
  const offsetRef = useRef<number | null>(null);
  const pendingTextRef = useRef("");
  const pendingRef = useRef(false);
  const createClaim = useCreateClaimApiV2MiningSessionIdClaimsPost();

  useEffect(() => {
    if (!sessionId || !inGameUsername) return;
    parserRef.current.setPlayerName(inGameUsername);
    parserRef.current.reset();
    offsetRef.current = null;
    pendingTextRef.current = "";
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const readNewLines = async () => {
      try {
        const log = await getChatLog();
        if (!log || cancelled) return;
        if (log.source === "handle" && (await log.handle.queryPermission({ mode: "read" })) !== "granted") return;
        const file = log.source === "handle" ? await log.handle.getFile() : log.file;
        const offset = offsetRef.current ?? file.size;
        if (file.size < offset) offsetRef.current = file.size;
        if (file.size <= (offsetRef.current ?? offset)) return;

        const start = offsetRef.current ?? offset;
        const text = pendingTextRef.current + await file.slice(start).text();
        offsetRef.current = file.size;
        const lines = text.split(/\r?\n/);
        pendingTextRef.current = lines.pop() ?? "";
        for (const line of lines) {
          const payload = parserRef.current.processLine(line, items);
          if (!payload || pendingRef.current) continue;
          pendingRef.current = true;
          try {
            const { resourceName, ...apiPayload } = payload;
            // The generated API uses camelCase; Axios performs the project's
            // configured wire conversion for the backend contract.
            const createdClaim = await createClaim.mutateAsync({
              sessionId,
              data: { ...apiPayload, isAth: payload.isAth } as never,
            });
            const depletedInfo = { resourceName, ...apiPayload, depositSize: createdClaim.depositSize ?? null };
            console.log("Contenu de la snackbar", depletedInfo);
            onClaimDepleted?.(depletedInfo);
            parserRef.current.reset();
            await InvalidateQueryAndKeys.miningMutation();
          } catch (error) {
            console.error("Impossible d'envoyer le claim Mining", error, payload);
          } finally {
            pendingRef.current = false;
          }
        }
      } catch (error) {
        console.error("Impossible de lire les nouvelles lignes de chat.log", error);
      }
    };

    void readNewLines();
    const interval = window.setInterval(() => void readNewLines(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [createClaim, inGameUsername, items, onClaimDepleted, sessionId]);
}
