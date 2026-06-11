# Spec: Pre-Commit Image Auto-Resize Hook

## Problem Statement

A solo developer maintaining an Astro blog manually copies images into post directories before committing. Images are not checked for dimensions, meaning high-resolution unoptimised images can silently enter the repo. At scale (hundreds of posts), this degrades build performance and repo hygiene without any obvious failure signal.

## Goals

- Automatically resize oversized images before they enter the repo
- Require zero manual discipline once set up
- Keep the commit flow uninterrupted — no blocked commits, just silent correction
- Be reusable across multiple personal projects without re-writing

## Non-Goals

- **Rejecting commits**: hook auto-fixes, never blocks
- **CI/CD enforcement**: local dev guardrail only
- **Non-image file checking**: out of scope
- **Configurable dimensions**: max width is hardcoded at 1200px
- **Non-`src/content/posts/` paths**: hook only watches that directory structure
- **Existing hook chaining or merging**: setup aborts if a hook already exists

## Deliverable

A scoped npm package (`@norgiask/<name>`) with:

- A `setup` command (`npx @norgiask/<name> setup`) that installs the pre-commit hook into `.git/hooks/pre-commit` and makes it executable
- The hook script itself, bundled inside the package
- `sharp` bundled as a package dependency (not assumed from the host project)

The package is published publicly to npm under the `@norgiask` scope so it is installable across projects and shareable with the community without migration.

## User Stories

- As a developer, I want oversized images to be automatically resized before committing so that I never have to think about it
- As a developer, I want to see before/after dimensions for each resized image so that I know exactly what changed
- As a developer, I want to bypass the hook in exceptional cases so that I am not permanently blocked when needed
- As a developer, I want a one-time setup command so that I can install the hook in any project in seconds

## Requirements

### Must-Have (P0)

- **Setup command**: `npx @norgiask/<name> setup` copies the hook to `.git/hooks/pre-commit` and runs `chmod +x` on it
- **Abort if hook exists**: if `.git/hooks/pre-commit` already exists, print a clear message and exit without overwriting; user must remove it manually or pass `--force`
- **Dimension check**: for each staged image under `src/content/posts/`, check if width exceeds 1200px
- **Auto-resize**: if oversized, resize so width is exactly 1200px with height scaled proportionately (aspect ratio preserved, no cropping, no stretching) using `sharp`
- **Re-stage**: after resizing, `git add` the file so the commit includes the resized version
- **Console output**: for each resized file, print filename and before/after dimensions, e.g. `hero.png: 3840×2160 → 1200×675`
- **No output for unchanged files**: only log files that were actually resized
- **Bypass escape hatch**: `git commit --no-verify` skips the hook entirely
- **Supported formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Bundled sharp**: `sharp` is a dependency of the package, not the host project

### Nice-to-Have (P1)

- Also handle `.gif` and `.avif`
- `--force` flag on setup to overwrite an existing hook after backing it up

### Future Considerations (P2)

- Warn if the resized file is still above a file size threshold (e.g. 500KB), suggesting format conversion
- Optionally convert to WebP on resize

## Acceptance Criteria

- Given a staged image under `src/content/posts/` with width exceeding 1200px, when `git commit` is run, then the image is resized to 1200px wide with height proportionate, re-staged, and the commit proceeds with a log line showing before/after dimensions
- Given a staged image at or under 1200px wide, when `git commit` is run, then the image is left unchanged, no log is printed, and the commit proceeds
- Given `git commit --no-verify`, the hook is skipped entirely regardless of image dimensions
- Given a staged file that is not an image, when `git commit` is run, then the hook ignores it
- Given multiple oversized images staged at once, when `git commit` is run, then all are resized, re-staged, and logged
- Given `.git/hooks/pre-commit` already exists when setup runs, then setup prints a message identifying the conflict and exits without overwriting

## Implementation Notes

### Package structure

```
@norgiask/<name>/
  bin/
    setup.js       # CLI entry point for `npx @norgiask/<name> setup`
  hook/
    pre-commit.js  # the hook script, copied into .git/hooks/ on setup
  package.json
```

### setup.js

- Check for `--force` flag
- Check if `.git/hooks/pre-commit` exists
  - If yes and no `--force`: print conflict message, exit 1
  - If yes and `--force`: back up existing hook to `.git/hooks/pre-commit.bak`, then overwrite
- Copy `hook/pre-commit.js` to `.git/hooks/pre-commit`
- Run `chmod +x .git/hooks/pre-commit`
- Print success message

### pre-commit.js

- Shebang: `#!/usr/bin/env node`
- Get staged files: `git diff --cached --name-only`
- Filter: path starts with `src/content/posts/` and extension is `.jpg`, `.jpeg`, `.png`, or `.webp`
- For each file:
  - Read metadata with `sharp(file).metadata()`
  - If `width > 1200`: resize with `sharp(file).resize({ width: 1200, fit: 'inside', withoutEnlargement: true })`, overwrite file
  - Run `git add <file>`
  - Print `<filename>: <origW>×<origH> → <newW>×<newH>`
- Exit code always `0`

## Open Questions

None — all decisions resolved.
