import React, { useRef, useState, useEffect } from "react";
import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Painting({
  position,
  rotation,
  focusPosition,
  focusRotation,
  focusScale = 8,
  texture,
  woodTexture,
  lamp,
  title,
  description,
  isFocused,
  theme,
}) {
  const groupRef = useRef();
  const lightRef = useRef();
  const textRef = useRef();
  const [opacity, setOpacity] = useState(0);

  const width = theme === "masterpiece" ? 11.25 : 2.5;
  const height = theme === "masterpiece" ? 8.1 : 1.8;
  const frameWidth = 0.15;
  const frameDepth = 0.3;

  useEffect(() => {
    if (textRef.current) {
      textRef.current.geometry.center();
    }
  }, [title]);

  useFrame(() => {
    if (lightRef.current && groupRef.current) {
      lightRef.current.target = groupRef.current;
    }
    setOpacity((prev) =>
      isFocused ? Math.min(prev + 0.05, 1) : Math.max(prev - 0.05, 0)
    );
  });

  const ArtworkMesh = (opacityValue = 1, isFocusedState = false) => (
    <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
      <boxGeometry
        args={[
          isFocusedState ? width * focusScale : width,
          isFocusedState ? height * focusScale : height,
          0.01,
        ]}
      />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={opacityValue}
        side={THREE.DoubleSide}
        toneMapped={false}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );

  const FrameMeshes = (opacityValue = 1, isFocusedState = false) => (
    <>
      {[0, 1, 2, 3].map((i) => {
        const pos = [
          i === 0 ? 0 : i === 1 ? 0 : i === 2 ? -width / 2 - frameWidth / 2 : width / 2 + frameWidth / 2,
          i === 0
            ? height / 2 + frameWidth / 2
            : i === 1
              ? -height / 2 - frameWidth / 2
              : 0,
          0,
        ];
        return (
          <mesh key={i} position={pos.map((v) => (isFocusedState ? v * focusScale : v))}>
            <boxGeometry
              args={
                i < 2
                  ? [
                      (width + frameWidth * 2) * (isFocusedState ? focusScale : 1),
                      frameWidth * (isFocusedState ? focusScale : 1),
                      frameDepth,
                    ]
                  : [
                      frameWidth * (isFocusedState ? focusScale : 1),
                      height * (isFocusedState ? focusScale : 1),
                      frameDepth,
                    ]
              }
            />
            <meshStandardMaterial
              {...(theme === "circle" || theme === "masterpiece"
                ? { color: "#333333", roughness: 0.4 }
                : { map: woodTexture })}
              transparent
              opacity={opacityValue}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </>
  );

  const FloatingGroup = (offsetX = 0) => (
    <group
      position={[focusPosition[0] + offsetX, focusPosition[1], focusPosition[2]]}
      rotation={focusRotation}
    >
      {ArtworkMesh(opacity, true)}
      {FrameMeshes(opacity, true)}
    </group>
  );

  return (
    <>
      <group ref={groupRef} position={position} rotation={rotation}>
        <group name="ArtworkWithLights">
          {ArtworkMesh()}
          {FrameMeshes()}

          {title && (
            <Text3D
              ref={textRef}
              position={[
                theme === "masterpiece" ? width / 2 - 1.3 : 1.7,
                theme === "masterpiece" ? height / 2 + 1 : height / 2 - 0.5,
                -0.07,
              ]}
              size={theme === "masterpiece" ? 0.4 : 0.15}
              bevelEnabled
              bevelSize={0.005}
              height={0.001}
              depth={0.01}
              curveSegments={12}
              font="/fonts/Nanum NaMuJeongWeon_Regular.json"
            >
              {title}
              <meshStandardMaterial color="black" />
            </Text3D>
          )}

          {theme !== "circle" && (
            <>
              {[-1, 1].map((side) => (
                <mesh
                  key={side}
                  position={[
                    side * (width / 2 - 0.2),
                    height / 2 + (theme === "masterpiece" ? 2 : 0.7),
                    0,
                  ]}
                >
                  <cylinderGeometry
                    args={[0.02, 0.02, theme === "masterpiece" ? 2.8 : 1.4]}
                  />
                  <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
                </mesh>
              ))}

              <primitive
                object={lamp}
                position={[0, -height / 2 - (theme === "masterpiece" ? 6 : 7.1), 0.17]}
                scale={theme === "masterpiece" ? 10 : 6}
                rotation={[Math.PI, Math.PI, Math.PI]}
              />

              <pointLight
                color="#ffdca8"
                decay={2}
                position={[0, height / 2 + (theme === "masterpiece" ? 3 : 1.14), 0.23]}
                intensity={theme === "masterpiece" ? 30 : 10}
                distance={theme === "masterpiece" ? 2 : 0.27}
              />

              <spotLight
                color="#ffdca8"
                decay={2}
                ref={lightRef}
                position={[0, height / 2 + (theme === "masterpiece" ? 3 : 1.5), 0.9]}
                angle={theme === "masterpiece" ? 1 : 0.6}
                penumbra={0.01}
                intensity={theme === "masterpiece" ? 100 : 20}
                distance={theme === "masterpiece" ? 30 : 4}
                castShadow
              />
            </>
          )}
        </group>
      </group>

      {isFocused && (theme === "circle" ? FloatingGroup(0) : FloatingGroup(0))}
    </>
  );
}