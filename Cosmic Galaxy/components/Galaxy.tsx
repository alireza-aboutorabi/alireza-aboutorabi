/// <reference types="@react-three/fiber" />
import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { GalaxyParameters } from "../types";

interface GalaxyProps {
  parameters: GalaxyParameters;
  dofRef: React.RefObject<any>;
  dofParams: any;
}

export const Galaxy: React.FC<GalaxyProps> = ({ parameters, dofRef, dofParams }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Generate galaxy data only when core parameters change
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, [
    parameters.count,
    parameters.radius,
    parameters.branches,
    parameters.spin,
    parameters.randomness,
    parameters.randomnessPower,
    parameters.insideColor,
    parameters.outsideColor
  ]);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [positions, colors]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    // Handle DoF Uniforms
    if (dofRef.current) {
      const material = dofRef.current.circleOfConfusionMaterial;
      if (material) {
        material.uniforms.focusDistance.value = dofParams.focusDistance;
        material.uniforms.focalLength.value = dofParams.focalLength;
      }
      dofRef.current.resolution.height = dofParams.height;
      dofRef.current.resolution.width = dofParams.width;
      dofRef.current.target = new THREE.Vector3(dofParams.focusX, dofParams.focusY, dofParams.focusZ);
      dofRef.current.blendMode.opacity.value = dofParams.opacity;
    }

    // Handle Mouse Interaction
    if (parameters.mouse) {
      particlesRef.current.rotation.x = THREE.MathUtils.lerp(
        particlesRef.current.rotation.x,
        state.mouse.y / 10,
        0.1
      );
      particlesRef.current.rotation.y = THREE.MathUtils.lerp(
        particlesRef.current.rotation.y,
        -state.mouse.x / 2,
        0.1
      );
    }

    // Handle Rotation Animation
    if (parameters.animate) {
      const elapsedTime = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = 0.05 * elapsedTime;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={parameters.size}
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </points>
  );
};