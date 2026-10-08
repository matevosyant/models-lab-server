import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp, ease, safe } from "../theme";

// Common scene frame: slow camera push in, quick lift-out at the end.
export const Shell: React.FC<{
  duration: number;
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
}> = ({ duration, children, justify = "center" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        padding: `${safe.top + 40}px ${safe.side}px ${safe.bottom + 60}px`,
        justifyContent: justify,
        gap: 44,
        scale: interpolate(frame, [0, duration], [1, 1.04]),
        opacity: interpolate(frame, [duration - 8, duration], [1, 0], clamp),
        translate: `0px ${interpolate(frame, [duration - 8, duration], [0, -40], {
          ...clamp,
          easing: ease,
        })}px`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
