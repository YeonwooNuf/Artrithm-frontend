import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function GalleryModel({
  path = "/models/vr_art_gallery_01.glb", // 테마별 경로
  scale = 2,
  position, // 명시적 전달 없을 시 자동 처리
}) {
  const { scene } = useGLTF(path);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene]);

  // ✅ 명화 전시관(dark_room.glb)일 경우 바닥을 살짝 올림
  const adjustedPosition = position || (
    path.includes("dark_room") ? [0, 1.2, 0] : [0, 0.02, 0]
  );

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={scale} position={adjustedPosition} />
    </RigidBody>
  );
}
