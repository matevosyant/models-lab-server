// ElevenLabs "with-timestamps" character alignment.
export type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

// A spoken word with frames relative to the scene start.
export type Word = { text: string; start: number; end: number };

type Base = {
  id: string;
  // Short chapter name shown at the top.
  chapter: string;
  // Voiceover text, also used for captions.
  vo: string;
  captions?: boolean;
};

export type SceneSpec =
  | (Base & { type: "hook"; lines: string[]; sub: string })
  | (Base & { type: "promise"; title: string; seconds: number })
  | (Base & { type: "tokens"; sentence: string; tokens: string[]; note: string })
  | (Base & {
      type: "predict";
      prompt: string;
      options: { text: string; p: number }[];
      loop: string;
      note: string;
    })
  | (Base & {
      type: "chat";
      label: string;
      question: string;
      answer: string;
      stamp: string;
    })
  | (Base & {
      type: "tip";
      index: number;
      title: string;
      demo: string;
      highlight: string;
      checklist?: string[];
    })
  | (Base & { type: "outro"; recap: string; next: string; cta: string; done: string });

export type Episode = {
  id: string;
  title: string;
  scenes: SceneSpec[];
};

// A scene after timing is resolved (from voiceover files or estimates).
export type TimedScene = SceneSpec & {
  durationInFrames: number;
  words: Word[];
  audio: string | null;
};
