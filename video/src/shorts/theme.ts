import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const colors = {
  background: "#07070f",
  text: "#ffffff",
  muted: "#a1a1b5",
  accent: "#8b5cf6",
  accent2: "#22d3ee",
  bad: "#f43f5e",
  good: "#22c55e",
  card: "rgba(255, 255, 255, 0.07)",
  cardBorder: "rgba(255, 255, 255, 0.14)",
};

export const fonts = {
  heading: "Montserrat",
  mono: "JetBrains Mono",
};

// Fonts ship in public/fonts (Montserrat and JetBrains Mono, SIL OFL)
// so rendering works offline and supports Cyrillic.
export const fontsLoaded = Promise.all([
  loadFont({ family: fonts.heading, url: staticFile("fonts/Montserrat_600SemiBold.ttf"), weight: "600" }),
  loadFont({ family: fonts.heading, url: staticFile("fonts/Montserrat_800ExtraBold.ttf"), weight: "800" }),
  loadFont({ family: fonts.heading, url: staticFile("fonts/Montserrat_900Black.ttf"), weight: "900" }),
  loadFont({ family: fonts.mono, url: staticFile("fonts/JetBrainsMono_500Medium.ttf"), weight: "500" }),
]);

// Safe area for 1080x1920 Shorts: keep clear of the platform UI
// (title and buttons at the bottom, icons on the right).
export const safe = {
  top: 220,
  bottom: 380,
  side: 80,
};
