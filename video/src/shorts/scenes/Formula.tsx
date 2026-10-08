import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { PopIn } from "../components";
import { colors, fonts, safe } from "../theme";

export type FormulaItem = { label: string; example: string };

export const Formula: React.FC<{
  title: string;
  items: FormulaItem[];
  // Seconds between cards.
  itemEvery: number;
}> = ({ title, items, itemEvery }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const firstItemAt = Math.round(0.6 * fps);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: `${safe.top + 20}px ${safe.side}px ${safe.bottom}px`,
        fontFamily: fonts.heading,
        color: colors.text,
        gap: 30,
      }}
    >
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: 20,
          opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {title}
      </div>
      {items.map((item, i) => {
        const at = firstItemAt + Math.round(i * itemEvery * fps);
        // The newest card is highlighted, older ones dim slightly.
        const isActive =
          frame >= at && (i === items.length - 1 || frame < at + itemEvery * fps);
        return (
          <PopIn key={item.label} delay={at}>
            <div
              style={{
                display: "flex",
                gap: 28,
                alignItems: "center",
                padding: "26px 32px",
                borderRadius: 32,
                background: colors.card,
                border: `3px solid ${isActive ? colors.accent2 : colors.cardBorder}`,
                opacity: isActive ? 1 : 0.75,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 54,
                  fontWeight: 900,
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 54, fontWeight: 900, textTransform: "uppercase" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 40, fontWeight: 600, color: colors.muted, marginTop: 4 }}>
                  {item.example}
                </div>
              </div>
            </div>
          </PopIn>
        );
      })}
    </AbsoluteFill>
  );
};
