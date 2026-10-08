import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BookmarkIcon, PopIn } from "../components";
import { colors, fonts, safe } from "../theme";

export const Outro: React.FC<{ save: string; next: string; subscribe: string }> = ({
  save,
  next,
  subscribe,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 1 + Math.sin(frame / 4) * 0.04;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: `${safe.top}px ${safe.side}px ${safe.bottom}px`,
        textAlign: "center",
        fontFamily: fonts.heading,
        color: colors.text,
        gap: 60,
      }}
    >
      <PopIn delay={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 84, fontWeight: 900, lineHeight: 1.1 }}>
          <BookmarkIcon size={110} />
          <span style={{ textAlign: "left" }}>{save}</span>
        </div>
      </PopIn>
      <PopIn delay={Math.round(0.6 * fps)}>
        <div style={{ fontSize: 52, fontWeight: 600, color: colors.muted, lineHeight: 1.3 }}>
          {next}
        </div>
      </PopIn>
      <PopIn delay={Math.round(1.2 * fps)}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            padding: "28px 56px",
            borderRadius: 999,
            background: colors.bad,
            textTransform: "uppercase",
            scale: frame > 1.6 * fps ? pulse : 1,
            boxShadow: `0 20px 70px ${colors.bad}77`,
          }}
        >
          {subscribe}
        </div>
      </PopIn>
    </AbsoluteFill>
  );
};
