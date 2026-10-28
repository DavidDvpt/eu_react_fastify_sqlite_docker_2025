import { useEffect, useRef } from 'react';

import {
  useCreateClaimApiV2MiningSessionIdClaimsPost,
  usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch,
} from '@/api/generated/react-query/entropiaManagerAPI';
import type { ItemResponse } from '@/api/generated/react-query/model/itemResponse';
import type { MiningClaimResponse } from '@/api/generated/react-query/model/miningClaimResponse';
import { getChatLog } from '@/features/chatLogSetup/services/chatLogStorage';
import { InvalidateQueryAndKeys } from '@/lib/react-query/InvalidateQueryAndKeys';
import { getauthState } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { MiningClaimParser } from '../services/miningClaimParser';
import type {
  MiningClaimParserEvent,
  MiningResourceType,
} from '../services/miningClaimParser';

const POLL_INTERVAL_MS = 1000;
const LISTENER_LOG_PREFIX = '[ChatLogListener]';

export type ClaimDetectedInfo = MiningClaimResponse & { resourceName: string };
export type ClaimDepletedInfo = MiningClaimResponse & { resourceName: string };
export type UnknownClaimCandidate = { id: string; resourceName: string };

export function useMiningChatLogClaims(
  sessionId: string | undefined,
  items: ItemResponse[],
  onClaimDetected?: (claim: ClaimDetectedInfo) => void,
  onClaimDepleted?: (claim: ClaimDepletedInfo) => void,
  onUnknownClaim?: (
    candidates: UnknownClaimCandidate[],
    resolve: (claimId: string) => void,
  ) => void,
) {
  const parserRef = useRef(new MiningClaimParser());
  const inGameUsername = useAppSelector(
    (state) => getauthState(state).user.result?.inGameUsername?.trim() ?? '',
  );
  const offsetRef = useRef<number | null>(null);
  const pendingTextRef = useRef('');
  const pendingRef = useRef(false);
  const createClaim = useCreateClaimApiV2MiningSessionIdClaimsPost();
  const patchClaim = usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch();
  const toExtractRef = useRef<
    Array<{
      trackingId: number;
      id: string;
      resourceName: string;
      resourceType: MiningResourceType;
      itemId: string | null;
    }>
  >([]);

  useEffect(() => {
    console.log(LISTENER_LOG_PREFIX, 'Configuration du parser', {
      sessionId,
      inGameUsername,
    });
    if (!sessionId || !inGameUsername) {
      console.log(
        LISTENER_LOG_PREFIX,
        'Parser non configuré : sessionId ou pseudo manquant',
      );
      return;
    }
    parserRef.current.setPlayerName(inGameUsername);
    parserRef.current.reset();
    offsetRef.current = null;
    pendingTextRef.current = '';
    toExtractRef.current = [];
    pendingRef.current = false;
    console.log(
      LISTENER_LOG_PREFIX,
      'Parser prêt, lecture depuis la fin du fichier au prochain passage',
    );
  }, [sessionId]);

  useEffect(() => {
    console.log(LISTENER_LOG_PREFIX, 'Initialisation du listener', {
      sessionId,
      inGameUsername,
      itemCount: items.length,
    });
    if (!sessionId) {
      console.log(
        LISTENER_LOG_PREFIX,
        'Listener inactif : aucune session Mining active',
      );
      return;
    }
    void onUnknownClaim;
    let cancelled = false;

    const findPendingClaim = (trackingId: number) =>
      toExtractRef.current.find(
        (claim) => claim.trackingId === trackingId,
      );

    const processClaimEvent = async (event: MiningClaimParserEvent) => {
      if (event.type === 'claim-detected') {
        const {
          resourceName,
          resourceType,
          itemId,
          quantity,
          value,
          isGlobal,
          isHof,
        } = event.payload;
        const createdClaim = await createClaim.mutateAsync({
          sessionId,
          data: {
            itemId: itemId || null,
            quantity: quantity > 0 ? quantity : null,
            value: value > 0 ? value : null,
            isGlobal,
            isHof,
          },
        });
        toExtractRef.current.push({
          trackingId: event.payload.trackingId,
          id: createdClaim.id,
          resourceName,
          resourceType,
          itemId: createdClaim.item?.id ?? null,
        });
        onClaimDetected?.({ ...createdClaim, resourceName });
        await InvalidateQueryAndKeys.miningMutation(sessionId);
        return;
      }

      const pendingClaim = findPendingClaim(
        event.payload.trackingId,
      );
      if (!pendingClaim) return;

      if (event.type === 'claim-updated') {
        const updatedClaim = await patchClaim.mutateAsync({
          sessionId,
          claimId: pendingClaim.id,
          data: {
            itemId: pendingClaim.itemId,
            ...(event.payload.quantity > 0
              ? { quantity: event.payload.quantity }
              : {}),
            isHof: event.payload.isHof,
            depleted: false,
          },
        });
        pendingClaim.itemId = updatedClaim.item?.id ?? null;
        return;
      }

      const completeDepletion = async (claim: {
        id: string;
        itemId: string | null;
      }) => {
        const updatedClaim = await patchClaim.mutateAsync({
          sessionId,
          claimId: claim.id,
          data: {
            itemId: claim.itemId,
            quantity:
              event.payload.quantity > 0 ? event.payload.quantity : null,
            isHof: event.payload.isHof,
            depleted: true,
          },
        });
        claim.itemId = updatedClaim.item?.id ?? null;
        toExtractRef.current = toExtractRef.current.filter(
          (queuedClaim) => queuedClaim.id !== claim.id,
        );
        onClaimDepleted?.({
          ...updatedClaim,
          resourceName: event.payload.resourceName,
        });
        parserRef.current.resetActiveClaim();
        await InvalidateQueryAndKeys.miningMutation(sessionId);
      };

      await completeDepletion(pendingClaim);
    };

    const readNewLines = async () => {
      try {
        const log = await getChatLog();
        if (!log || cancelled) {
          return;
        }
        if (log.source === 'handle') {
          const permission = await log.handle.queryPermission({ mode: 'read' });
          if (permission !== 'granted') {
            return;
          }
        }
        const file =
          log.source === 'handle' ? await log.handle.getFile() : log.file;
        if (offsetRef.current === null) {
          offsetRef.current = file.size;
          console.log(LISTENER_LOG_PREFIX, 'Fichier initialisé', {
            source: log.source,
            fileName: file.name,
            initialSize: file.size,
          });
          return;
        }
        const offset = offsetRef.current ?? file.size;
        if (file.size < offset) {
          console.log(
            LISTENER_LOG_PREFIX,
            "Fichier tronqué ou recréé, reset de l'offset",
            {
              previousOffset: offset,
              newOffset: file.size,
            },
          );
          offsetRef.current = file.size;
        }
        if (file.size <= (offsetRef.current ?? offset)) {
          return;
        }

        const start = offsetRef.current ?? offset;
        console.log(
          LISTENER_LOG_PREFIX,
          'Modification détectée dans chat.log',
          {
            fileName: file.name,
            previousOffset: start,
            newFileSize: file.size,
            addedBytes: file.size - start,
          },
        );
        const text = pendingTextRef.current + (await file.slice(start).text());
        offsetRef.current = file.size;
        const lines = text.split(/\r?\n/);
        pendingTextRef.current = lines.pop() ?? '';
        console.log(LISTENER_LOG_PREFIX, 'Nouvelles données lues', {
          start,
          textLength: text.length,
          completeLineCount: lines.length,
          pendingTextLength: pendingTextRef.current.length,
        });
        for (const line of lines) {
          console.log(LISTENER_LOG_PREFIX, 'Ligne reçue', line);
          const event: MiningClaimParserEvent | null =
            parserRef.current.processLine(line, items);
          console.log(LISTENER_LOG_PREFIX, 'Résultat du parser', {
            event,
            requestPending: pendingRef.current,
          });
          if (!event) {
            console.log(
              LISTENER_LOG_PREFIX,
              'Ligne ignorée : aucun claim complet',
            );
            continue;
          }
          pendingRef.current = true;
          try {
            await processClaimEvent(event);
          } catch (error) {
            console.error(
              LISTENER_LOG_PREFIX,
              'Impossible de traiter le claim Mining',
              error,
              event,
            );
          } finally {
            pendingRef.current = false;
            console.log(LISTENER_LOG_PREFIX, 'Fin du traitement du claim');
          }
        }
      } catch (error) {
        console.error(
          LISTENER_LOG_PREFIX,
          'Impossible de lire les nouvelles lignes de chat.log',
          error,
        );
      }
    };

    console.log(LISTENER_LOG_PREFIX, 'Premier polling immédiat');
    void readNewLines();
    const interval = window.setInterval(
      () => void readNewLines(),
      POLL_INTERVAL_MS,
    );
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      console.log(LISTENER_LOG_PREFIX, 'Listener arrêté');
    };
  }, [
    createClaim,
    inGameUsername,
    items,
    onClaimDetected,
    onClaimDepleted,
    onUnknownClaim,
    patchClaim,
    sessionId,
  ]);
}
