import { useEffect, useRef } from 'react';

import {
  getGetCurrentSessionApiV2SessionsCurrentGetQueryKey,
  useCreateClaimApiV2MiningSessionIdClaimsPost,
  useListClaimsApiV2MiningSessionIdClaimsGet,
  usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch,
  useCreateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesPost,
  useUpdateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdPut,
} from '@/api/generated/react-query/entropiaManagerAPI';
import { SessionType } from '@/api/generated/model';
import type { ItemResponse } from '@/api/generated/react-query/model/itemResponse';
import type { MiningClaimResponse } from '@/api/generated/react-query/model/miningClaimResponse';
import type { MiningResultLineResponse } from '@/api/generated/react-query/model/miningResultLineResponse';
import { getChatLog } from '@/features/chatLogSetup/services/chatLogStorage';
import { InvalidateQueryAndKeys } from '@/lib/react-query/InvalidateQueryAndKeys';
import { queryClient } from '@/lib/react-query/queryClient';
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
export type ResultLineUpdate = {
  id: string;
  itemId: string;
  quantity: number;
  isFinalized?: boolean;
};

export function useMiningChatLogClaims(
  sessionId: string | undefined,
  items: ItemResponse[],
  resultLines: MiningResultLineResponse[] = [],
  onClaimDetected?: (claim: ClaimDetectedInfo) => void,
  onClaimDepleted?: (claim: ClaimDepletedInfo) => void,
  onUnknownClaim?: (
    candidates: UnknownClaimCandidate[],
    resolve: (claimId: string) => void,
  ) => void,
  onResultLineChanged?: (line: ResultLineUpdate) => void,
) {
  const parserRef = useRef(new MiningClaimParser());
  const claimsQuery = useListClaimsApiV2MiningSessionIdClaimsGet(
    sessionId ?? '',
    { query: { enabled: Boolean(sessionId) } },
  );
  const inGameUsername = useAppSelector(
    (state) => getauthState(state).user.result?.inGameUsername?.trim() ?? '',
  );
  const offsetRef = useRef<number | null>(null);
  const pendingTextRef = useRef('');
  const pendingRef = useRef(false);
  const createClaim = useCreateClaimApiV2MiningSessionIdClaimsPost();
  const patchClaim = usePatchClaimApiV2MiningSessionIdClaimsClaimIdPatch();
  const createResultLine =
    useCreateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesPost();
  const updateResultLine =
    useUpdateMiningResourceLineApiV2SessionsMiningSessionIdResourceLinesLineIdPut();
  const resultLinesRef = useRef(resultLines);
  useEffect(() => {
    resultLinesRef.current = resultLines;
  }, [resultLines]);
  const toExtractRef = useRef<
    Array<{
      trackingId: number;
      id: string;
      resourceName: string;
      resourceType: MiningResourceType | null;
      itemId: string | null;
    }>
  >([]);
  const hydratedClaimIdsRef = useRef(new Set<string>());

  const updateCurrentSessionResultLine = (
    lineId: string,
    itemId: string,
    quantity: number,
  ) => {
    queryClient.setQueryData(
      getGetCurrentSessionApiV2SessionsCurrentGetQueryKey({
        type: SessionType.MINING,
      }),
      (session: unknown) => {
        if (
          !session ||
          typeof session !== 'object' ||
          !('resultLines' in session) ||
          !Array.isArray(session.resultLines)
        ) {
          return session;
        }
        const resultLines = session.resultLines as Array<{
          id: string;
          itemId: string;
          quantity: number | null;
          isFinalized?: boolean;
        }>;
        const lineIndex = resultLines.findIndex((line) => line.id === lineId);
        const nextLine = {
          id: lineId,
          itemId,
          quantity,
          isFinalized: false,
        };
        return {
          ...session,
          resultLines:
            lineIndex >= 0
              ? resultLines.map((line, index) =>
                  index === lineIndex ? { ...line, ...nextLine } : line,
                )
              : [...resultLines, nextLine],
        };
      },
    );
  };

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
    hydratedClaimIdsRef.current.clear();
    pendingRef.current = false;
    console.log(
      LISTENER_LOG_PREFIX,
      'Parser prêt, lecture depuis la fin du fichier au prochain passage',
    );
  }, [inGameUsername, sessionId]);

  useEffect(() => {
    if (
      !sessionId ||
      !claimsQuery.data ||
      claimsQuery.data.session.id !== sessionId
    )
      return;

    for (const claim of claimsQuery.data.claims) {
      if (
        claim.depleted ||
        hydratedClaimIdsRef.current.has(claim.id) ||
        !claim.item
      ) {
        continue;
      }
      const trackingId = parserRef.current.restoreClaim({
        resourceName: claim.item.name,
        resourceType: null,
        itemId: claim.item.id,
        quantity: claim.quantity,
        value: claim.value === null ? null : Number(claim.value),
        isGlobal: claim.isGlobal,
        isHof: claim.isHof,
      });
      toExtractRef.current.push({
        trackingId,
        id: claim.id,
        resourceName: claim.item.name,
        resourceType: null,
        itemId: claim.item.id,
      });
      hydratedClaimIdsRef.current.add(claim.id);
    }
  }, [claimsQuery.data, inGameUsername, sessionId]);

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
        pendingClaim.itemId = updatedClaim.item?.id ?? pendingClaim.itemId;
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
        claim.itemId = updatedClaim.item?.id ?? claim.itemId;
        if (claim.itemId && event.payload.quantity > 0) {
          const existingLine = resultLinesRef.current.find(
            (line) =>
              line.itemId === claim.itemId && line.isFinalized !== true,
          );
          const quantity =
            (existingLine?.quantity ?? 0) + event.payload.quantity;

          if (existingLine) {
            const updatedLine = await updateResultLine.mutateAsync({
              sessionId,
              lineId: existingLine.id,
              data: { quantity },
            });
            existingLine.quantity = updatedLine.quantity ?? quantity;
            updateCurrentSessionResultLine(
              existingLine.id,
              claim.itemId,
              existingLine.quantity,
            );
            onResultLineChanged?.({
              id: existingLine.id,
              itemId: claim.itemId,
              quantity: existingLine.quantity,
              isFinalized: existingLine.isFinalized,
            });
          } else {
            const createdLine = await createResultLine.mutateAsync({
              sessionId,
              data: {
                itemId: claim.itemId,
                quantity: event.payload.quantity,
              },
            });
            resultLinesRef.current.push({
              id: createdLine.id,
              sessionId: createdLine.sessionId,
              lotId: createdLine.lotId,
              type: createdLine.type,
              createdAt: createdLine.createdAt,
              quantity: createdLine.quantity ?? event.payload.quantity,
              decay: createdLine.decay,
              isFinalized: createdLine.isFinalized,
              itemId: claim.itemId,
            });
            updateCurrentSessionResultLine(
              createdLine.id,
              claim.itemId,
              createdLine.quantity ?? event.payload.quantity,
            );
            onResultLineChanged?.({
              id: createdLine.id,
              itemId: claim.itemId,
              quantity: createdLine.quantity ?? event.payload.quantity,
              isFinalized: createdLine.isFinalized,
            });
          }
        }
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
          console.log(LISTENER_LOG_PREFIX, 'État toExtract avant parsing', {
            toExtract: toExtractRef.current,
          });
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
    createResultLine,
    inGameUsername,
    items,
    onClaimDetected,
    onClaimDepleted,
    onUnknownClaim,
    onResultLineChanged,
    patchClaim,
    updateResultLine,
    sessionId,
  ]);
}
