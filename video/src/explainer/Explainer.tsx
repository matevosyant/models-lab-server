import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Series,
  getStaticFiles,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop, Captions, Chrome } from "./primitives";
import { ChatScene } from "./scenes/Chat";
import { Hook } from "./scenes/Hook";
import { Outro } from "./scenes/Outro";
import { Predict } from "./scenes/Predict";
import { PromiseScene } from "./scenes/Promise";
import { Tip } from "./scenes/Tip";
import { Tokens } from "./scenes/Tokens";
import { colors, FPS } from "./theme";
import "./theme";
import {
  alignmentToWords,
  estimateSeconds,
  estimateWords,
  sceneFrames,
} from "./timing";
import type { Alignment, Episode, SceneSpec, TimedScene } from "./types";

export type ExplainerProps = {
  episode: Episode;
  // Filled in by calculateMetadata.
  timed?: TimedScene[];
};

type VoiceoverFile = { alignment: Alignment; duration: number };

// Uses public/voiceover/<episode>/<scene>.{mp3,json} when present
// (made by scripts/voiceover.mjs), otherwise estimated timing.
const timeScene = async (episodeId: string, scene: SceneSpec): Promise<TimedScene> => {
  const base = `voiceover/${episodeId}/${scene.id}`;
  const hasVoice = getStaticFiles().some((f) => f.name === `${base}.json`);
  if (hasVoice) {
    const vo: VoiceoverFile = await fetch(staticFile(`${base}.json`)).then((r) => r.json());
    return {
      ...scene,
      durationInFrames: sceneFrames(vo.duration, FPS),
      words: alignmentToWords(vo.alignment, FPS),
      audio: staticFile(`${base}.mp3`),
    };
  }
  return {
    ...scene,
    durationInFrames: sceneFrames(estimateSeconds(scene.vo), FPS),
    words: estimateWords(scene.vo, FPS),
    audio: null,
  };
};

export const calculateExplainerMetadata: CalculateMetadataFunction<ExplainerProps> = async ({
  props,
}) => {
  const timed = await Promise.all(props.episode.scenes.map((s) => timeScene(props.episode.id, s)));
  return {
    durationInFrames: timed.reduce((sum, s) => sum + s.durationInFrames, 0),
    props: { ...props, timed },
  };
};

const glowFor = (scene: SceneSpec) =>
  scene.type === "chat" ? colors.warn : scene.type === "tip" || scene.type === "outro" ? colors.accent : colors.violet;

const SceneBody: React.FC<{ scene: TimedScene }> = ({ scene }) => {
  const common = { words: scene.words, duration: scene.durationInFrames };
  switch (scene.type) {
    case "hook":
      return <Hook {...common} lines={scene.lines} sub={scene.sub} />;
    case "promise":
      return <PromiseScene {...common} title={scene.title} seconds={scene.seconds} />;
    case "tokens":
      return <Tokens {...common} sentence={scene.sentence} tokens={scene.tokens} note={scene.note} />;
    case "predict":
      return <Predict {...common} prompt={scene.prompt} options={scene.options} loop={scene.loop} note={scene.note} />;
    case "chat":
      return <ChatScene {...common} label={scene.label} question={scene.question} answer={scene.answer} stamp={scene.stamp} />;
    case "tip":
      return (
        <Tip
          {...common}
          index={scene.index}
          title={scene.title}
          demo={scene.demo}
          highlight={scene.highlight}
          checklist={scene.checklist}
        />
      );
    case "outro":
      return <Outro {...common} recap={scene.recap} next={scene.next} cta={scene.cta} done={scene.done} />;
  }
};

const SceneLayer: React.FC<{ scene: TimedScene; index: number; segments: number[] }> = ({
  scene,
  index,
  segments,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop glow={glowFor(scene)} />
      <SceneBody scene={scene} />
      <Chrome segments={segments} index={index} chapter={scene.chapter} sceneFrame={frame} />
      {scene.captions === false ? null : <Captions words={scene.words} />}
      {scene.audio ? <Audio src={scene.audio} /> : null}
    </AbsoluteFill>
  );
};

export const Explainer: React.FC<ExplainerProps> = ({ timed }) => {
  const { fps } = useVideoConfig();
  if (!timed) return null;
  const segments = timed.map((s) => s.durationInFrames);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Series>
        {timed.map((scene, i) => (
          <Series.Sequence key={scene.id} name={scene.id} durationInFrames={scene.durationInFrames} premountFor={fps}>
            <SceneLayer scene={scene} index={i} segments={segments} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
