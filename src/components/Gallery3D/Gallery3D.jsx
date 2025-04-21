import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PointerLockControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useLocation } from "react-router-dom";

import Player from "./Player";
import GalleryModel from "./GalleryModel";
import Painting from "./Painting";
import "./Gallery3D.css";

export default function Gallery3D() {
  const location = useLocation();
  const works = location.state?.works || [];

  return (
    <div className="gallery3d-wrapper fade-in">
      <h2 className="gallery-title">3D 작품 전시관</h2>

      <div className="gallery3d-container">
        <Canvas shadows camera={{ fov: 60, position: [-26, 2.5, 15] }} style={{ background: "#dcdcdc" }}>
          <ambientLight intensity={0.4} />
          <Environment preset="night" />
          <PointerLockControls />

          {/* 디버깅용 Helper */}
          <primitive object={new THREE.AxesHelper(3)} position={[-26, 1, 15]} />
          <primitive object={new THREE.GridHelper(10, 10)} position={[-26, 0, 15]} />

          <Physics gravity={[0, -9.81, 0]}>
            <RigidBody type="fixed" colliders="cuboid">
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[300, 300]} />
              </mesh>
            </RigidBody>

            <GalleryModel scale={2} />
            <Player />
            <Painting position={[-5, 2, 3.01]} imageUrl="/art1.png" title="작품 1" />
            <Painting position={[0, 2, 3.01]} imageUrl="/art2.jpeg" title="작품 2" />
            <Painting position={[5, 2, 3.01]} imageUrl="/art3.jpeg" title="작품 3" />
            {works.map((art, idx) => (
              <Painting
                key={art.id}
                position={[-20 + idx * 5, 2, 3.01]}
                imageUrl={art.src}
                title={art.title}
              />
            ))}
          </Physics>
        </Canvas>

        <div className="walk-guide">🧍 마우스 클릭 후 → WASD 걷기 가능</div>
      </div>

      <p className="gallery-description">
        실제 박물관처럼 캐릭터를 이동하여, 생동감 있게 전시를 관람하세요.
      </p>
    </div>
  );
}
