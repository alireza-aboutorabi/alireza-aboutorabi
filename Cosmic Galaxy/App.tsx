/// <reference types="@react-three/fiber" />
import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { useControls, folder } from "leva";
import { Galaxy } from "./components/Galaxy.tsx";
import { Nucleus } from "./components/Nucleus.tsx";

const Effects = React.forwardRef(({ dofParams }: any, ref: any) => {
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={ref} bokehScale={dofParams.bokehScale} />
    </EffectComposer>
  );
});

export default function App() {
  const dofRef = useRef<any>(null);

  // Leva Controls Configuration
  const galaxyParams = useControls({
    Galaxy: folder({
      count: { min: 100, max: 1000000, value: 100000, step: 100 },
      size: { min: 0.001, max: 0.1, value: 0.01, step: 0.001 },
      radius: { min: 0.1, max: 20, value: 5, step: 0.1 },
      branches: { min: 2, max: 20, value: 3, step: 1 },
      spin: { min: -5, max: 5, value: 1, step: 0.01 },
      randomness: { min: 0, max: 2, value: 0.3, step: 0.01 },
      randomnessPower: { min: 1, max: 10, value: 3, step: 0.01 },
      insideColor: { value: "#ff6030" },
      outsideColor: { value: "#1b3984" },
    }),
    Animation: folder({
      animate: true,
      mouse: true,
    }),
  });

  const dofParams = useControls({
    DoF: folder({
      opacity: { min: 0, max: 1, value: 1, step: 0.01 },
      focusDistance: { min: 0, max: 1.0, value: 0.05, step: 0.001 },
      focalLength: { min: 0, max: 0.1, value: 0.05, step: 0.0001 },
      bokehScale: { min: 0, max: 10, value: 1, step: 0.1 },
      width: { min: 0, max: 1280, value: 480 },
      height: { min: 0, max: 1280, value: 480 },
      focusX: { min: -1, max: 1, value: 0 },
      focusY: { min: -1, max: 1, value: 0 },
      focusZ: { min: -1, max: 1, value: 0 },
    }),
  });

  return (
    <div className="w-full h-screen bg-black">
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-3xl font-light tracking-widest text-white/80 uppercase">
          Cosmic Galaxy
        </h1>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-tighter">
          Procedural Particle System
        </p>
      </div>

      <Canvas
        flat
        camera={{ position: [0, 4, 8], fov: 60 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#000000"]} />

        <Suspense fallback={null}>
          <Galaxy
            parameters={galaxyParams as any}
            dofRef={dofRef}
            dofParams={dofParams}
          />
          <Nucleus size={0.15} />
        </Suspense>

        <Effects ref={dofRef} dofParams={dofParams} />

        <axesHelper args={[2]} />
      </Canvas>

      {/* Footer info */}
      <div className="absolute bottom-6 left-6 z-10 text-[10px] text-white/30 uppercase tracking-[0.2em] pointer-events-none">
        Built with R3F & Three.js
      </div>
    </div>
  );
}
