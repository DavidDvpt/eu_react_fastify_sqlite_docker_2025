import { useEffect, useRef } from "react";

import { useCreateClaimApiV2MiningSessionIdClaimsPost } from "@/api/generated/react-query/entropiaManagerAPI";
import type { ItemResponse } from "@/api/generated/react-query/model/itemResponse";
import { getChatLog } from "@/features/chatLogSetup/services/chatLogStorage";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { getauthState } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { MiningClaimParser } from "../services/miningClaimParser";
import type { MiningClaimParserEvent, MiningClaimPayload } from "../services/miningClaimParser";

const POLL_INTERVAL_MS = 1000;
const LISTENER_LOG_PREFIX = "[ChatLogListener]";

type ClaimDepletedInfo = MiningClaimPayload & { depositSize: number | null };
type ClaimDetectedInfo = { resourceName: string };

export function useMiningChatLogClaims(
  sessionId: string | undefined,
  items: ItemResponse[],
  onClaimDetected?: (claim: ClaimDetectedInfo) => void,
  onClaimDepleted?: (claim: ClaimDepletedInfo) => void,
) {
  const parserRef = useRef(new MiningClaimParser());
  const inGameUsername = useAppSelector((state) => getauthState(state).user.result?.inGameUsername?.trim() ?? "");
  const offsetRef = useRef<number | null>(null);
  const pendingTextRef = useRef("");
  const pendingRef = useRef(false);
  const createClaim = useCreateClaimApiV2MiningSessionIdClaimsPost();

  useEffect(() => {
    console.log(LISTENER_LOG_PREFIX, "Configuration du parser", {
      sessionId,
      inGameUsername,
    });
    if (!sessionId || !inGameUsername) {
      console.log(LISTENER_LOG_PREFIX, "Parser non configuré : sessionId ou pseudo manquant");
      return;
    }
    parserRef.current.setPlayerName(inGameUsername);
    parserRef.current.reset();
    offsetRef.current = null;
    pendingTextRef.current = "";
    console.log(LISTENER_LOG_PREFIX, "Parser prêt, lecture depuis la fin du fichier au prochain passage");
  }, [sessionId]);

  useEffect(() => {
    console.log(LISTENER_LOG_PREFIX, "Initialisation du listener", {
      sessionId,
      inGameUsername,
      itemCount: items.length,
    });
    if (!sessionId) {
      console.log(LISTENER_LOG_PREFIX, "Listener inactif : aucune session Mining active");
      return;
    }
    let cancelled = false;

    const readNewLines = async () => {
      try {
        const log = await getChatLog();
        if (!log || cancelled) {
          return;
        }
        if (log.source === "handle") {
          const permission = await log.handle.queryPermission({ mode: "read" });
          if (permission !== "granted") {
            return;
          }
        }
        const file = log.source === "handle" ? await log.handle.getFile() : log.file;
        if (offsetRef.current === null) {
          offsetRef.current = file.size;
          console.log(LISTENER_LOG_PREFIX, "Fichier initialisé", {
            source: log.source,
            fileName: file.name,
            initialSize: file.size,
          });
          return;
        }
        const offset = offsetRef.current ?? file.size;
        if (file.size < offset) {
          console.log(LISTENER_LOG_PREFIX, "Fichier tronqué ou recréé, reset de l'offset", {
            previousOffset: offset,
            newOffset: file.size,
          });
          offsetRef.current = file.size;
        }
        if (file.size <= (offsetRef.current ?? offset)) {
          return;
        }

        const start = offsetRef.current ?? offset;
        console.log(LISTENER_LOG_PREFIX, "Modification détectée dans chat.log", {
          fileName: file.name,
          previousOffset: start,
          newFileSize: file.size,
          addedBytes: file.size - start,
        });
        const text = pendingTextRef.current + await file.slice(start).text();
        offsetRef.current = file.size;
        const lines = text.split(/\r?\n/);
        pendingTextRef.current = lines.pop() ?? "";
        console.log(LISTENER_LOG_PREFIX, "Nouvelles données lues", {
          start,
          textLength: text.length,
          completeLineCount: lines.length,
          pendingTextLength: pendingTextRef.current.length,
        });
        for (const line of lines) {
          console.log(LISTENER_LOG_PREFIX, "Ligne reçue", line);
          const event: MiningClaimParserEvent | null = parserRef.current.processLine(line, items);
          console.log(LISTENER_LOG_PREFIX, "Résultat du parser", {
            event,
            requestPending: pendingRef.current,
          });
          if (!event) {
            console.log(LISTENER_LOG_PREFIX, "Ligne ignorée : aucun claim complet");
            continue;
          }
          if (event.type === "claim-detected") {
            console.log(LISTENER_LOG_PREFIX, "Claim détecté", event);
            onClaimDetected?.(event);
            continue;
          }
          const payload = event.payload;
          if (pendingRef.current) {
            console.log(LISTENER_LOG_PREFIX, "Claim ignoré : une requête est déjà en cours");
            continue;
          }
          pendingRef.current = true;
          try {
            const { resourceName, ...apiPayload } = payload;
            console.log(LISTENER_LOG_PREFIX, "Envoi du claim à l'API", {
              sessionId,
              resourceName,
              apiPayload,
            });
            // The generated API uses camelCase; Axios performs the project's
            // configured wire conversion for the backend contract.
            const createdClaim = await createClaim.mutateAsync({
              sessionId,
              data: { ...apiPayload, isAth: payload.isAth } as never,
            });
            console.log(LISTENER_LOG_PREFIX, "Claim créé par l'API", createdClaim);
            const depletedInfo = { resourceName, ...apiPayload, depositSize: createdClaim.depositSize ?? null };
            console.log("Contenu de la snackbar", depletedInfo);
            onClaimDepleted?.(depletedInfo);
            parserRef.current.reset();
            console.log(LISTENER_LOG_PREFIX, "Parser reset après création du claim");
            await InvalidateQueryAndKeys.miningMutation();
            console.log(LISTENER_LOG_PREFIX, "Queries Mining invalidées");
          } catch (error) {
            console.error(LISTENER_LOG_PREFIX, "Impossible d'envoyer le claim Mining", error, payload);
          } finally {
            pendingRef.current = false;
            console.log(LISTENER_LOG_PREFIX, "Fin du traitement du claim");
          }
        }
      } catch (error) {
        console.error(LISTENER_LOG_PREFIX, "Impossible de lire les nouvelles lignes de chat.log", error);
      }
    };

    console.log(LISTENER_LOG_PREFIX, "Premier polling immédiat");
    void readNewLines();
    const interval = window.setInterval(() => void readNewLines(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      console.log(LISTENER_LOG_PREFIX, "Listener arrêté");
    };
  }, [createClaim, inGameUsername, items, onClaimDetected, onClaimDepleted, sessionId]);
}
