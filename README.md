# Doctor Who Chess - Animation Playground

## Project Overview
This project is a dedicated 3D development playground designed for testing, refining, and visualizing animations for the Doctor Who Chess game. It serves as a sandbox to ensure that character models (such as K-9) and their associated animations (walking, idle, interactions) behave correctly in a React Three Fiber environment before integration into the main game.

## Tech Stack
- **Core**: React 18, Vite
- **3D Engine**: Three.js
- **React 3D Bindings**: @react-three/fiber
- **3D Utilities**: @react-three/drei
- **State Management**: Zustand

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:5173` (or the port shown in your terminal).

## Project Structure

```
/
├── public/
│   └── models/        # 3D assets (GLB/GLTF files)
├── src/
│   ├── animations/    # Animation configuration files (The core of the animation-centric design)
│   ├── components/    # Reusable React components (UI, specific 3D helpers)
│   ├── hooks/         # Custom React hooks
│   ├── store/         # State management (Zustand)
│   ├── App.jsx        # Main application layout and control logic
│   └── main.jsx       # Entry point
└── ...
```

## Key Architecture Concepts (For AI Agents)

### Animation-Centric Design
This project uses an **"Animation-Centric"** architecture. Instead of hardcoding model behavior in components, we define behavior in configuration files located in `src/animations/`.
- **`src/animations/*.js`**: Each file here exports a configuration object that defines:
    - `modelPath`: Path to the GLB file.
    - `animations`: A dictionary of animation clip names.
    - `settings`: Initial scaling, positioning, and specific animation logic options.
- The UI allows dynamic switching between these configurations to test different scenarios.

### State Management
We use **Zustand** for state management to handle:
- Current active animation configuration.
- Playback controls (play, pause, speed).
- Debugging flags (view skeleton, view grid).

### 3D Models
- Models are placed in `public/models/`.
- Ensure models are GLB binary format for best performance.
- Animation names in the GLB must match the keys expected by the configuration files.

## Future Development Notes
- When adding a new character or animation set, create a new file in `src/animations/` (e.g., `dalek-attack.js`) rather than modifying the core `App.jsx`.
- Use the `Experience` component (if present) or the main canvas in `App.jsx` to wrap the loaded model.
- Keep the `changelog.md` updated with every significant change.

## License
MIT
