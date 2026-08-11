# Grayn Competitor Research Landing Page — V9

Production-candidate landing page for:

`https://grayn.ai/lp/competitor-research`

## Local preview

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

Or:

```bash
npm install
npm run dev
```

## Production links

- Start free → https://app.grayn.ai/signup
- Talk to us → https://grayn.ai/book-a-call

## V9 changes

- Updated high-resolution Competitor Research dashboard.
- Updated real-image Slack competitor research screenshot.
- Ghost-free Slack animation: question → Grayn works → clean response reveal.
- First Thread animation keeps the same staged interaction with no answer bleed-through.
- Removed all “View full size” controls and image lightbox behavior.
- Rebuilt the header wordmark from the clean Grayn logo reference.
- Enlarged the browser-tab Grayn star by removing excess transparent padding.
- Added canonical/OG URL for `/lp/competitor-research`.
- Footer copyright is exactly `© 2026 Grayn`.
- Kept responsive mobile/tablet/desktop behavior and reduced repeat animation work.

## V10 final polish

- Header uses the exact supplied Grayn star + wordmark as a transparent local asset.
- No white/logo background block.
- Hero Thread animation replays every time the section is revisited.
- “Skip the dashboard” animation replays every time the section is revisited.
- Animations reset only after the visual has substantially left the viewport, preventing flicker near the trigger boundary.

## V11 timing polish

- Slowed the 1st and 3rd demo animations so they feel closer to a real product interaction.
- Added a clearer pause after the user's message before Grayn starts working.
- Increased the working-state duration before the final answer appears.
- Prompt-chip replays remain faster than scroll-triggered autoplay, but no longer feel abrupt.

## V12 final polish

- Fixed the 3rd demo so the user query is clearly visible before Grayn responds.
- Replaced the ghost-prone mask method with a clean question-state image plus answer overlay reveal.
- Kept the completed screenshot hidden until the reveal, with no odd traces underneath.
- Slightly smoothed the reveal easing and badge/typing transitions.
