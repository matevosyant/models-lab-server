import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { z } from "zod";
import { Background, ProgressBar, SeriesBadge } from "./components";
import { Chat } from "./scenes/Chat";
import { Formula } from "./scenes/Formula";
import { Hook } from "./scenes/Hook";
import { Outro } from "./scenes/Outro";
import "./theme";

// One episode of the "AI in 30 seconds" Shorts series.
// New episodes only need new props, see src/shorts/episodes/.
export const aiShortSchema = z.object({
  series: z.string(),
  episode: z.number().int().positive(),
  hook: z.object({ top: z.string(), accent: z.string(), sub: z.string() }),
  bad: z.object({
    label: z.string(),
    prompt: z.string(),
    answer: z.string(),
    verdict: z.string(),
  }),
  formula: z.object({
    title: z.string(),
    items: z.array(z.object({ label: z.string(), example: z.string() })).length(4),
  }),
  good: z.object({
    label: z.string(),
    prompt: z.string(),
    answer: z.string(),
    verdict: z.string(),
  }),
  outro: z.object({ save: z.string(), next: z.string(), subscribe: z.string() }),
});

export type AiShortProps = z.infer<typeof aiShortSchema>;

const TRANSITION = 12;
// Scene lengths in frames at 30 fps.
const HOOK = 75;
const BAD = 150;
const FORMULA = 240;
const GOOD = 300;
const OUTRO = 120;

export const AI_SHORT_DURATION =
  HOOK + BAD + FORMULA + GOOD + OUTRO - 4 * TRANSITION;

export const AiShort: React.FC<AiShortProps> = ({
  series,
  episode,
  hook,
  bad,
  formula,
  good,
  outro,
}) => {
  const { fps } = useVideoConfig();
  const timing = linearTiming({ durationInFrames: TRANSITION });

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Hook" durationInFrames={HOOK} premountFor={fps}>
          <Hook {...hook} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
        <TransitionSeries.Sequence name="Bad prompt" durationInFrames={BAD} premountFor={fps}>
          <Chat {...bad} good={false} typingSeconds={0.9} answerSeconds={1.2} verdictAt={3} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence name="Formula" durationInFrames={FORMULA} premountFor={fps}>
          <Formula {...formula} itemEvery={1.6} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence name="Good prompt" durationInFrames={GOOD} premountFor={fps}>
          <Chat {...good} good typingSeconds={2.6} answerSeconds={2.6} verdictAt={6.9} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence name="Outro" durationInFrames={OUTRO} premountFor={fps}>
          <Outro {...outro} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <SeriesBadge series={series} episode={episode} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
