import React, { useRef, useMemo, useState, useEffect } from "react";
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
  theme, // ✅ theme prop 추가 (modern/circle 구분용)
}) {
  const groupRef = useRef();
  const lightRef = useRef();
  const textRef = useRef();
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));

  const width = 2.5;
  const height = 1.8;
  const frameWidth = 0.15;
  const frameDepth = 0.3;

  const breakTextIntoLines = (text, maxCharsPerLine = 10) => {
    const lines = [];
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
      lines.push(text.slice(i, i + maxCharsPerLine));
    }
    return lines;
  };

  const lines = breakTextIntoLines(title, 9);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.geometry.center();
    }
  }, [title]);

  useFrame(() => {
    if (lightRef.current && groupRef.current) {
      lightRef.current.target = groupRef.current;
    }

    if (isFocused) {
      setOpacity((prev) => Math.min(prev + 0.05, 1));
      setScale((prev) => prev.lerp(new THREE.Vector3(focusScale, focusScale, focusScale), 0.1));
    } else {
      setOpacity((prev) => Math.max(prev - 0.05, 0));
      setScale((prev) => prev.lerp(new THREE.Vector3(1, 1, 1), 0.1));
    }
  });

  return (
    <>
      <group ref={groupRef} position={position} rotation={rotation}>
        <group name="ArtworkWithLights">
          <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={texture} />
          </mesh>

          {[
            [0, height / 2 + frameWidth / 2, 0],
            [0, -height / 2 - frameWidth / 2, 0],
            [-width / 2 - frameWidth / 2, 0, 0],
            [width / 2 + frameWidth / 2, 0, 0],
          ].map((pos, i) => (
            <mesh key={i} position={pos}>
              <boxGeometry
                args={i < 2
                  ? [width + frameWidth * 2, frameWidth, frameDepth]
                  : [frameWidth, height, frameDepth]}
              />
              {/* ✅ theme에 따라 액자 재질 다르게 */}
              {theme === "circle" ? (
                <meshStandardMaterial color="#333333" />
              ) : (
                <meshStandardMaterial map={woodTexture} />
              )}
            </mesh>
          ))}

          {lines.map((line, idx) => (
            <Text3D
              key={idx}
              ref={idx === 0 ? textRef : null}
              position={[1.7, height / 2 - 0.5 - idx * 0.3, -0.07]}
              size={0.15}
              bevelEnabled
              bevelSize={0.005}
              height={0.001}
              depth={0.01}
              curveSegments={12}
              font="/fonts/Nanum NaMuJeongWeon_Regular.json"
            >
              {line}
              <meshStandardMaterial color="black" />
            </Text3D>
          ))}

          {theme !== "circle" && (
            // ✅ 조명과 지지대는 modern만 렌더링
            <>
              {[-1, 1].map((side) => (
                <mesh
                  key={side}
                  position={[side * (width / 2 - 0.2), height / 2 + 0.7, 0]}
                >
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

      {isFocused && (
        <group position={focusPosition} rotation={focusRotation} scale={scale}>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={texture} transparent opacity={opacity} />
          </mesh>
          {[
            [0, height / 2 + frameWidth / 2, 0],
            [0, -height / 2 - frameWidth / 2, 0],
            [-width / 2 - frameWidth / 2, 0, 0],
            [width / 2 + frameWidth / 2, 0, 0],
          ].map((pos, i) => (
            <mesh key={i} position={pos}>
              <boxGeometry
                args={i < 2
                  ? [width + frameWidth * 2, frameWidth, frameDepth]
                  : [frameWidth, height, frameDepth]}
              />
              {theme === "circle" ? (
                <meshStandardMaterial color="#333333" roughness={0.4} transparent opacity={opacity} />
              ) : (
                <meshStandardMaterial map={woodTexture} transparent opacity={opacity} />
              )}
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}