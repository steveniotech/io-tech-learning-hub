# Release record

## Initial public release — 2026-11-04

- Public website: https://steveniotech.github.io/io-tech-learning-hub/.
- Public repository: https://github.com/steveniotech/io-tech-learning-hub.
- Website content commit: `d1c7c0a7426dde069402c631b34370d976bbb829`.
- First successful deployment: https://github.com/steveniotech/io-tech-learning-hub/actions/runs/41851313817 (Success, 28 seconds).
- Pages source verified in repository settings: Deploy from a branch, `main`, `/(root)`; HTTPS enforced. The Pages-generated workflow is not a custom workflow added to this repository.
- Release-record updates after that content commit change documentation only; the current published revision is identified by the latest successful Pages run and Git history.

### Completed online checks

The agent opened the actual production URL in Chrome after Pages reported deployment success. The full revised logo and tagline, public address and telephone, Maps link, English heading, all seven cards and course-specific buttons were present.

With the browser cache disabled temporarily, Chrome Network showed HTTP 200 for the production HTML, `styles.css`, `courses.js`, `app.js`, and `assets/io-tech-center-logo.png`. The logo was recognized as PNG and visibly decoded; it did not return an HTML fallback or Not found response. Desktop and a 375 × 812 responsive viewport were visually inspected. The seven production link destinations were compared with the approved catalog, preserving Python's `index.html` and both Netlify hash fragments.

No application JavaScript errors or failed runtime asset requests were observed. Chrome displayed non-blocking warnings about unrecognized features in the hosting Permissions-Policy header; no site code or permissions were weakened to suppress them.

The published files were reviewed for private paths, credential values, unrelated files and local logs. Only the metadata-free web logo was committed; the source artwork and historical local records remain ignored. No account root site, original course repository, Supabase configuration, account or learning record was modified.

### Limits

This release checks the hub and its link destinations, not the internal functionality, login or availability of every external course. Physical-device and screen-reader audits have not been completed. No unified login or progress tracking is implemented or implied.

### Later updates and rollback

Edit this independent project, run the commands in `README.md`, inspect the Git diff and credential scan, then commit and push `main`. Wait for the Pages run to succeed and verify the live page and assets again.

For a frontend regression, use `git revert` on the faulty change and push the revert to `main`. Wait for Pages and recheck the site. Do not reset or force-push history, change another repository's Pages settings, or modify course accounts or data.
