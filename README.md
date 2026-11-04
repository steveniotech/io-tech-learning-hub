# io Tech Learning Hub

A public course directory for io Tech Learning Center. Seven course cards use the complete URLs in `courses.js` and open in the current tab. The page uses local assets and system fonts, with no login, tracking, browser storage, database, or build dependencies.

## Local preview

With Node.js 18 or newer, run from this directory:

```sh
node scripts/serve.mjs --port 8765
```

Open http://127.0.0.1:8765/io-tech-learning-hub/. The server binds only to the loopback address and serves the five public runtime files. If an old copy of this project's preview is running, stop that copy with Control+C before restarting it. Do not stop other projects' servers. Route changes require a server restart; content changes require a browser reload.

## Edit courses and contact details

`courses.js` is the only course catalog. Each entry has a stable `id`, English `name`, `category`, `description`, course-specific `button`, complete `url`, and numeric `order`. Keep file paths, trailing slashes and hash fragments intact. Update the independent expected list in `tests/check.mjs` when intentionally changing courses.

The public address, phone and Maps link are static HTML in `index.html`, so they remain available without JavaScript. No business website link is shown because an official URL has not been supplied.

The complete, trimmed logo is `assets/io-tech-center-logo.png`. It retains the supplied artwork, tagline, aspect ratio and opaque white background; the web image has no EXIF metadata. Source artwork copies and local records are excluded from Git. Reusable brand colors and spacing are CSS variables in `styles.css`.

## Checks

```sh
node --check courses.js
node --check app.js
node tests/check.mjs
node scripts/check-preview.mjs
```

The last command needs the running local preview. It checks that live HTML matches the file and that the actual logo request returns 200, image/png, and the complete PNG bytes. `PASS in-process routing` alone does not establish live HTTP success. See `TESTING.md` for the distinction between automated checks and user-confirmed browser acceptance.

## GitHub Pages

Public repository: `steveniotech/io-tech-learning-hub`.
Published site: https://steveniotech.github.io/io-tech-learning-hub/.

Publish this independent repository from `main` / `/(root)` using GitHub Pages. `.nojekyll` permits direct static hosting. The runtime consists of `index.html`, `styles.css`, `courses.js`, `app.js`, and `assets/io-tech-center-logo.png`; all asset paths are relative. There is no generated `dist` directory or custom build workflow.

For later updates, edit only this project, run the checks, review the exact Git diff, commit, and push `main`. Wait for the Pages deployment to finish, then inspect the live page, image, CSS, scripts and course links. A successful push alone is not release verification. Record releases in `RELEASE.md`.

To roll back the frontend, revert the unwanted release commit, push the revert to `main`, and verify the following Pages deployment. Do not force-push, change the account root site, or change any course website. Course accounts and learning data are not managed by this directory.

## Files

- `index.html`: page structure, logo and static public contact details.
- `courses.js`: course catalog.
- `app.js`: accessible course rendering and configuration validation.
- `styles.css`: responsive layout, brand tokens and visible keyboard focus.
- `assets/io-tech-center-logo.png`: public logo.
- `scripts/serve.mjs`: restricted local HTTP preview.
- `scripts/check-preview.mjs`: routing and live local HTTP verification.
- `tests/check.mjs`: package-free acceptance checks.
- `TESTING.md`: verification scope and limitations.
- `RELEASE.md`: release versions, deployment and online verification.
