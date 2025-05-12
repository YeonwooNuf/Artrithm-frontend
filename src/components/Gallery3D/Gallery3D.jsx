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
  // 라우팅된 페이지의 상태에서 작품 리스트와 테마 정보 가져오기
  const location = useLocation();
  const { works = [], theme = "modern" } = location.state || {};
  const layout = getLayoutConfig(theme);  // 테마별 레이아웃 설정 가져오기

  // 상태 관리
  const [focusedId, setFocusedId] = useState(null); // 확대된 작품 ID
  const [infoId, setInfoId] = useState(null);       // 설명창에 표시 중인 작품 ID
  const [chatId, setChatId] = useState(null);       // 채팅창에 표시 중인 작가 ID
  const [cameraRef, setCameraRef] = useState(null); // 카메라 참조 저장
  const [typedText, setTypedText] = useState("");   // 설명 타이핑 효과 텍스트
  const pointerLockRef = useRef();                  // 포인터 잠금 컨트롤용

  // cameraRef 저장 (한 번만)
  const captureCamera = (state) => {
    if (!cameraRef) setCameraRef(state.camera);
  };

  // 설명창이 열릴 때마다 글자 타이핑 효과 실행
  useEffect(() => {
    if (infoId) {
      const fullText =
        works.find((art) => art.id === infoId)?.description || "";
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

  // 채팅창 열릴 때 커서 보이도록 설정
  useEffect(() => {
    const canvasWrapper = document.querySelector(".gallery3d-wrapper");
    if (canvasWrapper) {
      canvasWrapper.style.cursor = chatId ? "default" : "none";
    }
  }, [chatId]);

  // 키보드 입력 이벤트 처리 (R, F, T, ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") return;
      if (!cameraRef) return;

      const camPos = new THREE.Vector3();
      cameraRef.getWorldPosition(camPos);

      const threshold = 3; // 근처 판정 거리
      let closest = null;
      let minDist = Infinity;

      if (["r", "f", "t"].includes(e.key.toLowerCase())) {
        // 가장 가까운 작품 찾기
        works.forEach((art, idx) => {
          const { position } = layout.getPosition(idx, works.length);
          const artPos = new THREE.Vector3(...position);
          const distance = camPos.distanceTo(artPos);
          if (distance < threshold && distance < minDist) {
            closest = art.id;
            minDist = distance;
          }
        });

        // 키보드 입력에 따라 상태 변경
        if (closest) {

          if (e.key.toLowerCase() === "r") setFocusedId(closest); // 확대
          if (e.key.toLowerCase() === "f") {                      // 설명
            setInfoId((prev) => (prev === closest ? null : closest));
            setChatId(null);
          }
          if (e.key.toLowerCase() === "t") {                      // 채팅
            setChatId((prev) => (prev === closest ? null : closest));
            setInfoId(null);
            setTimeout(() => {
              pointerLockRef.current?.unlock(); // 채팅 시 포인터 잠금 해제
            }, 50);
          }
        }
      }

      if (e.key === "Escape") {
        setFocusedId(null);
        setInfoId(null);
        setChatId(null); // ESC로 모두 닫기
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [works, cameraRef]);

  return (
    <div className="gallery3d-wrapper fade-in">
      <h2 className="gallery-title">3D 작품 전시관</h2>

      <div className="gallery3d-container">
        {/* 설명창 */}
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
            <strong>
              {works.find((art) => art.id === infoId)?.title || "제목 없음"}
            </strong>
            <p style={{ marginTop: "8px", whiteSpace: "pre-line" }}>
              {typedText || "설명 없음"}
            </p>
          </div>
        )}

        {/* 채팅창 */}
        {chatId && (
          <div className="hud-chat">
            <ArtistChatRoom artist={works.find((art) => art.id === chatId)?.artist} />
          </div>
        )}

        {/* 렌더링 캔버스 */}
        <Canvas
          shadows
          camera={{ fov: 60, position: [-26, 2.5, 15] }}
          style={{ background: "#dcdcdc" }}
          onCreated={captureCamera}
        >
          <PointerLockControls ref={pointerLockRef} />
          
          {/* 환경광 설정 (배경 포함) */}
          <Environment
            preset={layout.environment}         // city / night / sunset 등
            background                          // 하늘 배경 렌더링
            intensity={
              layout.environment === "night"    // ✨ 문제는 여기: background=true이므로
                ? 0.1                           // intensity는 조명에 적용되지 않음!
                : 0.3
            }
          />

          {/* 본 컨텐츠 */}
          <SceneContent
            layout={layout}
            works={works}
            theme={theme}
            focusedId={focusedId}
            infoId={infoId}
          />

          <primitive object={new THREE.AxesHelper(3)} position={[-26, 1, 15]} />
          <primitive
            object={new THREE.GridHelper(10, 10)}
            position={[-26, 0, 15]}
          />

          <Physics gravity={[0, -9.81, 0]}>
            <RigidBody type="fixed" colliders="cuboid">
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1, 0]}
                receiveShadow
              >
                <planeGeometry args={[300, 300]} />
              </mesh>
            </RigidBody>

            <GalleryModel scale={2} />
            <Player />
            <Painting
              position={[-5, 2, 3.01]}
              imageUrl="/art1.png"
              title="작품 1"
            />
            <Painting
              position={[0, 2, 3.01]}
              imageUrl="/art2.jpeg"
              title="작품 2"
            />
            <Painting
              position={[5, 2, 3.01]}
              imageUrl="/art3.jpeg"
              title="작품 3"
            />

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
          🧍 마우스 클릭 후 → WASD 걷기 가능 / 🎨 R: 확대, F: 설명, T: 작가와 채팅
        </div>
      </div>

      <p className="gallery-description">
        실제 박물관처럼 캐릭터를 이동하여, 생동감 있게 전시를 관람하세요.
      </p>
    </div>
  );
}
