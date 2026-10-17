import { useCallback, useEffect, useState } from "react";

import { ApiStatus } from "@/lib/axios/ApiStatus";
import { selectAuthStatus, selectIsLoggued } from "@/store";
import { useAppSelector } from "@/store/hooks";
import { getChatLogHandle, removeChatLogHandle, saveChatLogHandle, type StoredChatLogHandle } from "../services/chatLogStorage";

export type ChatLogFileStatus = "loading" | "configured" | "missing" | "permission-required" | "invalid" | "error";

type FilePickerWindow = Window & {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: Array<{ description: string; accept: Record<string, string[]> }>;
  }) => Promise<StoredChatLogHandle[]>;
};

const isValidFile = (file: File) => file.name.toLowerCase().endsWith(".log");

function useChatLogSetup() {
  const authStatus = useAppSelector(selectAuthStatus);
  const isLoggedIn = useAppSelector(selectIsLoggued);
  const [status, setStatus] = useState<ChatLogFileStatus>("loading");
  const [handle, setHandle] = useState<StoredChatLogHandle | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const invalidateHandle = useCallback(async () => {
    await removeChatLogHandle();
    setHandle(null);
    setFileName("");
    setStatus("invalid");
  }, []);

  const inspectHandle = useCallback(async (storedHandle: StoredChatLogHandle) => {
    try {
      const permission = await storedHandle.queryPermission({ mode: "read" });
      if (permission === "prompt") {
        setHandle(storedHandle);
        setFileName(storedHandle.name);
        setStatus("permission-required");
        return;
      }
      if (permission !== "granted") {
        await invalidateHandle();
        return;
      }
      const file = await storedHandle.getFile();
      if (!isValidFile(file)) {
        await invalidateHandle();
        return;
      }
      setHandle(storedHandle);
      setFileName(file.name);
      setError(null);
      setStatus("configured");
    } catch {
      await invalidateHandle();
    }
  }, [invalidateHandle]);

  useEffect(() => {
    if (!isLoggedIn || authStatus !== ApiStatus.FULFILLED) return;
    let cancelled = false;
    void getChatLogHandle().then((storedHandle) => {
      if (cancelled) return;
      if (storedHandle) void inspectHandle(storedHandle);
      else setStatus("missing");
    }).catch(() => {
      if (!cancelled) {
        setError("Impossible de lire la configuration locale.");
        setStatus("error");
      }
    });
    return () => { cancelled = true; };
  }, [authStatus, inspectHandle, isLoggedIn]);

  const selectFile = useCallback(async () => {
    try {
      const picker = (window as FilePickerWindow).showOpenFilePicker;
      if (!picker) {
        setError("Ce navigateur ne prend pas en charge la sélection persistante de fichiers.");
        setStatus("error");
        return;
      }
      const [selectedHandle] = await picker({
        multiple: false,
        types: [{ description: "Entropia chat log", accept: {
          "text/plain": [".log"],
          "application/octet-stream": [".log"],
        } }],
      });
      const file = await selectedHandle.getFile();
      if (!isValidFile(file)) {
        setError("Sélectionnez un fichier .log d'Entropia Universe.");
        setStatus("invalid");
        return;
      }
      await saveChatLogHandle(selectedHandle);
      setHandle(selectedHandle);
      setFileName(file.name);
      setError(null);
      setStatus("configured");
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError("Impossible d'enregistrer ce fichier local.");
      setStatus("error");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!handle) return;
    try {
      const permission = await handle.requestPermission({ mode: "read" });
      if (permission === "granted") await inspectHandle(handle);
      else setStatus("invalid");
    } catch {
      await invalidateHandle();
    }
  }, [handle, inspectHandle, invalidateHandle]);

  return {
    error,
    fileName,
    isOpen: isLoggedIn && status !== "loading" && status !== "configured",
    onRequestPermission: requestPermission,
    onSelectFile: selectFile,
    status,
  };
}

export default useChatLogSetup;
