import { interpolate, useCurrentFrame } from "remotion";
import { Card, Caret, Reveal } from "../primitives";
import { clamp, colors, ease, fonts } from "../theme";
import { cue } from "../timing";
import { Shell } from "./Shell";
import type { Word } from "../types";

export const Predict: React.FC<{
  prompt: string;
  options: { text: string; p: number }[];
  loop: string;
  note: string;
  words: Word[];
  duration: number;
}> = ({ prompt, options, loop, note, words, duration }) => {
  const frame = useCurrentFrame();
  const barsAt = cue(words, "угадывает", Math.round(duration * 0.3));
  const pickAt = cue(words, "Париж", Math.round(duration * 0.6));
  const loopAt = cue(words, "снова", Math.round(duration * 0.8));
  const winner = options[0];
  const picked = interpolate(frame, [pickAt, pickAt + 10], [0, 1], { ...clamp, easing: ease });

  return (
    <Shell duration={duration}>
      <Reveal
        text="Угадай *следующее* слово"
        stagger={3}
        style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 76, lineHeight: 1.1, color: colors.text }}
      />
      <Card>
        <div style={{ fontFamily: fonts.mono, fontSize: 56, color: colors.text }}>
          {prompt}{" "}
          {picked > 0 ? (
            <span
              style={{
                color: colors.bg,
                background: colors.accent,
                borderRadius: 12,
                padding: "0 14px",
                display: "inline-block",
                scale: interpolate(picked, [0, 1], [1.6, 1]),
              }}
            >
              {winner.text}
            </span>
          ) : null}
          <Caret />
        </div>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {options.map((o, i) => {
          const grow = interpolate(frame, [barsAt + i * 4, barsAt + i * 4 + 22], [0, 1], {
            ...clamp,
            easing: ease,
          });
          const isWinner = i === 0;
          const dim = picked > 0 && !isWinner ? 0.35 : 1;
          return (
            <div key={o.text} style={{ display: "flex", alignItems: "center", gap: 24, opacity: grow > 0 ? dim : 0 }}>
              <div style={{ width: 230, fontFamily: fonts.body, fontWeight: 700, fontSize: 48, color: colors.text, textAlign: "right" }}>
                {o.text}
              </div>
              <div style={{ flex: 1, height: 56, borderRadius: 14, background: colors.surface2, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${Math.max(2, o.p * grow)}%`,
                    borderRadius: 14,
                    background: isWinner ? colors.accent : colors.violet,
                  }}
                />
              </div>
              <div style={{ width: 130, fontFamily: fonts.mono, fontSize: 44, color: isWinner ? colors.accent : colors.muted }}>
                {Math.round(o.p * grow)}%
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 28, color: colors.muted, opacity: interpolate(frame, [barsAt, barsAt + 10], [0, 1], clamp) }}>
          {note}
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 40,
            color: colors.bg,
            background: colors.text,
            borderRadius: 999,
            padding: "14px 30px",
            opacity: interpolate(frame, [loopAt, loopAt + 6], [0, 1], clamp),
            rotate: `${interpolate(frame, [loopAt, loopAt + 12], [-12, 0], { ...clamp, easing: ease })}deg`,
          }}
        >
          {loop}
        </div>
      </div>
    </Shell>
  );
};
