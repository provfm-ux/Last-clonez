# Cloudflare Workers previews

Cloudflare Workers Builds can deploy each feature branch as a native Worker
Preview under `last-clonez`. The branch URL follows the latest successful
deployment. For a GitHub PR from that branch, Cloudflare posts the URL in its
build comment. Each successful build also has an immutable deployment URL.

The preview command explicitly loads `wrangler.preview.jsonc` and serves
`game/` directly, including the existing `_headers`. The preview uses no
bindings, variables, or secrets. The existing production command can continue
to use its current configuration and
[production URL](https://last-clonez.pro-vfm.workers.dev).

## One-time dashboard setup

1. In the [Cloudflare dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages),
   open **Workers & Pages → last-clonez → Settings → Builds**. Under **Git
   Repository**, verify that `provfm-ux/Last-clonez` is connected. If it is
   disconnected, select **Connect** and authorize the **Cloudflare Workers &
   Pages** GitHub App. When installing the app on the `provfm-ux` GitHub
   account, choose **Only select repositories** and grant access to
   **Last-clonez**. If the app is already installed, verify repository access
   in [GitHub’s installed apps settings](https://github.com/settings/installations).
   Retain the existing production deployment mechanism and settings. If
   connecting the repository would require replacing them, stop before saving
   and record the production settings first.
2. In **Settings → Builds → Branch control**, verify that **Production branch**
   is `main`. If **Set up Worker Previews** appears under **Builds**, select
   **Set up → Switch to Worker Previews**. Cloudflare documents this as a
   one-way switch from its legacy preview model. Enable **Enable Preview Builds**
   under **Branch control**.
3. In **Settings → Builds → Build configuration**, set **Preview command** to
   the command below. It expects the root directory to be the repository root
   and uses Wrangler 4.165.0, which requires Node.js 22.12 or newer. The current
   Workers Builds image supplies Node.js 24 by default. If the Worker already
   pins an older Node version, keep the production pin and use the alternate
   Preview command below. No new shared build command, GitHub Actions secret,
   or Cloudflare resource binding is required. Keep the existing **Deploy
   command**, **Build command**, and production settings.

   ```sh
   npx --yes wrangler@4.165.0 preview --config wrangler.preview.jsonc --ignore-base-config
   ```

   For builds pinned to an older Node version:

   ```sh
   npx --yes --package=node@24.22.1 --package=wrangler@4.165.0 -- wrangler preview --config wrangler.preview.jsonc --ignore-base-config
   ```

4. In **Domains**, under **Worker URL**, turn on **Preview** for the
   `workers.dev` hostname. Leave the production URL toggle as it is.
   The `workers.dev` preview URLs are public by default. If your account uses
   Cloudflare Access, sign in on Android with an account allowed by its preview
   policy.
5. After saving the settings, push to a feature branch in
   `provfm-ux/Last-clonez` that contains `wrangler.preview.jsonc`. For the setup
   PR itself, retry its build if one exists, or trigger it with a new push to
   its branch. Older branches need to pick up the preview config before they
   can build with this command. Branches created from `main` after this PR is
   merged will inherit it.

## Test a change on Android

Open the **Preview URL** in Cloudflare’s PR comment, or copy it from
**Workers & Pages → last-clonez → Previews**. Its usual form is
`https://<preview-name>-last-clonez.pro-vfm.workers.dev`. Use the exact URL
Cloudflare reports. Start a new run and try movement, touch controls, and the
feature under review. Use the immutable deployment URL to test a specific build.
The game’s browser saves belong to each preview hostname. Export a save and
import it on the preview if you need an existing run.

For a local check that does not publish anything, run
`npx --yes wrangler@4.165.0 dev --config wrangler.preview.jsonc --local`.

[Workers Builds branch settings](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/) ·
[GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) ·
[Worker Previews](https://developers.cloudflare.com/workers/previews/get-started/) ·
[Preview URLs](https://developers.cloudflare.com/workers/previews/custom-domains/#enable-workersdev-preview-urls)
