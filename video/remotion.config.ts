// Applies only to the Remotion CLI (studio, render, still).
// https://www.remotion.dev/docs/config
import fs from "fs";
import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Prefer an already installed Chrome Headless Shell over downloading one
// (the download host may be blocked, e.g. in Claude Code cloud sessions).
// Order: REMOTION_BROWSER_EXECUTABLE, then Playwright's headless shell,
// otherwise Remotion downloads its own on first render.
const findPlaywrightHeadlessShell = (): string | null => {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !fs.existsSync(root)) {
    return null;
  }
  const dir = fs
    .readdirSync(root)
    .filter((name) => name.startsWith("chromium_headless_shell-"))
    .sort()
    .pop();
  if (!dir) {
    return null;
  }
  const executable = path.join(root, dir, "chrome-linux", "headless_shell");
  return fs.existsSync(executable) ? executable : null;
};

const browserExecutable =
  process.env.REMOTION_BROWSER_EXECUTABLE ?? findPlaywrightHeadlessShell();
if (browserExecutable) {
  Config.setBrowserExecutable(browserExecutable);
}
