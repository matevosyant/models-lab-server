import { interpolate, random, useCurrentFrame } from "remotion";
import { Reveal } from "../primitives";
import { clamp, colors, fonts } from "../theme";
import { Shell } from "./Shell";
import { cue } from "../timing";
import type { Word } from "../types";

export const Hook: React.FC<{
  lines: string[];
  sub: string;
  words: Word[];
  duration: number;
}> = ({ lines, sub, words, duration }) => {
  const frame = useCurrentFrame();
  const subAt = cue(words, "И", Math.round(duration * 0.45));
  // RGB-split glitch bursts on the last line.
  const glitching = (frame > 22 && frame < 30) || (frame > subAt - 6 && frame < subAt);
  const gx = glitching ? (random(`gx${frame}`) - 0.5) * 22 : 0;

  return (
    <Shell duration={duration}>
      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 118, lineHeight: 1.08, color: colors.text }}>
        {lines.map((line, i) => (
          <div
            key={i}
            style={
              i === lines.length - 1
                ? {
                    textShadow: glitching
                      ? `${gx}px 0 ${colors.warn}, ${-gx}px 0 #3df5ff`
                      : "none",
                    translate: `${gx * 0.4}px 0px`,
                  }
                : undefined
            }
          >
            <Reveal text={line} delay={i * 5} stagger={2} />
          </div>
        ))}
      </div>
      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.25,
          color: colors.muted,
          opacity: interpolate(frame, [subAt, subAt + 8], [0, 1], clamp),
          borderLeft: `8px solid ${colors.accent}`,
          paddingLeft: 32,
        }}
      >
        {sub}
      </div>
    </Shell>
  );
};
