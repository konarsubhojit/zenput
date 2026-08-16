# Deployment — component gallery

The Zenput component gallery in [`demo/`](../demo) is deployed as a static site to
**Cloudflare Pages** by the [`Deploy Demo`](../.github/workflows/deploy-demo.yml)
workflow.

- **Production:** <https://zenput-demo.pages.dev> — deployed on every push to the
  default branch.
- **Previews:** every pull request gets its own preview deployment; the URL is
  posted back as a PR comment.

## Required repository secrets

| Secret                  | Where to get it                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare dashboard → My Profile → API Tokens → _Create Token_ → **Cloudflare Pages: Edit** permission. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → _Account ID_ in the right-hand sidebar.                         |

Add both under **Settings → Secrets and variables → Actions**. Credentials are never
committed to the repository.

If either secret is missing (for example on a fork), the workflow still installs
dependencies and builds the gallery — only the deploy and PR-comment steps are
skipped, so the run stays green.

## One-time Cloudflare setup

1. Create a Pages project named `zenput-demo` (Workers & Pages → Create → Pages →
   _Direct Upload_). The name must match `CLOUDFLARE_PROJECT_NAME` in
   `.github/workflows/deploy-demo.yml`.
2. Optionally attach a custom domain; Cloudflare provisions the TLS certificate
   automatically.

## How the build works

The demo aliases `zenput` to `../src` (see `demo/vite.config.ts`), so **the library
does not need to be built first** — Vite bundles the sources directly. The root
dependencies are still installed because the demo's `type-check` step type-checks
`../src`, which resolves React (and other peer) types from the root `node_modules`.

```bash
npm ci --ignore-scripts --legacy-peer-deps   # root deps (types for ../src)
cd demo && npm ci --ignore-scripts
npm run build                                # → demo/dist
```

`demo/public/_redirects` ships a `/* /index.html 200` rule so deep links resolve to
the single-page app instead of a 404.
