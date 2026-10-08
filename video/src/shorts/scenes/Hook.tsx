import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PopIn } from "../components";
import { colors, fonts, safe } from "../theme";

export const Hook: React.FC<{ top: string; accent: string; sub: string }> = ({
  top,
  accent,
  sub,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Short shake right after the accent word lands.
  const shake =
    frame > 0.35 * fps && frame < 0.8 * fps ? Math.sin(frame * 2.2) * 14 : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`,
        textAlign: "center",
        fontFamily: fonts.heading,
        color: colors.text,
      }}
    >
      <div
        style={{
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1.1,
          opacity: interpolate(frame, [0, 5], [0, 1], { extrapolateRight: "clamp" }),
          translate: `0px ${interpolate(frame, [0, 0.4 * fps], [40, 0], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          })}px`,
        }}
      >
        {top}
      </div>
      <PopIn delay={Math.round(0.25 * fps)}>
        <div
          style={{
            marginTop: 30,
            fontSize: 100,
            fontWeight: 900,
            color: "white",
            background: colors.bad,
            padding: "10px 36px",
            borderRadius: 24,
            rotate: "-3deg",
            translate: `${shake}px 0px`,
            boxShadow: `0 20px 80px ${colors.bad}88`,
          }}
        >
          {accent}
        </div>
      </PopIn>
      <PopIn delay={Math.round(1.1 * fps)}>
        <div style={{ marginTop: 70, fontSize: 56, fontWeight: 600, color: colors.muted }}>
          {sub}
        </div>
      </PopIn>
    </AbsoluteFill>
  );
};
