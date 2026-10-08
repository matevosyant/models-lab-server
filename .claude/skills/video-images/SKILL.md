---
name: video-images
description: Find, download, generate and edit images, then add them to the Remotion video project in video/. Use when the user wants pictures or photos in a video, asks to search/download/edit/crop/resize an image, or wants a slideshow.
---

# Images for the Remotion video project

All images used in videos live in `video/public/images/` and are loaded with
`<Img src={staticFile("images/<name>")} />`. Work from `video/`.

## 1. Find an image

Pick the first source that fits:

- **User's own files**: images the user committed or attached. Copy them into `public/images/`.
- **Web search**: use the `WebSearch` tool to find a page, then `WebFetch` it to get a direct image URL
  (prefer Wikimedia Commons, Unsplash, Pexels, Pixabay, which have free licenses).
- **Unsplash connector** (`mcp__Unsplash__*` tools, if the user connected it): search photos and get download URLs.
- **Generate with AI**: Higgsfield connector (`mcp__Higgsfield__generate_image`, load via ToolSearch), or
  the ModelsLab proxy in this repo (`POST /generate` in `server.js`, needs `API_KEY`).

Tell the user the source and license of every image you use.

## 2. Download

```bash
node scripts/image.mjs fetch <url> <name.jpg>
```

Saves to `public/images/<name>` and rejects anything that is not a real image.
A `403` in a Claude Code cloud session means the host is not on the environment's
network allowlist: tell the user which host to add (environment settings -> Network access)
instead of retrying. Higgsfield results can be imported with `mcp__Higgsfield__media_import_url`
or downloaded the same way if their host is allowed.

## 3. Edit

Local edits with sharp (fast, free):

```bash
node scripts/image.mjs info  <file>
node scripts/image.mjs edit  <in> <out> [options]
```

Options: `--resize 1920x1080` (or `1920x`, `x1080`), `--fit cover|contain|fill|inside|outside`,
`--background "#000"`, `--crop X,Y,W,H`, `--rotate DEG`, `--flip`, `--flop`, `--grayscale`,
`--blur SIGMA`, `--sharpen`, `--brightness N`, `--saturation N`, `--tint COLOR`, `--quality N`.
Output format follows the extension (`.jpg .png .webp .avif`). Relative paths resolve against `public/images`.

Defaults that work well: resize to the composition size (`1920x1080`, vertical `1080x1920`)
with `--fit cover`, save as `.jpg --quality 85`. Keep transparent images (logos, cut-outs) as `.png`/`.webp`.

For anything sharp cannot do, Python with Pillow is installed (`python3 -c "from PIL import Image"`).

AI edits through the Higgsfield connector: `remove_background`, `upscale_image`,
`outpaint_image` (extend to a new aspect ratio), `generate_image` with a reference image for restyling.

Always look at the result (Read the image file) before putting it in a video.

## 4. Put it in the video

- Quick slideshow: render the `Slideshow` composition with your images:
  ```bash
  npx remotion render Slideshow out/slideshow.mp4 \
    --props='{"images":["images/a.jpg","images/b.jpg"],"secondsPerImage":3,"transitionSeconds":0.5}'
  ```
  Duration is computed from the number of images.
- In a custom composition: `import { Img, staticFile } from "remotion"` and
  `<Img src={staticFile("images/a.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />`.
  Never use a plain `<img>` (Remotion would not wait for it to load).
- For Remotion API details load the `remotion-best-practices` skill.

Check a frame with `npx remotion still <Composition> out/check.png --frame=<n>` and Read it before the full render.
