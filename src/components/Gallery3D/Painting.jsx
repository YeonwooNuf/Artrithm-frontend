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

  const width = theme === "masterpiece" ? 7.5 : 2.5;
  const height = theme === "masterpiece" ? 5.4 : 1.8;

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
    setOpacity((prev) => (isFocused ? Math.min(prev + 0.05, 1) : Math.max(prev - 0.05, 0)));
  });

  const ArtworkMesh = (opacityValue = 1, isFocusedState = false) => (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry
        args={[
          isFocusedState ? width * focusScale : width,
          isFocusedState ? height * focusScale : height,
        ]}
      />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={opacityValue}
        side={THREE.DoubleSide}
      />
    </mesh>
  );

  const FrameMeshes = (opacityValue = 1, isFocusedState = false) => (
    <>
      {[
        [0, height / 2 + frameWidth / 2, 0],
        [0, -height / 2 - frameWidth / 2, 0],
        [-width / 2 - frameWidth / 2, 0, 0],
        [width / 2 + frameWidth / 2, 0, 0],
      ].map((pos, i) => (
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
          {theme === "circle" || theme === "masterpiece" ? (
            <meshStandardMaterial
              color="#333333"
              roughness={0.4}
              transparent
              opacity={opacityValue}
              side={THREE.DoubleSide}
            />
          ) : (
            <meshStandardMaterial
              map={woodTexture}
              transparent
              opacity={opacityValue}
              side={THREE.DoubleSide}
            />
          )}
        </mesh>
      ))}
    </>
  );

  const FloatingGroup = (offsetX = 0, rotationY = 0) => (
    <group
      position={[
        focusPosition[0] + offsetX,
        focusPosition[1],
        focusPosition[2],
      ]}
      rotation={[focusRotation[0], focusRotation[1] + rotationY, focusRotation[2]]}
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
              position={[1.7, height / 2 - 0.5, -0.07]}
              size={0.15}
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

          {/* masterpiece나 modern 테마만 조명 */}
          {theme !== "circle" && (
            <>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * (width / 2 - 0.2), height / 2 + 0.7, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 1.4]} />
                  <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
                </mesh>
              ))}
              <primitive
                object={lamp}
                position={[0, -height / 2 - 7.1, 0.17]}
                scale={6}
                rotation={[Math.PI, Math.PI, Math.PI]}
              />
              <pointLight
                color="#ffdca8"
                decay={2}
                position={[0, height / 2 + 1.14, 0.23]}
                intensity={10}
                distance={0.27}
              />
              <spotLight
                color="#ffdca8"
                decay={2}
                ref={lightRef}
                position={[0, height / 2 + 1.5, 0.9]}
                angle={0.6}
                penumbra={0.01}
                intensity={20}
                distance={4}
                castShadow
              />
            </>
          )}
        </group>
      </group>

      {isFocused && (theme === "circle" ? FloatingGroup(0, 0) : FloatingGroup(0))}
    </>
  );
}
