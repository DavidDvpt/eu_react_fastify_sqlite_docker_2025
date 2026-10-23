import { useCallback, useEffect, useState } from 'react';

import { ApiStatus } from '@/lib/axios/ApiStatus';
import { selectAuthStatus, selectIsLoggued } from '@/store';
import { useAppSelector } from '@/store/hooks';
import {
  getChatLog,
  removeChatLogHandle,
  saveChatLog,
  type StoredChatLog,
  type StoredChatLogHandle,
} from '../services/chatLogStorage';

export type ChatLogFileStatus =
  | 'loading'
  | 'configured'
  | 'missing'
  | 'permission-required'
  | 'invalid'
  | 'error';

type FilePickerWindow = Window & {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<StoredChatLogHandle[]>;
};

const isValidFile = (file: File) => file.name.toLowerCase().endsWith('.log');

function useChatLogSetup() {
  const authStatus = useAppSelector(selectAuthStatus);
  const isLoggedIn = useAppSelector(selectIsLoggued);
  const [status, setStatus] = useState<ChatLogFileStatus>('loading');
  const [log, setLog] = useState<StoredChatLog | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const invalidateHandle = useCallback(async () => {
    await removeChatLogHandle();
    setLog(null);
    setFileName('');
    setStatus('invalid');
  }, []);

  const inspectLog = useCallback(
    async (storedLog: StoredChatLog) => {
      try {
        // A File obtained from <input type="file"> is only a snapshot. It cannot
        // be refreshed when the game appends new lines to chat.log.
        if (storedLog.source === 'file') {
          await invalidateHandle();
          return;
        }
        if (storedLog.source === 'handle') {
          const permission = await storedLog.handle.queryPermission({
            mode: 'read',
          });
          if (permission === 'prompt') {
            setLog(storedLog);
            setFileName(storedLog.handle.name);
            setStatus('permission-required');
            return;
          }
          if (permission !== 'granted') {
            await invalidateHandle();
            return;
          }
        }
        const file = await storedLog.handle.getFile();
        if (!isValidFile(file)) {
          await invalidateHandle();
          return;
        }
        setLog(storedLog);
        setFileName(file.name);
        setError(null);
        setStatus('configured');
      } catch {
        await invalidateHandle();
      }
    },
    [invalidateHandle],
  );

  useEffect(() => {
    if (!isLoggedIn || authStatus !== ApiStatus.FULFILLED) return;
    let cancelled = false;
    void getChatLog()
      .then((storedLog) => {
        if (cancelled) return;
        if (storedLog) void inspectLog(storedLog);
        else setStatus('missing');
      })
      .catch(() => {
        if (!cancelled) {
          setError('Impossible de lire la configuration locale.');
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [authStatus, inspectLog, isLoggedIn]);

  const selectFile = useCallback(async (fallbackFile?: File) => {
    try {
      if (fallbackFile) {
        if (!isValidFile(fallbackFile)) {
          setError("Sélectionnez un fichier .log d'Entropia Universe.");
          setStatus('invalid');
          return;
        }
        const storedLog: StoredChatLog = { source: 'file', file: fallbackFile };
        await saveChatLog(storedLog);
        setLog(storedLog);
        setFileName(fallbackFile.name);
        setError(null);
        setStatus('configured');
        return;
      }
      const picker = (window as FilePickerWindow).showOpenFilePicker;
      if (!picker) {
        setError('Utilisez le sélecteur de fichier ci-dessous.');
        return;
      }
      const [selectedHandle] = await picker({
        multiple: false,
        types: [
          {
            description: 'Entropia chat log',
            accept: {
              'text/plain': ['.log'],
              'application/octet-stream': ['.log'],
            },
          },
        ],
      });
      const file = await selectedHandle.getFile();
      if (!isValidFile(file)) {
        setError("Sélectionnez un fichier .log d'Entropia Universe.");
        setStatus('invalid');
        return;
      }
      const storedLog: StoredChatLog = {
        source: 'handle',
        handle: selectedHandle,
      };
      await saveChatLog(storedLog);
      setLog(storedLog);
      setFileName(file.name);
      setError(null);
      setStatus('configured');
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      setError("Impossible d'enregistrer ce fichier local.");
      setStatus('error');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!log || log.source !== 'handle') return;
    try {
      const permission = await log.handle.requestPermission({ mode: 'read' });
      if (permission === 'granted' && log.source === 'handle')
        await inspectLog(log);
      else setStatus('invalid');
    } catch {
      await invalidateHandle();
    }
  }, [inspectLog, invalidateHandle, log]);

  return {
    error,
    fileName,
    isOpen: isLoggedIn && status !== 'loading' && status !== 'configured',
    onRequestPermission: requestPermission,
    onSelectFile: selectFile,
    status,
  };
}

export default useChatLogSetup;
