import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const helloWorldSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  color: zColor(),
});

export const HelloWorld: React.FC<z.infer<typeof helloWorldSchema>> = ({
  title,
  subtitle,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 200 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        color: "white",
        opacity: fadeOut,
      }}
    >
      <h1 style={{ fontSize: 160, margin: 0, transform: `scale(${scale})` }}>
        {title}
      </h1>
      <p style={{ fontSize: 60, margin: 0, opacity: subtitleOpacity }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
