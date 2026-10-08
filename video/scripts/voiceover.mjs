#!/usr/bin/env node
// Generates the voiceover for an explainer episode with ElevenLabs.
//
//   node scripts/voiceover.mjs src/explainer/episodes/<episode>.json [--force]
//
// For every scene it writes public/voiceover/<episode>/<scene>.mp3 and
// <scene>.json (character timestamps + duration). The Explainer composition
// picks these up automatically: scene lengths follow the narration and
// captions are synced word by word.
//
// Env: ELEVENLABS_API_KEY (required), ELEVENLABS_VOICE_ID, ELEVENLABS_MODEL.
// Existing scenes are skipped unless --force is passed, so edits to one
// scene's text only cost that scene: delete its files or use --force.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const apiKey = process.env.ELEVENLABS_API_KEY;
// "George", a premade multilingual voice. Override with your own voice id.
const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const modelId = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

const fail = (message) => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const args = process.argv.slice(2);
const episodePath = args.find((a) => !a.startsWith("--"));
const force = args.includes("--force");
if (!episodePath) fail("usage: voiceover.mjs <episode.json> [--force]");
if (!apiKey) fail("ELEVENLABS_API_KEY is not set");

const episode = JSON.parse(fs.readFileSync(path.resolve(episodePath), "utf8"));
const outDir = path.join(projectDir, "public", "voiceover", episode.id);
fs.mkdirSync(outDir, { recursive: true });

const synthesize = async (text, previousText, nextText) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: modelId,
      // Neighbouring lines keep intonation consistent across scenes.
      previous_text: previousText,
      next_text: nextText,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    const hint =
      response.status === 403 && !body.trim().startsWith("{")
        ? " (api.elevenlabs.io may be missing from the environment's network allowlist)"
        : "";
    fail(`ElevenLabs HTTP ${response.status}${hint}: ${body.slice(0, 300)}`);
  }
  return response.json();
};

const scenes = episode.scenes;
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  const mp3 = path.join(outDir, `${scene.id}.mp3`);
  const json = path.join(outDir, `${scene.id}.json`);
  if (!force && fs.existsSync(mp3) && fs.existsSync(json)) {
    console.log(`skip ${scene.id} (exists)`);
    continue;
  }
  const result = await synthesize(scene.vo, scenes[i - 1]?.vo, scenes[i + 1]?.vo);
  const alignment = result.alignment;
  const duration = alignment.character_end_times_seconds.at(-1) ?? 0;
  fs.writeFileSync(mp3, Buffer.from(result.audio_base64, "base64"));
  fs.writeFileSync(json, JSON.stringify({ duration, alignment }));
  console.log(`ok   ${scene.id} ${duration.toFixed(2)}s`);
}
console.log(`Voiceover saved to ${path.relative(projectDir, outDir)}`);
