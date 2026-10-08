import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fonts, safe } from "./theme";

// Slowly drifting glow blobs so the background is never static.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.background, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent}66 0%, transparent 65%)`,
          left: -250,
          top: -150,
          translate: `${Math.sin(frame / 50) * 60}px ${Math.cos(frame / 60) * 80}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accent2}44 0%, transparent 65%)`,
          right: -350,
          bottom: -200,
          translate: `${Math.cos(frame / 45) * 70}px ${Math.sin(frame / 55) * 60}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SeriesBadge: React.FC<{ series: string; episode: number }> = ({
  series,
  episode,
}) => (
  <div
    style={{
      position: "absolute",
      top: safe.top - 90,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: 34,
        letterSpacing: 2,
        color: colors.text,
        padding: "14px 30px",
        borderRadius: 999,
        background: colors.card,
        border: `2px solid ${colors.cardBorder}`,
        textTransform: "uppercase",
      }}
    >
      {series} <span style={{ color: colors.accent2 }}>#{episode}</span>
    </div>
  </div>
);

// Thin bar at the very top that fills over the whole video.
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: "100%",
        background: "rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${interpolate(frame, [0, durationInFrames - 1], [0, 100])}%`,
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent2})`,
        }}
      />
    </div>
  );
};

// Pops in with a spring, starting at `delay` frames.
export const PopIn: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        opacity: interpolate(frame, [delay, delay + 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        scale: interpolate(frame, [delay, delay + 0.5 * fps], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12 }),
        }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const CheckIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill={colors.good} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CrossIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill={colors.bad} />
    <path d="M8 8l8 8M16 8l-8 8" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const BookmarkIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 3h12v18l-6-4.5L6 21V3z" fill={colors.accent2} />
  </svg>
);

export const SparkIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4L12 2z"
      fill={colors.accent}
    />
  </svg>
);
