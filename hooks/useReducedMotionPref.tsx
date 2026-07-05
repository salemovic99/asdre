"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Merges the OS `prefers-reduced-motion` setting with a user-facing toggle
 * (persisted in localStorage). `reduced` is the effective value every motion
 * component should consult before running non-essential / infinite animation.
 *
 * The user toggle lives in a tiny module-level store read via
 * useSyncExternalStore, so it hydrates without a setState-in-effect and stays
 * in sync across tabs.
 */
interface ReducedMotionState {
  reduced: boolean;
  systemReduced: boolean;
  userReduced: boolean;
  setUserReduced: (value: boolean) => void;
  toggle: () => void;
}

const STORAGE_KEY = "asdre:reduce-motion";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getUserSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function writeUserPref(value: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {
    /* localStorage unavailable — ignore */
  }
  listeners.forEach((l) => l());
}

const ReducedMotionContext = createContext<ReducedMotionState | null>(null);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = Boolean(useReducedMotion());
  const userReduced = useSyncExternalStore(
    subscribe,
    getUserSnapshot,
    getServerSnapshot,
  );

  const setUserReduced = useCallback((value: boolean) => writeUserPref(value), []);
  const toggle = useCallback(() => writeUserPref(!getUserSnapshot()), []);

  const value = useMemo<ReducedMotionState>(
    () => ({
      reduced: systemReduced || userReduced,
      systemReduced,
      userReduced,
      setUserReduced,
      toggle,
    }),
    [systemReduced, userReduced, setUserReduced, toggle],
  );

  return (
    <ReducedMotionContext.Provider value={value}>{children}</ReducedMotionContext.Provider>
  );
}

const FALLBACK: ReducedMotionState = {
  reduced: false,
  systemReduced: false,
  userReduced: false,
  setUserReduced: () => {},
  toggle: () => {},
};

export function useReducedMotionPref(): ReducedMotionState {
  return useContext(ReducedMotionContext) ?? FALLBACK;
}
