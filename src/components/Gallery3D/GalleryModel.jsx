import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function GalleryModel({
  path = "/models/vr_art_gallery_01.glb", // ✅ 테마별 경로
  scale = 2,
  position = [0, 0, 0],                   // ✅ 위치도 조절 가능하게
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

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive object={scene} scale={scale} position={position} />
    </RigidBody>
  );
}
