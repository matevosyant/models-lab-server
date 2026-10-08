import { interpolate, useCurrentFrame } from "remotion";
import { Caret, Reveal, Stamp } from "../primitives";
import { clamp, colors, fonts } from "../theme";
import { cue } from "../timing";
import { Shell } from "./Shell";
import type { Word } from "../types";

const typed = (text: string, frame: number, from: number, to: number) =>
  text.slice(0, Math.round(text.length * interpolate(frame, [from, to], [0, 1], clamp)));

export const ChatScene: React.FC<{
  label: string;
  question: string;
  answer: string;
  stamp: string;
  words: Word[];
  duration: number;
}> = ({ label, question, answer, stamp, words, duration }) => {
  const frame = useCurrentFrame();
  const qEnd = Math.round(duration * 0.18);
  const aStart = qEnd + 10;
  const aEnd = Math.round(duration * 0.55);
  const stampAt = cue(words, "выдум", Math.round(duration * 0.65));
  const labelAt = cue(words, "галлюц", Math.round(duration * 0.82));

  return (
    <Shell duration={duration}>
      <div style={{ height: 100, opacity: interpolate(frame, [labelAt, labelAt + 4], [0, 1], clamp) }}>
        {frame >= labelAt ? (
          <Reveal
            text={label}
            stagger={2}
            style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 80, color: colors.warn }}
          />
        ) : null}
      </div>
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: 820,
          background: colors.violet,
          color: "white",
          borderRadius: "40px 40px 10px 40px",
          padding: "28px 36px",
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.3,
        }}
      >
        {typed(question, frame, 2, qEnd)}
        {frame < qEnd ? <Caret color="white" /> : null}
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            maxWidth: 880,
            background: colors.surface,
            border: `2px solid ${frame >= stampAt ? colors.warn : colors.line}`,
            borderRadius: "40px 40px 40px 10px",
            padding: "30px 36px",
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 44,
            lineHeight: 1.4,
            color: colors.text,
            minHeight: 120,
            opacity: frame >= qEnd ? 1 : 0,
          }}
        >
          {frame < aStart ? (
            <span style={{ color: colors.muted }}>{".".repeat(1 + (Math.floor(frame / 5) % 3))}</span>
          ) : (
            typed(answer, frame, aStart, aEnd)
          )}
        </div>
        <div style={{ position: "absolute", right: 0, bottom: -130 }}>
          {frame >= stampAt ? <Stamp text={stamp} color={colors.warn} delay={stampAt} /> : null}
        </div>
      </div>
    </Shell>
  );
};
