# Deployment for grayn.ai/lp/competitor-research

This package is V16 plus a deployment-only path fix.

## Landing page project

Deploy this folder exactly as the landing page project's root directory.
The direct deployment should continue to work at:

`https://landingpagecompetitor-research.vercel.app`

## Main Grayn project (`grayn.ai`)

The main site's `vercel.json` needs both rewrites below:

```json
"rewrites": [
  {
    "source": "/lp/competitor-research",
    "destination": "https://landingpagecompetitor-research.vercel.app"
  },
  {
    "source": "/lp/competitor-research/:path*",
    "destination": "https://landingpagecompetitor-research.vercel.app/:path*"
  }
]
```

Why both are required:
- first rule proxies the HTML page
- second rule proxies `styles.css`, `script.js`, favicon files, and `/assets/*`

The HTML inserts a `<base href="/lp/competitor-research/">` only when its hostname is `grayn.ai`, so:
- local preview keeps using relative V16 assets
- the direct `.vercel.app` deployment keeps using relative V16 assets
- `grayn.ai/lp/competitor-research` resolves the same assets through the wildcard rewrite
