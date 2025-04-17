import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  useGLTF,
  useTexture,
  PointerLockControls,
} from "@react-three/drei";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Vector3 } from "three";
import * as THREE from "three";

/* 🎮 걷기 키 입력 관리 */
function useKeyboardControls() {
  const keys = useRef({});
  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

/* 🧍 플레이어 */
function Player({ position = [-8, 0.8, 18] }) {
  const ref = useRef();
  const keys = useKeyboardControls();
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(-8, 1.5, 15);
  }, [camera]);

  useFrame(() => {
    const body = ref.current;
    if (!body || typeof body.setLinvel !== "function") return;

    const speed = 5;
    const direction = new Vector3();

    if (keys.current["w"]) direction.z -= 1;
    if (keys.current["s"]) direction.z += 1;
    if (keys.current["a"]) direction.x -= 1;
    if (keys.current["d"]) direction.x += 1;

    if (direction.length() === 0) return;

    direction.normalize().multiplyScalar(speed);
    direction.applyQuaternion(camera.quaternion);

    const velocity = {
      x: direction.x,
      y: body.linvel().y,
      z: direction.z,
    };

    console.log("💨 이동 속도:", velocity);

    body.setLinvel(velocity, true);

    const pos = body.translation();
    if (pos) camera.position.set(pos.x, pos.y + 1.5, pos.z);
  });

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      position={position}
      colliders="cuboid"
      enabledRotations={[false, false, false]}
      canSleep={false}
      friction={0}
    >
      <mesh>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial color="hotpink" transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}

/* 🏛️ 전시관 GLB */
function GalleryModel({ scale = 2 }) {
  const { scene } = useGLTF("/models/vr_art_gallery_01.glb");
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.material.wireframe = false;
      }
    });
  }, [scene]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={scale} position={[-8, 0, 15]} />
    </RigidBody>
  );
}

/* 🖼️ 그림 하나 */
function Painting({ position, imageUrl, title }) {
  const texture = useTexture(imageUrl);
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[2.5, 1.8]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      <Html position={[0, -1.2, 0]}>
        <div className="bg-white/80 text-black px-2 py-1 rounded shadow text-sm">
          {title}
        </div>
      </Html>
    </group>
  );
}

/* 🖼️ 전체 씬 */
export default function Gallery3D_Walkable() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <Canvas shadows camera={{ fov: 35, position: [-8, 2, 18] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
        <Environment preset="sunset" />
        <PointerLockControls />

        {/* 디버깅용 시각 기준 */}
        <primitive object={new THREE.AxesHelper(3)} position={[-8, 1, 15]} />
        <primitive
          object={new THREE.GridHelper(10, 10)}
          position={[-8, 0, 15]}
        />

        <Physics gravity={[0, -9.81, 0]}>
          {/* 바닥 */}
          <RigidBody type="fixed" colliders="cuboid">
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -1, 0]}
              receiveShadow
            >
              <planeGeometry args={[300, 300]} />
              <meshStandardMaterial color="#e6e6e6" />
            </mesh>
          </RigidBody>

          {/* 모델 */}
          <GalleryModel scale={2} />

          {/* 플레이어 */}
          <Player />

          {/* 그림들 */}
          <Painting
            position={[-5, 1.5, 2]}
            imageUrl="/art1.png"
            title="작품 1"
          />
          <Painting
            position={[0, 1.5, 2]}
            imageUrl="/art2.jpeg"
            title="작품 2"
          />
          <Painting
            position={[5, 1.5, 2]}
            imageUrl="/art3.jpeg"
            title="작품 3"
          />
        </Physics>
      </Canvas>

      <div className="absolute top-2 left-2 z-50 bg-black/70 text-white px-4 py-2 rounded text-sm">
        🧍 마우스 클릭 후 → WASD 걷기 가능
      </div>
    </div>
  );
}
