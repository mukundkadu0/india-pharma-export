# Deployment and asset audit

Run 2026-11-09 on the final local build. No image was removed or modified.

## Summary
- **No images are at risk.** All 1,639 images in `public/images` are committed to Git (commit `cfeb4c5`), appear in the build output, and every image the built site references exists. The 60 files that `.vercelignore` matches are not used by any built page.
- **Correction to my earlier statement.** I told you a source deploy would give a preview with missing images because `.vercelignore` drops about 14 MB. That was wrong: the ignored files (60 files, 13.3 MB) are not referenced anywhere in the built site (they are leftover originals replaced by `.webp` versions). The prebuilt deploy I used was unnecessary for images, though harmless.
- `.vercelignore` is **not committed and should stay uncommitted** (or be deleted). It served only the CLI upload workaround.

## Image counts
| Location | Files |
|---|---|
| `public/images` (source, working tree) | 1,639 |
| Tracked in Git (`git ls-files public/images`) | 1,639 |
| `dist/client/images` (Astro build) | 1,639 |
| `.vercel/output/static/images` (deployed prebuilt) | 1,639 |
| In source but missing from build / in build but not source | 0 / 0 |
| Distinct `/images/...` references in built HTML, CSS, JS | 1,567, all present on disk |
| `<img>` tags in built HTML | 6,853, 0 with a broken local `src`, 0 without `alt` |
| Source images not referenced by any built page | 72 (13.7 MB), of which 60 are the `.vercelignore` matches |

Preview deployment (`...-o7chtcwp2-...`): fetched `/images/hero-composite.webp` through the Vercel connector: HTTP 200, content matching the local file size. The deployment's file listing returned an incomplete tree (about 860 entries for 3,697 uploaded files), so I could not count images there. The upload itself reported 3,697 files.

## Does a Git-triggered build respect `.vercelignore`?
Vercel's documentation describes `.vercelignore` as a list of files excluded from being **uploaded** (the CLI upload path). A Git-triggered build clones the repository on Vercel's side. I could not find an explicit statement either way for Git builds, so this is **unverified**. It does not matter in practice: the matched files are unused, and the file is not committed, so Git builds never see it.

## Production build risk
| Question | Answer |
|---|---|
| Could the production build lose images? | No evidence of it. All images are tracked and referenced files exist |
| Should `.vercelignore` be committed? | No. It is unneeded and adds risk if its patterns ever match a used image |
| Is the prebuilt process reproducible? | Yes in principle: `npm run build` (the Vercel adapter writes `.vercel/output`) then `vercel deploy --prebuilt`. It is not what production uses. Production deploys from Git (`main`) |
| Do project settings match the repo? | Framework `astro`, Node 24.x (repo `engines` is `>=22.12`, local Node 24.13), no `vercel.json`, production branch `main`. Preview protection is on (`all_except_custom_domains`), so custom domains are public and previews need a Vercel login. No environment variables are set |
| Lockfile | `package-lock.json` is tracked |

## Issues found
1. Preview URLs require a Vercel login (project default). Share via Vercel's share link if a reviewer has no account.
2. 72 unreferenced images (13.7 MB) sit in `public/images`. They are shipped to every deployment but unused. Removing them is a size optimisation and needs a decision; not done.
3. The prebuilt preview used a copy of the build that did not include later commits, so any preview for review should come from Git (see the report).

## Git-triggered preview result
See the final report: the review branch is built by Vercel from Git, which tests that images survive a Git build.
