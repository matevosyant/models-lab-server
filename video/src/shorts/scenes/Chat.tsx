import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckIcon, CrossIcon, PopIn, SparkIcon } from "../components";
import { colors, fonts, safe } from "../theme";

type ChatProps = {
  label: string;
  prompt: string;
  answer: string;
  verdict: string;
  good: boolean;
  // Seconds, relative to the scene start.
  typingSeconds: number;
  answerSeconds: number;
  verdictAt: number;
};

const visibleText = (text: string, progress: number) =>
  text.slice(0, Math.round(text.length * progress));

export const Chat: React.FC<ChatProps> = ({
  label,
  prompt,
  answer,
  verdict,
  good,
  typingSeconds,
  answerSeconds,
  verdictAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const typingStart = Math.round(0.3 * fps);
  const typingEnd = typingStart + Math.round(typingSeconds * fps);
  const thinkingEnd = typingEnd + Math.round(0.4 * fps);
  const answerEnd = thinkingEnd + Math.round(answerSeconds * fps);

  const typed = visibleText(
    prompt,
    interpolate(frame, [typingStart, typingEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const answered = visibleText(
    answer,
    interpolate(frame, [thinkingEnd, answerEnd], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const cursorVisible = frame < typingEnd && Math.floor(frame / 8) % 2 === 0;
  const verdictColor = good ? colors.good : colors.bad;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: `${safe.top + 20}px ${safe.side}px ${safe.bottom}px`,
        fontFamily: fonts.heading,
        color: colors.text,
        gap: 36,
      }}
    >
      <div
        style={{
          alignSelf: "center",
          fontSize: 64,
          fontWeight: 900,
          color: verdictColor,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      {/* User prompt */}
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: 860,
          background: `linear-gradient(135deg, ${colors.accent}, #6d28d9)`,
          borderRadius: "40px 40px 8px 40px",
          padding: "30px 38px",
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 44,
          lineHeight: 1.35,
          minHeight: 60,
          opacity: interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        {typed}
        <span style={{ opacity: cursorVisible ? 1 : 0 }}>|</span>
      </div>

      {/* AI answer */}
      {frame >= typingEnd ? (
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", maxWidth: 920 }}>
          <div style={{ flexShrink: 0, marginTop: 14 }}>
            <SparkIcon size={64} />
          </div>
          <div
            style={{
              background: colors.card,
              border: `2px solid ${colors.cardBorder}`,
              borderRadius: "40px 40px 40px 8px",
              padding: "30px 38px",
              fontSize: 44,
              fontWeight: 600,
              lineHeight: 1.4,
              whiteSpace: "pre-line",
            }}
          >
            {frame < thinkingEnd ? (
              <span style={{ color: colors.muted, letterSpacing: 6 }}>
                {".".repeat(1 + (Math.floor(frame / 5) % 3))}
              </span>
            ) : (
              answered
            )}
          </div>
        </div>
      ) : null}

      <PopIn
        delay={Math.round(verdictAt * fps)}
        style={{ alignSelf: "center", marginTop: 10 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 36px",
            borderRadius: 24,
            border: `5px solid ${verdictColor}`,
            color: verdictColor,
            fontSize: 56,
            fontWeight: 900,
            textTransform: "uppercase",
            rotate: good ? "0deg" : "-4deg",
            background: colors.background,
          }}
        >
          {good ? <CheckIcon size={64} /> : <CrossIcon size={64} />}
          {verdict}
        </div>
      </PopIn>
    </AbsoluteFill>
  );
};
