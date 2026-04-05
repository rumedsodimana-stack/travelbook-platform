import { useState, useEffect } from "react";

export interface ThemeState {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  shadowIntensity: string;
  sidebarWidth: string;
  propertyName: string;
  tagline: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  darkMode: boolean;
}

const STORAGE_KEY = "singularity-theme";

const defaults: ThemeState = {
  primaryColor: "#7c3aed",
  accentColor: "#06b6d4",
  bgColor: "#f8fafc",
  surfaceColor: "#ffffff",
  textColor: "#0f172a",
  fontFamily: "Inter",
  fontSize: "md",
  borderRadius: "md",
  shadowIntensity: "md",
  sidebarWidth: "normal",
  propertyName: "Hotel Singularity",
  tagline: "Elevated Hospitality Intelligence",
  currency: "USD",
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  darkMode: false,
};

function load(): ThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {}
  return defaults;
}

function save(state: ThemeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// Singleton state for cross-component sharing
let _state: ThemeState = load();
const _listeners = new Set<() => void>();

function getState() {
  return _state;
}

function setState(partial: Partial<ThemeState>) {
  _state = { ..._state, ...partial };
  save(_state);
  _listeners.forEach(fn => fn());
}

function subscribe(fn: () => void) {
  _listeners.add(fn);
  return () => { _listeners.delete(fn); };
}

export function useThemeStore() {
  const [state, setLocalState] = useState<ThemeState>(getState);

  useEffect(() => {
    return subscribe(() => setLocalState({ ...getState() }));
  }, []);

  return {
    ...state,
    set: (partial: Partial<ThemeState>) => setState(partial),
    reset: () => setState(defaults),
  };
}

export { getState as getThemeState };
