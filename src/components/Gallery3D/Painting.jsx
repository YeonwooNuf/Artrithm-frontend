import React, { useRef, useMemo } from "react";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Painting({ position, imageUrl, title }) {
  const texture = useTexture(imageUrl);
  const wood = useTexture("/wood.jpg");
  const { scene } = useGLTF("/models/led_projector_lamp_vega_c100.glb");
  const lamp = useMemo(() => scene.clone(true), [scene]);

  const groupRef = useRef();
  const lightRef = useRef();

  const width = 2.5;
  const height = 1.8;
  const frameWidth = 0.15;
  const frameDepth = 0.3;

  useFrame(() => {
    if (lightRef.current && groupRef.current) {
      lightRef.current.target = groupRef.current;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <mesh position={[0, 0, 0.01]} castShadow receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* 액자 프레임 4면 */}
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

      {/* 브라켓 */}
      <mesh position={[-width / 2 + 0.2, height / 2 + 0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.4]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
      </mesh>
      <mesh position={[width / 2 - 0.2, height / 2 + 0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.4]} />
        <meshStandardMaterial color="#666" metalness={1} roughness={0.4} />
      </mesh>

      {/* 조명 */}
      <primitive object={lamp} position={[0, -height / 2 - 7, 0.25]} scale={6} rotation={[Math.PI, Math.PI, Math.PI]} />
      <pointLight color="#ffdca8" decay={2} position={[0, height / 2 + 1.24, 0.26]} intensity={10} distance={0.28} />
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

      {/* 설명 라벨 */}
      <Html position={[0, -height / 2 - frameWidth - 0.3, 0]}>
        <div className="painting-label">{title}</div>
      </Html>
    </group>
  );
}
