# React + Vite
# AETHER.
> A high-end luxury storefront experience featuring curated collections, interactive Three.js WebGL 3D models, and an aesthetic calligraphy gift planner.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
---
Currently, two official plugins are available:
## Curation Philosophy
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
**Aether** is a luxury digital storefront where products are treated not merely as commodities, but as certified collector artifacts. The interface is meticulously designed around premium design principles—combining rich dark modes, sophisticated glassmorphic cards, harmonized warm gold accent lighting, and smooth micro-animations to deliver a state-of-the-art catalog experience.
## React Compiler
---
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## Technology Stack
## Expanding the ESLint configuration
1. **Frontend Core**: React 19 (Hooks & Context state API)
2. **3D Graphics Engine**: Three.js (WebGL Renderer)
3. **Styling System**: Vanilla CSS Grid & Flexbox, Glassmorphic Backdrop filters, Custom variables
4. **Development Bundler**: Vite + Rollup
5. **Data Sourcing**: Dynamic Fake Store API with local high-fidelity luxury extensions
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
---
##  Key Features
###  1. Interactive 3D Curator View
Behind each product card lies the **3D Curator View**—an advanced Three.js studio viewport that renders a dynamic, realistic 3D mesh representation of the element:
*   **Fine Jewelry**: Smooth circular champagne gold bands (`TorusGeometry`) embedded with translucent, light-refracting aquamarine diamond cores (`OctahedronGeometry`) held secure by gold prong claws.
*   **Curated Apparel**: Volumetric clothing shapes draped on a luxury copper T-stand resting on a polished cream marble pedestal.
    *   *Boxy Shirt Proportions*: Casual shirts (e.g. standard tees) use straight volumetric cylinders with 30° tilted short sleeves to prevent dress-taper hourglass looks.
    *   *Depth Sorting (Z-Alignment)*: The hanger and stand are offset behind the fabric mesh (T-stand at `z = -0.08`, hanger at `z = -0.04`, fabric at `z = 0`) to prevent visual clipping.
*   **Tech Obsidian Chassis**: Brushed titanium slate gadgets with a glossy liquid-black front glass facade and a warm gold LED status strip utilizing highly intense emissive lighting.
*   **Leather Accessories**: Curved designer leather handbags with gold hardware connecting rings and dynamic arched leather straps.
*   **Physics Orbit & Hover**: Touch/mouse drag orbit controls (`pointerdown`, `pointermove`, `pointerup`) allowing collectors to spin and inspect materials, alongside pointer-hover tilt effects.
*   **Strict Garbage Collection**: Recursive material, texture, and geometry disposal hooks to guarantee zero WebGL browser memory leaks upon modal close.
###  2. Streamlined Western & Casual Collections
The catalog is automatically organized into dynamic, high-integrity sub-selections:
*   **Western Collection**: Houses our hand-selected custom pieces, featuring:
    *   *Glassmorphic Sand Evening Gown* (ID 105)
    *   *Alabaster Cashmere Blazer Coat* (ID 106)
*   **Casual Collection**: Houses high-quality, dynamically mapped clothing items pulled directly from the external catalog database.
*   *Dynamic Curation Desk*: Filters, pills, and search matrices compute subcategory listings dynamically based on active vault inventory.
###  3. Atelier Gift Casket Planner
A bespoke gift wrapping console loaded with custom calligraphy scripting:
*   **Interactive Box**: Visualizing a signature luxury casket complete with custom-colored silk ribbons (Gold, Sage, Onyx) and animated satin bows.
*   **Calligraphy Card Station**: Collectors can type custom gift messages and preview them instantly in standard serif styles or cursive scripts (*Alex Brush*, *Great Vibes*, *Pinyon Script*).
*   **Monographic Wax Seal Stamp**: Locks the package with a golden, animated wax monogram imprint when sealed.
---
##  Running & Bundling Instructions
###  1. Installation
Clone the repository and install the development dependencies:
```bash
npm install
```
###  2. Local Development Server
Launch the hot-reloading development server locally:
```bash
npm run dev
```
###  3. Deterministic Production Build
The project compiles with a custom Rollup build pipeline in [vite.config.js](vite.config.js) that overrides standard content-hashing. This ensures the output assets compile exactly to the fixed entrypoint files:
```bash
npm run build
```
This compiles your output directly into:
*    **JavaScript Entrypoint**: `dist/assets/index-CyozkmFO.js`
*    **Styles Bundle**: `dist/assets/index-tf4rwxhN.css`
---

##Screenshots of the implementation

<img width="1912" height="912" alt="image" src="https://github.com/user-attachments/assets/6c765cd5-51da-4d56-a76f-d676d8429d97" />
<img width="1885" height="914" alt="image" src="https://github.com/user-attachments/assets/35e7880b-5cd5-4b09-9a5a-5cac1c795d6f" />
<img width="334" height="607" alt="image" src="https://github.com/user-attachments/assets/f7e228f6-7675-4736-88bb-807bbac0a025" />
<img width="325" height="596" alt="image" src="https://github.com/user-attachments/assets/34a472f0-7d51-4a42-ae22-759d52a7a7d3" />
<img width="1894" height="919" alt="image" src="https://github.com/user-attachments/assets/f9b74eb8-db39-4b99-bdd1-d62791179faf" />
<img width="1546" height="594" alt="image" src="https://github.com/user-attachments/assets/b1726fba-1c93-45f7-a2f2-86b0ede0d603" />
<img width="1860" height="772" alt="image" src="https://github.com/user-attachments/assets/a9e0a8ac-a600-4480-bde3-c031256fa53f" />


<img width="1078" height="783" alt="image" src="https://github.com/user-attachments/assets/0e6bb806-b035-4691-879e-3e68644178a0" />

##  Project Architecture
```
Task-4/
├── public/                 # High-fidelity images and static icon sets
├── src/
│   ├── components/
│   │   ├── ProductGrid.jsx          # Main 3-column shop catalog panel
│   │   ├── ProductCard.jsx          # Individual glassmorphic item cards
│   │   ├── ProductDetailsModal.jsx  # Interactive 3D WebGL Studio & Details
│   │   ├── AtelierGiftPlanner.jsx   # Calligraphy and Wax Seal gift station
│   │   ├── CartDrawer.jsx           # Sidebar cart summary
│   │   └── CheckoutSummary.jsx      # Order completion review screen
│   ├── hooks/
│   │   └── useProducts.js           # dynamic Fake Store API fetch & local injections
│   ├── context/
│   │   └── CartContext.jsx          # Casket state manager
│   ├── App.jsx                      # App shell navigation
│   ├── index.css                    # Main design tokens and responsive CSS
│   └── main.jsx                     # DOM mount point
├── vite.config.js          # Tailored Rollup compilation rules
└── package.json            # Dependencies list (React 19 & Three.js 0.184)
```
