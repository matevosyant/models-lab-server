#!/bin/bash
# Installs npm dependencies for the Express server (root) and the Remotion
# project (video/) in Claude Code on the web sessions.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"
npm install --no-audit --no-fund

cd "$CLAUDE_PROJECT_DIR/video"
npm install --no-audit --no-fund
