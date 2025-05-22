import { useSyncExternalStore, useCallback, useMemo, useEffect } from "react";
import superjson from "superjson";

export type StorageWrapper<T> =
  | {
      type: "value";
      value: T;
    }
  | {
      type: "cleared";
    };

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  // One-time migration of legacy data
  const migrateData = useCallback(() => {
    const data = localStorage.getItem(key);
    if (!data) return;

    try {
      // Try parsing as superjson first
      const parsed = superjson.parse(data);
      // Skip if already in wrapper format
      if (parsed && typeof parsed === "object" && "type" in parsed) {
        return;
      }
      // Migrate legacy data to wrapper format
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value: parsed as T
      };
      localStorage.setItem(key, superjson.stringify(wrapper));
    } catch {
      // If can't parse as superjson, try as plain value
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value: data as T
      };
      localStorage.setItem(key, superjson.stringify(wrapper));
    }
  }, [key]);

  // Run migration once when hook is initialized
  useEffect(() => {
    migrateData();
  }, [migrateData]);

  const getSnapshot = useCallback(() => {
    return localStorage.getItem(key);
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const onStorageEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail.key === key) {
          onChange();
        }
      };
      window.addEventListener("storage", onChange);
      window.addEventListener(
        "local-storage-change",
        onStorageEvent as EventListener
      );
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(
          "local-storage-change",
          onStorageEvent as EventListener
        );
      };
    },
    [key]
  );

  const rawData = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const data = useMemo(() => {
    if (!rawData) {
      return initialValue;
    }
    try {
      const parsed = superjson.parse(rawData) as StorageWrapper<T>;
      if (parsed.type === "cleared") {
        return undefined;
      }
      return parsed.value;
    } catch {
      return initialValue;
    }
  }, [rawData, initialValue]);

  const setData = useCallback(
    (value: T) => {
      const wrapper: StorageWrapper<T> = {
        type: "value",
        value
      };
      localStorage.setItem(key, superjson.stringify(wrapper));
      window.dispatchEvent(
        new CustomEvent("local-storage-change", { detail: { key } })
      );
    },
    [key]
  );

  const clearData = useCallback(() => {
    const wrapper: StorageWrapper<T> = {
      type: "cleared"
    };
    localStorage.setItem(key, superjson.stringify(wrapper));
    window.dispatchEvent(
      new CustomEvent("local-storage-change", { detail: { key } })
    );
  }, [key]);

  return useMemo(
    () => [data, setData, clearData] as const,
    [data, setData, clearData]
  );
};
