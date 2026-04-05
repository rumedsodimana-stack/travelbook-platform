import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

const fontSizeMap: Record<string, string> = {
  sm: "13px",
  md: "14px",
  lg: "16px",
  xl: "18px",
};

const borderRadiusMap: Record<string, string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

const shadowMap: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
};

const fontFamilyMap: Record<string, string> = {
  Inter: "'Inter', system-ui, sans-serif",
  Poppins: "'Poppins', system-ui, sans-serif",
  "DM Sans": "'DM Sans', system-ui, sans-serif",
  Manrope: "'Manrope', system-ui, sans-serif",
};

export function ThemeApplier() {
  const theme = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply dark mode class
    if (theme.darkMode) {
      root.classList.add("dark");
      localStorage.setItem("travelbook-hotel-os-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("travelbook-hotel-os-theme", "light");
    }

    // Apply primary color to the actual CSS variable the UI uses
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--ring", theme.primaryColor);

    // Apply background & surface
    root.style.setProperty("--background", theme.bgColor);
    root.style.setProperty("--card", theme.surfaceColor);
    root.style.setProperty("--popover", theme.surfaceColor);

    // Apply text color
    root.style.setProperty("--foreground", theme.textColor);
    root.style.setProperty("--card-foreground", theme.textColor);

    // Typography & layout
    root.style.setProperty("--theme-font-family", fontFamilyMap[theme.fontFamily] ?? fontFamilyMap.Inter);
    root.style.setProperty("--theme-font-size", fontSizeMap[theme.fontSize] ?? "14px");
    root.style.setProperty("--theme-border-radius", borderRadiusMap[theme.borderRadius] ?? "8px");
    root.style.setProperty("--theme-shadow", shadowMap[theme.shadowIntensity] ?? shadowMap.md);

    // Apply font size to body
    document.body.style.fontSize = fontSizeMap[theme.fontSize] ?? "14px";
    document.body.style.fontFamily = fontFamilyMap[theme.fontFamily] ?? fontFamilyMap.Inter;
  }, [
    theme.primaryColor,
    theme.accentColor,
    theme.bgColor,
    theme.surfaceColor,
    theme.textColor,
    theme.fontFamily,
    theme.fontSize,
    theme.borderRadius,
    theme.shadowIntensity,
    theme.darkMode,
  ]);

  return null;
}
