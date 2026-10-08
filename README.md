# Corpus — the whole-body 3D learning atlas

Corpus is an interactive anatomy study site with two linked three-dimensional views: a layered human-body model and a city arranged along the same body plan. Rotate either view, select a structure, search by name, and compare where it appears in the atlas and city.

## Download and open

1. Download this repository as a ZIP from GitHub.
2. Extract the ZIP.
3. Open **`standalone/index.html`** in a current desktop browser. Keep the file inside the extracted folder while opening it.

The standalone page bundles its JavaScript, styling, local fonts, Three.js, and license notices into one offline-capable HTML file. It needs no Node installation, server, account, or internet connection. To regenerate it after changing source files, run `npm ci` and `npm run build:standalone`.

## Explore

- **Human anatomy:** orbit the whole-body scene, zoom, isolate systems, filter a body region, search named structures, and select visible structures for descriptions and links.
- **Body city:** explore a 3D city whose named buildings are positioned by body region and whose arterial, venous, neural, and lymphatic routes become roads. The waist bridge is a learning metaphor linking the upper and lower city districts.
- **Scope:** 671 searchable named gross-anatomy entries: 206 bones, 110 skeletal-muscle entries, 59 arterial entries, 42 venous entries, 38 nerve/plexus entries, 30 lymphatic entries, organs, and further digestive, respiratory, urinary, reproductive, endocrine, sensory, joint, skin, and immune structures.
- **Learning tools:** descriptions, location and connection notes, four guided paths, a recall quiz, bookmarks, and locally saved exploration progress.

## Run and build locally

Use Node.js 24 and npm. No server-side service, credentials, or external API is required.

```sh
npm ci
npm run dev -- --port 5173
npm run build
npm run build:standalone
```

Vite serves the interactive development site at the address it prints. `npm run build` writes the web bundle to `dist/`. The deployable static site is `dist/`; the single-file download is `standalone/index.html`.

## Anatomical scope

The 3D model is procedural and intended as a whole-body gross-anatomy visualization. It gives structures volume and relative position for learning, but it is not a medical-grade scan, dissection atlas, or exact anatomical reconstruction. Many mesh forms and body coordinates are simplified; small vessels, microscopic anatomy, variants, and every individual branching relationship are not reconstructed. Named entries remain searchable and select their mapped position. Consult an anatomy reference for precise clinical or dissection work.

Patient right appears on the viewer’s left in the anterior view. The city layout preserves a broad body-region plan, but its building footprints are spaced for visibility. Arterial paths are red and veins blue; those colors describe vessel type, not oxygen content. Pulmonary arteries carry deoxygenated blood and pulmonary veins carry oxygenated blood. The city bridge is a teaching metaphor, not an anatomical structure.

For further study, see [OpenStax Anatomy and Physiology 2e](https://openstax.org/details/books/anatomy-and-physiology-2e) and [NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/). An anatomy educator should review the content before formal classroom adoption.

## Source layout

- `src/ThreeAtlas.jsx`: Three.js anatomy and city scenes, mesh selection, labels, orbiting, and zoom.
- `src/catalog.js`: whole-body structure names, body regions, and system groupings.
- `src/data.js`: selected organ descriptions, city analogies, learning paths, and quiz content.
- `src/main.jsx`, `src/styles.css`, `src/three.css`: learning controls, responsive interface, and presentation.
- `scripts/build-standalone.mjs`: embeds the production bundle and its local licenses.

The website can be deployed by serving `dist/` with any static web host. It has not been published to a public web host.
