import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const colors = {
  bg: "#0a0a0f",
  surface: "#15151d",
  surface2: "#1d1d28",
  line: "rgba(255, 255, 255, 0.09)",
  text: "#f4f4ef",
  muted: "#8b8b9c",
  accent: "#c6ff3d",
  violet: "#7c5cff",
  warn: "#ff4d5e",
};

export const fonts = {
  display: "Unbounded",
  body: "Inter",
  mono: "JetBrains Mono",
};

// Fonts ship in public/fonts (SIL OFL) so renders work offline and support Cyrillic.
const font = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });

export const fontsLoaded = Promise.all([
  font(fonts.display, "Unbounded_700Bold.ttf", "700"),
  font(fonts.display, "Unbounded_900Black.ttf", "900"),
  font(fonts.body, "Inter_500Medium.ttf", "500"),
  font(fonts.body, "Inter_700Bold.ttf", "700"),
  font(fonts.body, "Inter_800ExtraBold.ttf", "800"),
  font(fonts.mono, "JetBrainsMono_500Medium.ttf", "500"),
]);

// One easing curve for the whole video keeps motion consistent.
export const ease = Easing.bezier(0.16, 1, 0.3, 1);

// Keep key content clear of Shorts / TikTok / Reels UI.
export const safe = {
  top: 260,
  bottom: 520,
  side: 80,
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
