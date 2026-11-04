# Verification

## Local checks — 2026-11-04

`node tests/check.mjs` passes the following automated checks:

- Exactly seven unique courses; names, categories, descriptions, button labels and complete URLs match the approved list.
- Actual rendering, ordering, accessible course-specific link names and current-tab navigation.
- Static contact details, exact telephone link, clean Maps URL, and no invented business website.
- Relative asset paths resolve under the GitHub Pages project path.
- The logo is an opaque RGB PNG with dimensions 1383 × 742 and the exact approved alt text.
- Requests derived from the homepage's actual logo src pass through the preview routing code and return the complete PNG bytes. HTML or text fallback responses are rejected, even when status is 200.
- English-only interface, no placeholder text, no credential values or private paths, and no browser storage, analytics, remote fonts, images or embedded course frames.
- Text and button color contrast, focus styles and minimum action sizes.
- Static server resource restrictions and rejection of source artwork, private files, unrelated paths and write methods.

JavaScript syntax checks pass. The source image was decoded and the trimmed web copy was compared against the supplied artwork; all lettering, decoration and the full tagline are preserved. The supplied source file is unchanged. No original course project, account, progress record or database was modified.

## Actual HTTP and human acceptance

The user restarted the local preview, ran `scripts/check-preview.mjs` and reported **PASS actual HTTP**. This verifies actual homepage bytes and a 200 image/png response containing the complete real logo, rather than just file existence or an in-process response.

The user confirmed the local page's appearance, including the visible logo and working contact display. This is recorded as user-confirmed acceptance and does not pretend that the agent independently repeated it.

The agent environment blocks loopback connections and listeners with EPERM; the local test runner labels those checks NOT RUN when blocked. A blocked agent rerun does not invalidate the user's successful HTTP result. Earlier local 404 responses came from an old preview process that had not loaded the image route; restarting that project preview resolved the issue.

## Limits

There is no separate completed audit of screen readers, all physical devices, or every external course's availability. The hub preserves the approved course destinations and does not poll those sites. The hub does not implement shared login, progress synchronization or teacher management.

Publication requires separate confirmation that GitHub Pages deployed the intended commit and that the production page and its assets load. Those results belong in `RELEASE.md`; pushing Git is not treated as a completed online check.
