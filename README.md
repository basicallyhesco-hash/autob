# Corpus — The living atlas

An interactive anatomy learning website built with React, Vite, and original SVG illustrations.

## Open the website without installing anything

1. On GitHub, choose **Code → Download ZIP**.
2. Extract the ZIP completely.
3. Open **`standalone/index.html`** in a modern browser.

The standalone file includes the application, fonts, styles, and asset licenses. It does not need a server or internet connection for the atlas, city, or quizzes. Do not open the root `index.html`: that file is the development entry point.

To regenerate the standalone file after changing the source, run `npm ci` followed by `npm run build:standalone`. To host the standalone version, upload the contents of `standalone/` to a static website host.

## Run locally

Use Node.js 24 (tested with 24.19.0) and npm 11.

```sh
npm ci
npm run dev -- --port 5173
```

The development server binds to all interfaces. No credentials, database, or external API is required. Fonts are bundled locally; the app makes no third-party requests during normal use.

## Build and test

```sh
npm run build
npm test
```

`npm run preview -- --port 4173` serves the production build. Deploy the generated `dist/` directory to a static hosting service.

Playwright uses `/usr/bin/chromium` when available. On another machine, install its browser first with `npx playwright install chromium` (and the documented Playwright system dependencies if needed). The test runner starts the development server automatically when one is not already running.

The tests exercise map selection, city/anatomy synchronization, layers, region filtering, labels, zoom and dragging, focus mode, search, notebook persistence, all four learning paths, quiz scoring, mobile overflow, and dialog keyboard navigation. Automated axe checks cover both maps, learning dialogs, and the mobile layout; they supplement rather than replace manual accessibility evaluation.

## Features

- Two linked interactive views: human anatomy and an anatomical city.
- 34 selected anatomical structures/groups across organs, arteries, veins, nerves, and lymphatics.
- 15 organ landmarks, all labeled with their anatomical names in both views.
- Two city districts connected by a symbolic bridge: head/thorax/abdomen above; pelvis/lower limbs below.
- Search by anatomical name, system, region, or city function. Press Ctrl/Cmd + K to search.
- Toggle layers, isolate body regions, hide labels, and zoom. Drag the diagram after zooming in. Reset restores the whole view.
- Organ descriptions, locations, connections, memorable city analogies, and facts.
- Four guided paths: circulation, digestion, lymph return, and sensory signaling.
- Seven-question active-recall quiz with explanations, scoring, and review links.
- Bookmarks and exploration progress saved locally in the browser. No account is needed.
- Responsive layout, keyboard-selectable map targets, focus-managed dialogs, and reduced-motion support.

## Anatomical scope

This is a schematic study aid, not an exact-scale anatomical reconstruction, exhaustive organ list, dissection atlas, or diagnostic product. Patient right appears on the viewer’s left in the anterior view. Posterior structures are superimposed; pathways, proportions, and depth are simplified. Some paired structures are represented by a single selectable group.

The city retains anatomical names and approximate relative positions. Building footprints are spaced for clarity. Roads symbolize communication and transport pathways; the bridge is a teaching metaphor, not a structure or separation in the human body. The upper/lower boundary used here is between the abdomen and pelvis, not the diaphragm.

Red indicates arterial routes and blue indicates venous routes, **not oxygen content**. Pulmonary arteries carry deoxygenated blood and pulmonary veins carry oxygenated blood. The routes do not show every branch, capillary bed, vessel connection, nerve, or lymph node.

Foundational references for continued study: [OpenStax Anatomy and Physiology 2e](https://openstax.org/details/books/anatomy-and-physiology-2e) and [NCBI Bookshelf: anatomy reference library](https://www.ncbi.nlm.nih.gov/books/). Formal educational use should include review by an anatomy educator.

## Project structure

- `src/data.js`: anatomy, city analogies, guided paths, and quiz content.
- `src/Atlas.jsx`: original body illustration, vessel/nerve/lymph routes, city buildings, labeling, and pan behavior.
- `src/main.jsx`: application state, navigation, exploration controls, notebook, and learning dialogs.
- `src/styles.css`: responsive visual design and accessibility styling.
- `tests/`: browser interaction and accessibility tests.
- `standalone/index.html`: ready-to-open website, with all assets embedded.
- `scripts/build-standalone.mjs`: reproducible standalone packager.

The existing checkout is the development workspace. Cloud tasks are isolated; no additional Git worktree is needed. This project has not been deployed to a public hosting provider.
