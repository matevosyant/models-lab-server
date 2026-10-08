import { interpolate, useCurrentFrame } from "remotion";
import { Reveal, useEnter } from "../primitives";
import { clamp, colors, ease, fonts } from "../theme";
import { Shell } from "./Shell";
import type { Word } from "../types";

export const PromiseScene: React.FC<{
  title: string;
  seconds: number;
  words: Word[];
  duration: number;
}> = ({ title, seconds, duration }) => {
  const frame = useCurrentFrame();
  const ring = useEnter(4, 40);
  const r = 190;
  const circumference = 2 * Math.PI * r;
  const count = Math.round(interpolate(frame, [4, 44], [0, seconds], { ...clamp, easing: ease }));

  return (
    <Shell duration={duration}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 440, height: 440 }}>
          <svg width={440} height={440} style={{ rotate: "-90deg" }}>
            <circle cx={220} cy={220} r={r} stroke={colors.line} strokeWidth={22} fill="none" />
            <circle
              cx={220}
              cy={220}
              r={r}
              stroke={colors.accent}
              strokeWidth={22}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - ring)}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: fonts.display,
              color: colors.text,
            }}
          >
            <div style={{ fontSize: 150, fontWeight: 900, lineHeight: 1 }}>{count}</div>
            <div style={{ fontFamily: fonts.mono, fontSize: 36, color: colors.muted, marginTop: 10 }}>СЕКУНД</div>
          </div>
        </div>
      </div>
      <Reveal
        text={title}
        delay={14}
        stagger={3}
        style={{
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.15,
          color: colors.text,
          justifyContent: "center",
          textAlign: "center",
        }}
      />
    </Shell>
  );
};
