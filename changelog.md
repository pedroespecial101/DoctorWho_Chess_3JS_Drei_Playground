# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3] - 2026-01-11

### Fixed
- **CRITICAL BUG FIX**: Resolved model origin reset issue for root motion animations.
  - Wrapped model in a manual transformation group in `Player.jsx`.
  - Implemented manual world position tracking with `useFrame`.
  - Updated `walk-debug.js` to avoid `.reset()` and manually apply displacement deltas between animation cycles.
  - Updated `App.jsx` manual playback to avoid `.reset()` and use `action.time = 0` to preserve displacement.
  - Enabled Draco support and preloading for the primary model.
- **Robustness**: Fixed animation mixer event listener bug.
  - Implemented `mixer` detection fallback and action-specific event filtering to prevent `TypeError`.
  - Moved `utils.js` to `src/utils/animationUtils.js` to prevent it from being incorrectly loaded as an animation definition.
  - Fixed React list `key` warning in `Controls.jsx`.


## [0.1.2] - 2026-01-11

### Added
- Created `src/animations/walk-debug.js`: A new animation sequence with 5 consecutive `walk40frame` loops for easier debugging.
- Created `src/animations/utils.js`: Extracted animation helper `playActionOnce` to a shared utility file.
- Set `Debug 5x Walk` as the default animation sequence on application load in `src/App.jsx`.

### Changed
- Refactored `src/animations/walk-sequence.js` to use the shared `playActionOnce` utility.


### Added
- Added `.gitignore` to exclude build artifacts, dependencies, and system files.
- Created `README.md` with project documentation, verification instructions, and notes for future AI agents.

### Fixed
- Fixed T-pose issue where character would not animate: Removed `scene.clone()` in `Player.jsx` as it breaks mapping between SkinnedMeshes and Biped/Bones.
- Fixed animation name mismatch: GLB uses `stop_walking` not `walk_stop`.

## [0.1.0] - 2026-01-11

### Added
- **Project Foundation**
  - Initialized Vite React project with package.json
  - Configured vite.config.js with React plugin and port 3000
  - Created index.html entry point

- **Core Components**
  - `src/components/Player.jsx` - R3F Canvas with GLB loading, useAnimations, OrbitControls, lighting, and environment
  - `src/components/Controls.jsx` - Animation dropdown, speed slider (0.1x-2x), Sequence/Manual buttons, dynamic action buttons
  - `src/components/Grid.jsx` - 8x8 chessboard wireframe with checkerboard pattern

- **Animation System**
  - `src/store/animationStore.js` - Zustand store for animations, current selection, speed, and mode
  - `src/hooks/useAnimationRegistry.js` - Dynamic import of animation files using Vite glob
  - `src/animations/walk-sequence.js` - First animation definition using Master_start_walk-stop_2.glb

- **Styling**
  - `src/index.css` - Dark sci-fi themed UI with Doctor Who aesthetic
  - Glassmorphism controls panel
  - Gradient-styled speed slider with custom thumb

- **Features**
  - Animation speed control (0.1x to 2x playback speed)
  - Sequence mode for programmed animation chains
  - Manual mode for individual action triggering
  - Hot-reload support for animation definition files
