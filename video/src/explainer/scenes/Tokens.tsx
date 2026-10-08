import { interpolate, random, useCurrentFrame } from "remotion";
import { Card, Reveal } from "../primitives";
import { clamp, colors, ease, fonts } from "../theme";
import { cue } from "../timing";
import { Shell } from "./Shell";
import type { Word } from "../types";

const chipColors = [colors.accent, colors.violet, "#3df5ff"];

export const Tokens: React.FC<{
  sentence: string;
  tokens: string[];
  note: string;
  words: Word[];
  duration: number;
}> = ({ sentence, tokens, note, words, duration }) => {
  const frame = useCurrentFrame();
  const splitAt = cue(words, "реж", Math.round(duration * 0.25));
  const numbersAt = cue(words, "чисел", Math.round(duration * 0.55));
  const split = interpolate(frame, [splitAt, splitAt + 18], [0, 1], { ...clamp, easing: ease });

  return (
    <Shell duration={duration}>
      <Reveal
        text="Что видит *нейросеть*"
        stagger={3}
        style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 80, color: colors.text }}
      />
      <Card style={{ padding: "44px 36px" }}>
        {split < 0.01 ? (
          <div style={{ fontFamily: fonts.mono, fontSize: 64, color: colors.text, textAlign: "center" }}>
            {sentence}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              rowGap: 40,
              columnGap: 18 + split * 10,
            }}
          >
            {tokens.map((token, i) => {
              const color = chipColors[i % chipColors.length];
              const numbersIn = interpolate(frame, [numbersAt + i * 3, numbersAt + i * 3 + 12], [0, 1], {
                ...clamp,
                easing: ease,
              });
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 58,
                      color: colors.bg,
                      background: color,
                      borderRadius: 18,
                      padding: "10px 22px",
                      whiteSpace: "pre",
                      scale: interpolate(split, [0, 1], [0.8, 1]),
                      translate: `0px ${interpolate(split, [0, 1], [20, 0]) * (i % 2 ? 1 : -1)}px`,
                    }}
                  >
                    {token.trim()}
                  </div>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 30,
                      lineHeight: 1.35,
                      color: colors.muted,
                      textAlign: "center",
                      opacity: numbersIn,
                      translate: `0px ${(1 - numbersIn) * -20}px`,
                    }}
                  >
                    {[0, 1, 2].map((k) => (
                      <div key={k}>{(random(`${i}-${k}`) * 4 - 2).toFixed(2)}</div>
                    ))}
                    <div>…</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.muted,
          textAlign: "center",
          opacity: interpolate(frame, [numbersAt, numbersAt + 10], [0, 1], clamp),
        }}
      >
        {note}
      </div>
    </Shell>
  );
};
