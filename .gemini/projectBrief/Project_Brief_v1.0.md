# Doctor Who Chess 3JS Drei Animation Player/Tester/Playground
This is a test area for playing with animations for a 3D Doctor Who themed chess project that I'm creating separately. The idea of this test area is to understand how 3js, Fiber, and Drei work and how we can produce animations for a chess board moving around an 8x8 grid. The main focus of this is to assess the best methods for moving GLB model files around with baked-in animations and even possibly introducing some extra animations through React, Free Fiber, or Drei. 

Let's build a modular "animation player" spec from scratch, separating player logic (registry, UI, playback) from self-contained animation definitions in JS files. This keeps it scalable for chess piece moves (e.g., loading GLBs onto grid squares later).

I've pulled official docs from Context7 for @pmndrs/drei[/pmndrs/drei] and @pmndrs/react-three-fiber[/pmndrs/react-three-fiber], focusing on GLB loading, baked animations with root motion, and useAnimations hooks—these will be referenced directly in the animation JS files.

## Project Structure
```
playground/
├── public/
│   └── models/
│       └── Master_start_walk–stop_2.glb  // Sample GLB with walk_start, walk_stop, walk40frame
├── src/
│   ├── animations/  // Dynamic JS registry folder
│   │   └── walk-sequence.js  // Example: self-contained anim def (auto-registers)
│   ├── components/
│   │   ├── Player.jsx  // Core canvas + model loader
│   │   ├── Controls.jsx  // Buttons + dropdown + manual anim buttons
│   │   └── Grid.jsx  // Simple chessboard plane (8x8 wireframe)
│   ├── hooks/
│   │   └── useAnimationRegistry.js  // Watches folder, builds dropdown options
│   └── App.jsx  // Root with folder watcher setup
├── package.json  // R3F, drei, @react-three/drei, zustand (for state), vite
└── vite.config.js  // For hot-reload of animation JS files
```
Animation JS files auto-register via a `useAnimationRegistry` hook that imports all `.js` modules dynamically from `/src/animations` (using Vite's glob import). No manual dropdown updates needed—drop a new file, refresh, done. [1]

## Core Components
- **Player.jsx**: R3F Canvas (1200x800px) with <ambientLight/>, <directionalLight/>, <OrbitControls/>, and <Grid position={} scale={10} />. Loads selected GLB via <primitive object={useGLTF(url).scene} /> with <useAnimations ref={modelRef} actions={actions} />. Supports root motion by not overriding position on animated mesh. Exposed actions/actions passed to Controls. [pmndrs/react-three-fiber][pmndrs/drei]
- **Controls.jsx**: 
  - Dropdown: `<select>` lists registered animations (label + filename).
  - Two buttons: "Sequence" (triggers full programmed sequence), "Manual" (toggles list of raw actions from GLB, e.g., buttons for "walk_start", "walk_stop").
  - On "Manual", shows dynamic buttons below dropdown (e.g., click "walk40frame" to play once).
- **Grid.jsx**: Invisible 8x8 chessboard (PlaneGeometry + wireframe Lines) at y=0, scaled for piece positioning (later: snap models to squares via raycasting).

## Animation JS Files Spec
Self-contained modules export an object with:
```js
// animations/walk-sequence.js
export default {
  name: 'Three Walk Loops',
  glb: '/models/Master_start_walk–stop_2.glb',  // Public path
  initialPosition: [0, 0, 0],  // Grid square start
  sequence: async (actions, setAction) => {  // Player calls this on "Sequence"
    await actions['walk_start'].play().reset().play();  // Baked root motion moves model
    for (let i = 0; i < 3; i++) {
      await actions['walk40frame'].play().reset().play();
    }
    await actions['walk_stop'].play().reset().play();
  },
  actions: ['walk_start', 'walk_stop', 'walk40frame'],  // For manual mode
  scale: 1.5,  // Model sizing
  onLoad: (model) => { /* Optional post-load tweaks */ }
};
```
Player imports all such files into a Zustand store: `{ animations: [...], current: null }`. Select one → load GLB, wire actions, enable play. Root motion works out-of-box since Drei's <useAnimations> respects GLB transforms. [/pmndrs/drei]

## State & Registry Hook
```js
// useAnimationRegistry.js
import { useState, useEffect } from 'react';
import * as animations from '../animations/*.js';  // Vite glob

export const useAnimationRegistry = () => {
  const [registry, setRegistry] = useState([]);
  useEffect(() => {
    const animList = Object.values(animations).map(mod => mod.default);
    setRegistry(animList);
  }, []);
  return registry;
};
```
Hot-reloads on file add/edit. Store current anim in Zustand for global access.

## Playback Logic
- **Sequence**: Loads GLB → `currentAnim.sequence(actions)`.
- **Manual**: Loads GLB → buttons call `action.play().reset().play()` individually.
- Position: Starts at ; root motion anims displace model naturally (e.g., walk forward 2 squares).
- Loop support: Anim clips set to `loop: LoopOnce` or `LoopRepeat` via GLTFLoader options.

## Dependencies & Setup
```
npm create vite@latest playground --template react
cd playground && npm i three @react-three/fiber @react-three/drei @types/three zustand
npm i -D vite @vitejs/plugin-react
```
Vite config enables glob imports (`import.meta.glob('../animations/*.js')`). Run `npm run dev`—drag GLB to public/models, write JS anim, select & play.

