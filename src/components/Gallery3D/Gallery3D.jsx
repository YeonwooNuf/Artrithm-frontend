import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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
  const [focusedId, setFocusedId] = useState(null);
  const [infoId, setInfoId] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [typedText, setTypedText] = useState("");

  const captureCamera = (state) => {
    if (!cameraRef) setCameraRef(state.camera);
  };

  useEffect(() => {
    console.log("📦 works:", works);
  }, [works]);

  useEffect(() => {
    if (infoId) {
      const fullText = works.find((art) => art.id === infoId)?.description || "";
      setTypedText("");
      let index = 0;
      let currentText = "";
      const typing = setInterval(() => {
        currentText += fullText.charAt(index);
        setTypedText(currentText);
        index++;
        if (index >= fullText.length) clearInterval(typing);
      }, 40);
      return () => clearInterval(typing);
    } else {
      setTypedText("");
    }
  }, [infoId, works]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!cameraRef) return;
      const camPos = new THREE.Vector3();
      cameraRef.getWorldPosition(camPos);

      const threshold = 3;
      let closest = null;
      let minDist = Infinity;

      if (e.key.toLowerCase() === "r" || e.key.toLowerCase() === "f") {
        works.forEach((art, idx) => {
          const isRightWall = idx % 2 === 0;
          const gap = 7;
          const baseX = Math.floor(idx / 2) * gap;
          const artPos = new THREE.Vector3(baseX - 15, 2, isRightWall ? 27 : 3);

          const distance = camPos.distanceTo(artPos);
          if (distance < threshold && distance < minDist) {
            closest = art.id;
            minDist = distance;
          }
        });

        if (closest) {
          if (e.key.toLowerCase() === "r") setFocusedId(closest);
          if (e.key.toLowerCase() === "f") setInfoId((prev) => (prev === closest ? null : closest));
        }
      }

      if (e.key === "Escape") {
        setFocusedId(null);
        setInfoId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [works, cameraRef]);

  return (
    <div className="gallery3d-wrapper fade-in">
      <h2 className="gallery-title">3D 작품 전시관</h2>

      <div className="gallery3d-container">
        {/* HUD 설명창 */}
        {infoId && (
          <div
            className="hud-description"
            style={{
              position: "absolute",
              top: "80px",
              right: "50px",
              width: "300px",
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              fontSize: "14px",
              lineHeight: "1.5",
              zIndex: 10,
            }}
          >
            <strong>{works.find((art) => art.id === infoId)?.title || "제목 없음"}</strong>
            <p style={{ marginTop: "8px", whiteSpace: "pre-line" }}>{typedText || "설명 없음"}</p>
          </div>
        )}

        <Canvas
          shadows
          camera={{ fov: 60, position: [-26, 2.5, 15] }}
          style={{ background: "#dcdcdc" }}
          onCreated={captureCamera}
        >
          <ambientLight intensity={0.9} />
          <Environment preset="night" />
          <PointerLockControls />

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
                index={idx}
                imageUrl={art.src}
                title={art.title}
                description={art.description}
                isFocused={focusedId === art.id}
                isInfoShown={infoId === art.id}
              />
            ))}
          </Physics>
        </Canvas>

        <div className="walk-guide">
          🧍 마우스 클릭 후 → WASD 걷기 가능 / 🎨 R: 확대, F: 설명
        </div>
      </div>

      <p className="gallery-description">
        실제 박물관처럼 캐릭터를 이동하여, 생동감 있게 전시를 관람하세요.
      </p>
    </div>
  );
}