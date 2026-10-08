import { interpolate, useCurrentFrame } from "remotion";
import { Card, Reveal } from "../primitives";
import { clamp, colors, ease, fonts } from "../theme";
import { cue } from "../timing";
import { Shell } from "./Shell";
import type { Word } from "../types";

export const Outro: React.FC<{
  recap: string;
  next: string;
  cta: string;
  done: string;
  words: Word[];
  duration: number;
}> = ({ recap, next, cta, done, words, duration }) => {
  const frame = useCurrentFrame();
  const nextAt = cue(words, "Подписы", Math.round(duration * 0.5));
  const cursorStart = nextAt + 10;
  const clickAt = nextAt + 32;
  const cursor = interpolate(frame, [cursorStart, clickAt], [0, 1], { ...clamp, easing: ease });
  const clicked = frame >= clickAt;
  const press = interpolate(frame, [clickAt, clickAt + 4, clickAt + 10], [1, 0.92, 1], clamp);

  return (
    <Shell duration={duration}>
      <Reveal
        text={recap}
        stagger={3}
        style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 66, lineHeight: 1.15, color: colors.text }}
      />
      <Card
        style={{
          opacity: interpolate(frame, [nextAt, nextAt + 10], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [nextAt, nextAt + 14], [40, 0], { ...clamp, easing: ease })}px`,
        }}
      >
        <div style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.accent, marginBottom: 12 }}>СЛЕДУЮЩЕЕ ВИДЕО</div>
        <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 52, lineHeight: 1.25, color: colors.text }}>{next}</div>
      </Card>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", opacity: interpolate(frame, [nextAt + 4, nextAt + 12], [0, 1], clamp) }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 56,
            padding: "30px 64px",
            borderRadius: 999,
            background: clicked ? colors.surface2 : colors.warn,
            color: clicked ? colors.muted : "white",
            scale: press,
            boxShadow: clicked ? "none" : `0 20px 60px ${colors.warn}66`,
          }}
        >
          {clicked ? done : cta}
        </div>
        <svg
          width={90}
          height={90}
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            left: "56%",
            top: 50,
            translate: `${interpolate(cursor, [0, 1], [260, 0])}px ${interpolate(cursor, [0, 1], [300, 0])}px`,
            opacity: cursor > 0 ? 1 : 0,
          }}
        >
          <path d="M4 2l16 9-7 2-3 7L4 2z" fill="white" stroke={colors.bg} strokeWidth="1.2" />
        </svg>
      </div>
    </Shell>
  );
};
