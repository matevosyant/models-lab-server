#!/usr/bin/env node
// Image helper for the video project: download, inspect and edit images
// that end up in public/images and are used via staticFile().
//
//   node scripts/image.mjs fetch <url> <name>          download into public/images/<name>
//   node scripts/image.mjs info <file>                 print size, format, alpha
//   node scripts/image.mjs edit <in> <out> [options]   edit with sharp
//
// edit options:
//   --resize WxH        resize (e.g. 1920x1080, 1920x, x1080)
//   --fit MODE          cover (default) | contain | fill | inside | outside
//   --background COLOR  letterbox color for --fit contain (default #000000)
//   --crop X,Y,W,H      extract a region before resizing
//   --rotate DEG        rotate clockwise
//   --flip / --flop     mirror vertically / horizontally
//   --grayscale         black and white
//   --blur SIGMA        gaussian blur (0.3 - 1000)
//   --sharpen           mild sharpening
//   --brightness N      multiplier, 1 = unchanged
//   --saturation N      multiplier, 1 = unchanged
//   --tint COLOR        tint with a color
//   --quality N         1-100 for jpeg/webp/avif (default 90)
// The output format follows the extension of <out> (.jpg .png .webp .avif).
// Relative paths are resolved against public/images.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(projectDir, "public", "images");

const resolveImage = (p) => (path.isAbsolute(p) ? p : path.join(imagesDir, p));

const fail = (message) => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const parseArgs = (args) => {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith("--")) {
      fail(`unexpected argument ${arg}`);
    }
    const key = arg.slice(2);
    const next = args[i + 1];
    if (next === undefined || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      i++;
    }
  }
  return options;
};

const fetchImage = async (url, name) => {
  if (!url || !name) {
    fail("usage: fetch <url> <name>");
  }
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) {
    const hint =
      response.status === 403
        ? " (in a Claude Code cloud session the host may be missing from the network allowlist)"
        : "";
    fail(`download failed: HTTP ${response.status} ${response.statusText}${hint}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  // Reject anything that is not a decodable image (HTML error pages etc.).
  const meta = await sharp(buffer).metadata().catch(() => null);
  if (!meta || !meta.format) {
    fail("downloaded file is not an image");
  }
  const target = resolveImage(name);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, buffer);
  console.log(`Saved ${path.relative(projectDir, target)} (${meta.width}x${meta.height} ${meta.format})`);
};

const info = async (file) => {
  if (!file) {
    fail("usage: info <file>");
  }
  const meta = await sharp(resolveImage(file)).metadata();
  console.log(
    JSON.stringify(
      {
        width: meta.width,
        height: meta.height,
        format: meta.format,
        hasAlpha: meta.hasAlpha,
        orientation: meta.orientation ?? 1,
      },
      null,
      2,
    ),
  );
};

const edit = async (input, output, args) => {
  if (!input || !output) {
    fail("usage: edit <in> <out> [options]");
  }
  const o = parseArgs(args);
  // Apply EXIF orientation first so phone photos are upright.
  let image = sharp(resolveImage(input)).autoOrient();

  if (o.crop) {
    const [left, top, width, height] = String(o.crop).split(",").map(Number);
    image = image.extract({ left, top, width, height });
  }
  if (o.rotate) {
    image = image.rotate(Number(o.rotate), { background: o.background ?? "#000000" });
  }
  if (o.flip) image = image.flip();
  if (o.flop) image = image.flop();
  if (o.resize) {
    const [w, h] = String(o.resize).split("x");
    image = image.resize({
      width: w ? Number(w) : undefined,
      height: h ? Number(h) : undefined,
      fit: o.fit ?? "cover",
      background: o.background ?? "#000000",
    });
  }
  if (o.brightness || o.saturation) {
    image = image.modulate({
      brightness: o.brightness ? Number(o.brightness) : 1,
      saturation: o.saturation ? Number(o.saturation) : 1,
    });
  }
  if (o.grayscale) image = image.grayscale();
  if (o.tint) image = image.tint(o.tint);
  if (o.blur) image = image.blur(Number(o.blur));
  if (o.sharpen) image = image.sharpen();

  const quality = o.quality ? Number(o.quality) : 90;
  const ext = path.extname(output).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") image = image.jpeg({ quality, mozjpeg: true });
  else if (ext === ".webp") image = image.webp({ quality });
  else if (ext === ".avif") image = image.avif({ quality });
  else if (ext === ".png") image = image.png();
  else fail(`unsupported output format ${ext}`);

  const target = resolveImage(output);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const result = await image.toFile(target);
  console.log(`Saved ${path.relative(projectDir, target)} (${result.width}x${result.height} ${result.format})`);
};

const [command, ...rest] = process.argv.slice(2);
try {
  if (command === "fetch") await fetchImage(rest[0], rest[1]);
  else if (command === "info") await info(rest[0]);
  else if (command === "edit") await edit(rest[0], rest[1], rest.slice(2));
  else fail("commands: fetch <url> <name> | info <file> | edit <in> <out> [options]");
} catch (error) {
  fail(error.message);
}
