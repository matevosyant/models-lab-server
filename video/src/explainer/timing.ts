import type { Alignment, Word } from "./types";

// Average Russian narration speed, used until real voiceover exists.
const CHARS_PER_SECOND = 14;
// Silence kept after each line so scenes can breathe.
export const TAIL_SECONDS = 0.45;
const MIN_SCENE_SECONDS = 3;

export const estimateSeconds = (vo: string) =>
  Math.max(MIN_SCENE_SECONDS, vo.length / CHARS_PER_SECOND);

export const sceneFrames = (speechSeconds: number, fps: number) =>
  Math.ceil((speechSeconds + TAIL_SECONDS) * fps);

// Evenly spread words over the estimated speech time.
export const estimateWords = (vo: string, fps: number): Word[] => {
  const total = estimateSeconds(vo) * fps;
  const parts = vo.split(/\s+/).filter(Boolean);
  const chars = parts.reduce((sum, w) => sum + w.length + 1, 0);
  let cursor = 0;
  return parts.map((text) => {
    const length = ((text.length + 1) / chars) * total;
    const word = { text, start: Math.round(cursor), end: Math.round(cursor + length) };
    cursor += length;
    return word;
  });
};

export const alignmentToWords = (a: Alignment, fps: number): Word[] => {
  const words: Word[] = [];
  let text = "";
  let start = 0;
  let end = 0;
  a.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) {
      if (text) words.push({ text, start, end });
      text = "";
      return;
    }
    if (!text) start = Math.round(a.character_start_times_seconds[i] * fps);
    text += ch;
    end = Math.round(a.character_end_times_seconds[i] * fps);
  });
  if (text) words.push({ text, start, end });
  return words;
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]/gu, "");

// Frame at which the narrator starts saying `needle` (a word prefix),
// so visuals land exactly on the spoken word. Falls back if not found.
export const cue = (words: Word[], needle: string, fallback: number) => {
  const n = normalize(needle);
  const hit = words.find((w) => normalize(w.text).startsWith(n));
  return hit ? hit.start : fallback;
};
