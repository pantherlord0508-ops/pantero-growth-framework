

## Plan: Solid 3D Cubes Rolling on Static Table with Side Detail Panel

### Problems to Fix

1. **Camera orbits the whole scene** — user wants a fixed platform/table, only cubes move
2. **Cubes are wireframe/edge-only** — user wants solid, real-looking 3D cubes
3. **No detail panel** — when a cube lands, a half-page info section should appear on the left describing the feature

### Changes

#### 1. `src/components/intro/PanteroCubes.tsx` — Solid Real Cubes

- Remove the wireframe edge bars (`CUBE_EDGES`) and corner spheres (`CUBE_CORNERS`)
- Replace with a single solid `boxGeometry` using `meshPhysicalMaterial` with:
  - Dark glossy faces (metalness 0.85, roughness 0.15, clearcoat 1.0)
  - Gold-colored edges rendered via `<lineSegments>` with `edgesGeometry` for subtle gold outlines
- Keep the rolling physics, bounce, and spin-to-reveal logic
- Each cube rolls from top-right of scene, tumbles across table, settles, then rotates front face to camera
- Export a callback/state so the parent knows which cube is currently "revealed" (index + elapsed since reveal)

#### 2. `src/components/intro/IntroCanvas.tsx` — Fixed Camera, No Orbit

- **Remove the orbiting camera rig** — set camera to a fixed elevated angle (e.g. `[0, 5, 8]` looking at `[0, 0, 0]`)
- Keep `TableSurface` static — no rotation
- Keep particles and lighting as-is

#### 3. `src/components/intro/PanteroIntroLoader.tsx` — Add Left-Side Detail Panel

- Track which cube is currently revealed (pass state up from CubeGroup or derive from elapsed time)
- When a cube lands and faces camera, show a **left-side panel** (roughly 40-50% width) with:
  - Feature icon (Lucide icon)
  - Feature name (large gold text)
  - Feature description (~2-3 sentences)
  - Animated entrance (slide in from left, fade)
  - Animated exit when next cube starts rolling
- Features data: AI Study Assistant, Token Mining, Marketplace, Social Profiles, Affiliate Store, Custom Themes, Quote Generator — each with a description
- The 3D canvas occupies the right half of the screen

#### 4. Layout Structure

```text
┌──────────────────────────────────────────────┐
│  [Skip]                                       │
│                                               │
│  ┌─────────────┐  ┌────────────────────────┐  │
│  │  Feature     │  │                        │  │
│  │  Detail      │  │   3D Canvas            │  │
│  │  Panel       │  │   (cubes rolling       │  │
│  │  (animated)  │  │    on fixed table)     │  │
│  │             │  │                        │  │
│  └─────────────┘  └────────────────────────┘  │
│                                               │
└──────────────────────────────────────────────┘
```

### Technical Details

- Camera: static `PerspectiveCamera` at `[3, 4, 7]`, `lookAt(0, 0.3, 0)` — no useFrame orbit
- Cube material: `meshPhysicalMaterial` with `color="#1a1a1a"`, `metalness=0.85`, `roughness=0.15`, `clearcoat=1.0` + gold `edgesGeometry` lines
- Detail panel: Framer Motion `AnimatePresence` with slide-in/out, absolute positioned left half
- Reveal tracking: derive from `elapsed` time — cube `i` reveals at `startTime + rollDuration + 0.8s`, next cube starts at `startTime + 6s`

