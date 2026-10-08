import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, colors, ease, fonts, safe } from "./theme";
import type { Word } from "./types";

// Dark backdrop with a drifting dot grid, a colored glow, vignette and grain.
export const Backdrop: React.FC<{ glow: string }> = ({ glow }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${colors.line} 2px, transparent 2px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: `0px ${-frame * 0.4}px`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: -160,
          top: 260,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow}2e 0%, transparent 62%)`,
          translate: `${Math.sin(frame / 70) * 80}px ${Math.cos(frame / 90) * 60}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07 }}>
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed={Math.floor(frame / 2) % 12}
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// Text where *starred* words get the accent color.
const parseAccents = (text: string) =>
  text.split(" ").map((raw) => ({
    word: raw.replace(/\*/g, ""),
    accent: raw.startsWith("*") || raw.endsWith("*"),
  }));

// Word-by-word masked slide-up reveal.
export const Reveal: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  accentColor?: string;
}> = ({ text, delay = 0, stagger = 3, style, accentColor = colors.accent }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: "0.28em", ...style }}>
      {parseAccents(text).map(({ word, accent }, i) => {
        const start = delay + i * stagger;
        return (
          <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: "0.08em" }}>
            <span
              style={{
                display: "inline-block",
                color: accent ? accentColor : undefined,
                translate: `0px ${interpolate(frame, [start, start + 16], [110, 0], {
                  ...clamp,
                  easing: ease,
                })}%`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// 0 -> 1 progress with the shared easing.
export const useEnter = (delay: number, duration = 16) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], { ...clamp, easing: ease });
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      background: colors.surface,
      border: `2px solid ${colors.line}`,
      borderRadius: 36,
      padding: "34px 40px",
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Rubber-stamp label that slams in.
export const Stamp: React.FC<{ text: string; color: string; delay: number; rotate?: number }> = ({
  text,
  color,
  delay,
  rotate = -7,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: 78,
        color,
        border: `8px solid ${color}`,
        borderRadius: 22,
        padding: "8px 30px",
        rotate: `${rotate}deg`,
        background: colors.bg,
        opacity: interpolate(frame, [delay, delay + 3], [0, 1], clamp),
        scale: interpolate(frame, [delay, delay + 0.3 * fps], [2.2, 1], {
          ...clamp,
          easing: ease,
        }),
        boxShadow: `0 0 60px ${color}55`,
      }}
    >
      {text}
    </div>
  );
};

// Segmented progress bar plus the current chapter name.
export const Chrome: React.FC<{
  segments: number[];
  index: number;
  chapter: string;
  sceneFrame: number;
}> = ({ segments, index, chapter, sceneFrame }) => {
  const total = segments.reduce((a, b) => a + b, 0);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 150,
          left: safe.side,
          right: safe.side,
          display: "flex",
          gap: 8,
        }}
      >
        {segments.map((length, i) => (
          <div
            key={i}
            style={{
              flexGrow: length / total,
              height: 8,
              borderRadius: 4,
              background: "rgba(255,255,255,0.14)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: colors.accent,
                width: `${i < index ? 100 : i > index ? 0 : Math.min(100, (sceneFrame / length) * 100)}%`,
              }}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 186,
          left: safe.side,
          fontFamily: fonts.mono,
          fontSize: 30,
          letterSpacing: 3,
          color: colors.muted,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: colors.accent }}>{String(index + 1).padStart(2, "0")}</span>
        {"  /  "}
        {chapter}
      </div>
    </>
  );
};

// Groups words into short caption lines.
const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let current: Word[] = [];
  for (const w of words) {
    const length = current.reduce((n, x) => n + x.text.length + 1, 0);
    if (current.length > 0 && (current.length >= 4 || length + w.text.length > 24)) {
      chunks.push(current);
      current = [];
    }
    current.push(w);
    if (/[.!?…:]$/.test(w.text)) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
};

// Karaoke-style captions synced to the narration.
export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const chunks = chunkWords(words);
  const chunk = chunks.find(
    (c, i) => frame >= c[0].start && (i === chunks.length - 1 || frame < chunks[i + 1][0].start),
  );
  if (!chunk) return null;
  const appear = interpolate(frame, [chunk[0].start, chunk[0].start + 6], [0, 1], {
    ...clamp,
    easing: ease,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: safe.side,
        right: safe.side,
        bottom: safe.bottom - 40,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.2,
          textAlign: "center",
          color: colors.text,
          textShadow: "0 4px 24px rgba(0,0,0,0.9)",
          opacity: appear,
          scale: interpolate(appear, [0, 1], [0.92, 1]),
        }}
      >
        {chunk.map((w, i) => (
          <span key={i} style={{ color: frame >= w.start ? (frame < w.end + 2 ? colors.accent : colors.text) : "rgba(244,244,239,0.55)" }}>
            {w.text}
            {i < chunk.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

// Blinking text cursor.
export const Caret: React.FC<{ color?: string }> = ({ color = colors.accent }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.5em",
        height: "1.05em",
        marginLeft: 6,
        verticalAlign: "text-bottom",
        background: color,
        opacity: Math.floor(frame / 14) % 2 === 0 ? 1 : 0,
      }}
    />
  );
};
