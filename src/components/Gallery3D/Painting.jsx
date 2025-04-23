import React, { useRef, useMemo, useState, useEffect } from "react";
import { useGLTF, useTexture, Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Painting({ index, imageUrl, title, description, isFocused, isInfoShown }) {
  const texture = useTexture(imageUrl);
  const wood = useTexture("/wood.jpg");
  const { scene } = useGLTF("/models/led_projector_lamp_vega_c100.glb");
  const lamp = useMemo(() => scene.clone(true), [scene]);

  const groupRef = useRef();
  const lightRef = useRef();
  const textRef = useRef();
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));

  const width = 2.5;
  const height = 1.8;
  const frameWidth = 0.15;
  const frameDepth = 0.3;

  const isRightWall = index % 2 === 0;
  const gap = 7;
  const baseX = Math.floor(index / 2) * gap;
  const position = isRightWall
    ? [baseX - 15, 2, 27]
    : [baseX - 15, 2, 3];
  const rotation = isRightWall ? [0, Math.PI, 0] : [0, 0, 0];

  const breakTextIntoLines = (text, maxCharsPerLine = 10) => {
    const lines = [];
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
      lines.push(text.slice(i, i + maxCharsPerLine));
    }
    return lines;
  };
  
  const lines = breakTextIntoLines(title, 9); // 최대 8자씩 줄바꿈

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
      setScale((prev) => prev.lerp(new THREE.Vector3(8, 8, 8), 0.1));
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

          <mesh position={[0, height / 2 + frameWidth / 2, 0]}>
            <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
            <meshStandardMaterial map={wood} />
          </mesh>
          <mesh position={[0, -height / 2 - frameWidth / 2, 0]}>
            <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
            <meshStandardMaterial map={wood} />
          </mesh>
          <mesh position={[-width / 2 - frameWidth / 2, 0, 0]}>
            <boxGeometry args={[frameWidth, height, frameDepth]} />
            <meshStandardMaterial map={wood} />
          </mesh>
          <mesh position={[width / 2 + frameWidth / 2, 0, 0]}>
            <boxGeometry args={[frameWidth, height, frameDepth]} />
            <meshStandardMaterial map={wood} />
          </mesh>

          {lines.map((line, idx) => (
            <Text3D
              key={idx}
              ref={idx === 0 ? textRef : null} // 첫 줄만 중심 정렬
              position={[1.7, height / 2 - 0.5 - idx * 0.3, -0.07]} // Y축 아래로 줄 내려감
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

          <mesh position={[-width / 2 + 0.2, height / 2 + 0.7, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.4]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
          </mesh>
          <mesh position={[width / 2 - 0.2, height / 2 + 0.7, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 1.4]} />
            <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
          </mesh>

          <primitive object={lamp} position={[0, -height / 2 - 7.1, 0.17]} scale={6} rotation={[Math.PI, Math.PI, Math.PI]} />
          <pointLight color="#ffdca8" decay={2} position={[0, height / 2 + 1.14, 0.23]} intensity={10} distance={0.27} />
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
        </group>
      </group>

      {opacity > 0 && (
        <group
          position={[-0.5, 3, 15]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={scale}
        >
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial map={texture} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, height / 2 + frameWidth / 2, 0]}>
            <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
            <meshStandardMaterial map={wood} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, -height / 2 - frameWidth / 2, 0]}>
            <boxGeometry args={[width + frameWidth * 2, frameWidth, frameDepth]} />
            <meshStandardMaterial map={wood} transparent opacity={opacity} />
          </mesh>
          <mesh position={[-width / 2 - frameWidth / 2, 0, 0]}>
            <boxGeometry args={[frameWidth, height, frameDepth]} />
            <meshStandardMaterial map={wood} transparent opacity={opacity} />
          </mesh>
          <mesh position={[width / 2 + frameWidth / 2, 0, 0]}>
            <boxGeometry args={[frameWidth, height, frameDepth]} />
            <meshStandardMaterial map={wood} transparent opacity={opacity} />
          </mesh>
        </group>
      )}
    </>
  );
}
