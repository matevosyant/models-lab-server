import { interpolate, useCurrentFrame } from "remotion";
import { Card, Reveal } from "../primitives";
import { clamp, colors, ease, fonts } from "../theme";
import { Shell } from "./Shell";
import type { Word } from "../types";

export const Tip: React.FC<{
  index: number;
  title: string;
  demo: string;
  highlight: string;
  checklist?: string[];
  words: Word[];
  duration: number;
}> = ({ index, title, demo, highlight, checklist, duration }) => {
  const frame = useCurrentFrame();
  const markAt = Math.round(duration * 0.35);
  const mark = interpolate(frame, [markAt, markAt + 18], [0, 100], { ...clamp, easing: ease });
  const [before, after] = demo.split(highlight);
  const checksAt = Math.round(duration * 0.5);

  return (
    <Shell duration={duration}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 210,
            lineHeight: 0.85,
            color: "transparent",
            WebkitTextStroke: `4px ${colors.accent}`,
            translate: `${interpolate(frame, [0, 18], [-60, 0], { ...clamp, easing: ease })}px 0px`,
            opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          }}
        >
          {String(index).padStart(2, "0")}
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: 34, color: colors.muted, paddingBottom: 10 }}>ПРАВИЛО</div>
      </div>
      <Reveal
        text={title}
        delay={6}
        stagger={3}
        style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 84, lineHeight: 1.1, color: colors.text }}
      />
      <Card style={{ opacity: interpolate(frame, [12, 22], [0, 1], clamp) }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 32, color: colors.muted, marginBottom: 18 }}>ПРОМПТ</div>
        <div style={{ fontFamily: fonts.mono, fontSize: 46, lineHeight: 1.45, color: colors.text, whiteSpace: "pre-line" }}>
          {before}
          <span
            style={{
              backgroundImage: `linear-gradient(${colors.accent}, ${colors.accent})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${mark}% 100%`,
              color: mark > 50 ? colors.bg : colors.text,
              borderRadius: 8,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              padding: "0 6px",
            }}
          >
            {highlight}
          </span>
          {after}
        </div>
      </Card>
      {checklist ? (
        <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
          {checklist.map((item, i) => {
            const p = interpolate(frame, [checksAt + i * 6, checksAt + i * 6 + 12], [0, 1], { ...clamp, easing: ease });
            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: fonts.body,
                  fontWeight: 800,
                  fontSize: 44,
                  color: colors.text,
                  background: colors.surface2,
                  borderRadius: 999,
                  padding: "14px 28px",
                  opacity: p,
                  scale: interpolate(p, [0, 1], [0.7, 1]),
                }}
              >
                <svg width={40} height={40} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill={colors.accent} />
                  <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke={colors.bg} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </div>
            );
          })}
        </div>
      ) : null}
    </Shell>
  );
};
