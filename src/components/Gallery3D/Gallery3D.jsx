import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PointerLockControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useLocation } from "react-router-dom";

import Player from "./Player";
import GalleryModel from "./GalleryModel";
import SceneContent from "./SceneContent";
import ArtistChatRoom from "../Chat/ArtistChatRoom";
import { getLayoutConfig } from "./layoutConfig";
import "./Gallery3D.css";

export default function Gallery3D() {
  const location = useLocation();
  const { works = [], theme = "modern" } = location.state || {};
  const layout = getLayoutConfig(theme);

  const [focusedId, setFocusedId] = useState(null);
  const [infoId, setInfoId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [typedText, setTypedText] = useState("");
  const pointerLockRef = useRef();

  const captureCamera = (state) => {
    if (!cameraRef) setCameraRef(state.camera);
  };

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
    const canvasWrapper = document.querySelector(".gallery3d-wrapper");
    if (canvasWrapper) {
      canvasWrapper.style.cursor = chatId ? "default" : "none";
    }
  }, [chatId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
      if (!cameraRef) return;

      const camPos = new THREE.Vector3();
      cameraRef.getWorldPosition(camPos);

      const threshold = 3;
      let closest = null;
      let minDist = Infinity;

      if (["r", "f", "t"].includes(e.key.toLowerCase())) {
        works.forEach((art, idx) => {
          const { position } = layout.getPosition(idx, works.length);
          const artPos = new THREE.Vector3(...position);
          const distance = camPos.distanceTo(artPos);
          if (distance < threshold && distance < minDist) {
            closest = art.id;
            minDist = distance;
          }
        });

        if (closest) {
          if (e.key.toLowerCase() === "r") setFocusedId(closest);
          if (e.key.toLowerCase() === "f") {
            setInfoId((prev) => (prev === closest ? null : closest));
            setChatId(null);
          }
          if (e.key.toLowerCase() === "t") {
            setChatId((prev) => (prev === closest ? null : closest));
            setInfoId(null);
            setTimeout(() => {
              pointerLockRef.current?.unlock();
            }, 50);
          }
        }
      }

      if (e.key === "Escape") {
        setFocusedId(null);
        setInfoId(null);
        setChatId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [works, cameraRef]);

  return (
    <div className="gallery3d-wrapper fade-in">
      <h2 className="gallery-title">3D 작품 전시관</h2>

      <div className="gallery3d-container">
        {infoId && (
          <div className="hud-description">
            <strong>{works.find((art) => art.id === infoId)?.title || "제목 없음"}</strong>
            <p>{typedText || "설명 없음"}</p>
          </div>
        )}

        {chatId && (
          <div className="hud-chat">
            <ArtistChatRoom artist={works.find((art) => art.id === chatId)?.artist} />
          </div>
        )}

        <Canvas
          shadows
          camera={{ fov: 60, position: [-26, 2.5, 15] }}
          style={{ background: "#dcdcdc" }}
          onCreated={captureCamera}
        >
          <PointerLockControls ref={pointerLockRef} />
          <Environment preset={layout.environment} background intensity={layout.environment === "night" ? 0.1 : 0.3} />

          <SceneContent
            layout={layout}
            works={works}
            theme={theme}
            focusedId={focusedId}
            infoId={infoId}
          />
        </Canvas>

        <div className="walk-guide">
          🧍 마우스 클릭 후 → WASD 걷기 가능 / 🎨 R: 확대, F: 설명, T: 작가와 채팅
        </div>
      </div>

      <p className="gallery-description">
        실제 박물관처럼 캐릭터를 이동하여, 생동감 있게 전시를 관람하세요.
      </p>
    </div>
  );
}
