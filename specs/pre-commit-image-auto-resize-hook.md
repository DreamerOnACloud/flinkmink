# Spec: Pre-Commit Image Auto-Resize Hook

## Problem Statement

A solo developer maintaining an Astro blog manually copies images into post directories before committing. Images are not checked for dimensions, meaning high-resolution unoptimized images can silently enter the repo. At scale (hundreds of posts), this degrades build performance and repo hygiene without any obvious failure signal.

## Goals

- Automatically resize oversized images before they enter the repo
- Require zero manual discipline once set up
- Keep the commit flow uninterrupted — no blocked commits, just silent correction

## Non-Goals

- **Rejecting commits**: hook auto-fixes, never blocks
- **CI/CD enforcement**: local dev guardrail only
- **Non-image file checking**: out of scope
- **Husky**: use raw `.git/hooks/pre-commit` to avoid adding a dependency
- **Cross-team rollout**: solo developer context

## User Stories

- As a developer, I want oversized images to be automatically resized before committing so that I never have to think about it
- As a developer, I want to see a log of which images were resized so that I am aware of what changed
- As a developer, I want to bypass the hook in exceptional cases so that I am not permanently blocked when needed

## Requirements

### Must-Have (P0)

- **Dimension check**: for each staged image under `src/content/posts/`, check if either dimension exceeds 1920×1080
- **Auto-resize**: if oversized, resize down to fit within 1920×1080, preserving aspect ratio, using `sharp`
- **Re-stage**: after resizing, `git add` the file so the commit includes the resized version
- **Console output**: print which files were resized and their before/after dimensions
- **Bypass escape hatch**: support `git commit --no-verify` to skip the hook
- **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Dependency**: `sharp` added as a dev dependency

### Nice-to-Have (P1)

- Also handle `.gif` and `.avif`
- Configurable max dimensions via `package.json` field rather than hardcoded values

### Future Considerations (P2)

- Warn if resized file is still above a file size threshold (e.g. 500KB) after resize, suggesting format conversion
- Optionally convert to WebP on resize

## Acceptance Criteria

- Given a staged image under `src/content/posts/` with dimensions exceeding 1920×1080, when `git commit` is run, then the image is resized in place, re-staged, and the commit proceeds
- Given a staged image within 1920×1080, when `git commit` is run, then the image is left unchanged and the commit proceeds
- Given `git commit --no-verify`, when run regardless of image dimensions, then the commit proceeds with no processing
- Given a staged file that is not an image, when `git commit` is run, then the hook ignores it
- Given multiple oversized images staged at once, when `git commit` is run, then all are resized and re-staged

## Implementation Notes for Claude Code

- **Before writing any code**, inspect the Astro layout and CSS to determine the maximum rendered image width in the blog. Hardcode that value (plus proportional height) as the resize threshold — do not default to 1920×1080
- Place hook at `.git/hooks/pre-commit` as a Node.js script (shebang: `#!/usr/bin/env node`)
- Use `git diff --cached --name-only` to get staged files
- Filter by extension and path prefix `src/content/posts/`
- Use `sharp(file).metadata()` to read dimensions, `sharp(file).resize({ width: <inferred>, height: <inferred>, fit: 'inside', withoutEnlargement: true })` to resize
- Run `git add <file>` after each resize via `child_process.execSync`
- Exit code always `0` (hook never blocks)
- Make hook executable: `chmod +x .git/hooks/pre-commit`

## Open Questions

None — all decisions resolved.

## Timeline

No external dependencies beyond adding `sharp`. Self-contained, can be implemented in a single session.