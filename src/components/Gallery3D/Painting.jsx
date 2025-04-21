import React, { useRef, useMemo } from "react";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Painting({ position, imageUrl, title, isFocused, rotation = [0, 0, 0] }) {
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

    if (groupRef.current) {
      const targetPos = isFocused ? new THREE.Vector3(-0.5, 3, 15) : new THREE.Vector3(...position);
      const targetScale = isFocused ? new THREE.Vector3(2.3, 2.3, 2.3) : new THREE.Vector3(1, 1, 1);  // 확대된 그림

      groupRef.current.position.lerp(targetPos, 0.1);
      groupRef.current.scale.lerp(targetScale, 0.1);
    }
  });

  return (
    <group ref={groupRef} rotation={isFocused ? [0, -Math.PI / 2, 0] : rotation}>
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

            {/* 설명 라벨 */}
            <Html position={[0, -height / 2 - frameWidth - 0.3, 0]}>
        <div className="painting-label">{title}</div>
      </Html>

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
  );
}