import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// Image paths are relative to public/, e.g. "images/photo.jpg".
export const slideshowSchema = z.object({
  images: z.array(z.string()).min(1),
  secondsPerImage: z.number().positive(),
  transitionSeconds: z.number().min(0),
});

type SlideshowProps = z.infer<typeof slideshowSchema>;

export const calculateSlideshowMetadata: CalculateMetadataFunction<
  SlideshowProps
> = ({ props }) => {
  const fps = 30;
  const step = props.secondsPerImage - props.transitionSeconds;
  return {
    fps,
    durationInFrames: Math.round(
      (step * (props.images.length - 1) + props.secondsPerImage) * fps,
    ),
  };
};

const Slide: React.FC<{ src: string; duration: number; fade: number }> = ({
  src,
  duration,
  fade,
}) => {
  const frame = useCurrentFrame();
  const opacity =
    fade > 0
      ? interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  // Slow "Ken Burns" zoom.
  const scale = interpolate(frame, [0, duration], [1, 1.1]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC<SlideshowProps> = ({
  images,
  secondsPerImage,
  transitionSeconds,
}) => {
  const { fps } = useVideoConfig();
  const duration = Math.round(secondsPerImage * fps);
  const fade = Math.round(transitionSeconds * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {images.map((src, i) => (
        <Sequence
          key={src + i}
          from={i * (duration - fade)}
          durationInFrames={duration}
        >
          <Slide src={src} duration={duration} fade={fade} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
