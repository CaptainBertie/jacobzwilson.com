# jacobzwilson.com

Static personal site in `site/` (no build step; content lives in `site/js/data.js`).

## Run locally

```bash
python3 serve.py   # http://localhost:4173
```

## How changes reach the site

| Branch | Railway environment | URL |
|---|---|---|
| `dev` | dev | https://dev.jacobzwilson.com |
| `master` | production | https://jacobzwilson.com |

1. Push to `dev`. GitHub Actions (`.github/workflows/ci.yml`) checks every local file reference, scans for secrets, builds the Docker image and loads every page. Railway deploys `dev` only after CI passes.
2. Open a pull request `dev` → `master`. `master` is protected: no direct pushes, CI must pass, branch must be up to date.
3. Merge. Railway deploys `master` to production once CI passes on the merge commit.

Hosting: `Dockerfile` + `Caddyfile` (Caddy serves `site/` on `$PORT`). Railway service settings (builder, health check, region, branch, wait-for-CI) are set in the Railway project, not in this repo.

No secrets belong in this repo — it is public.
