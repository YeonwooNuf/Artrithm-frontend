import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import GalleryModel from "./GalleryModel";
import Player from "./Player";
import Painting from "./Painting";
import * as THREE from "three";

export default function SceneContent({ layout, works, theme, focusedId, infoId }) {
  const woodTexture = useTexture("/wood.jpg");
  woodTexture.encoding = THREE.sRGBEncoding;

  const { scene: lampScene } = useGLTF("/models/led_projector_lamp_vega_c100.glb");
  const lamp = lampScene.clone(true);

  return (
    <>
      <ambientLight intensity={0.9} />
      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[300, 300]} />
          </mesh>
        </RigidBody>

        <GalleryModel path={layout.galleryModelPath} />
        <Player key={theme} position={layout.playerStart} />

        {works.flatMap((art, idx) => {
          const texture = useTexture(art.src);
          texture.encoding = THREE.sRGBEncoding;

          if (layout.theme === "circle" && works.length <= 6) {
            // 6개 이하라면 -> 12개 복제
            const original = (
              <Painting
                key={`${art.id}_1`}
                texture={texture}
                woodTexture={woodTexture}
                lamp={lamp}
                title={art.title}
                description={art.description}
                isFocused={focusedId === art.id}
                isInfoShown={infoId === art.id}
                {...layout.getPosition(idx, 12)}
                focusPosition={layout.getFocusTransform().position}
                focusRotation={layout.getFocusTransform().rotation}
                focusScale={layout.focusScale}
              />
            );
            const mirrored = (
              <Painting
                key={`${art.id}_2`}
                texture={texture}
                woodTexture={woodTexture}
                lamp={lamp}
                title={art.title}
                description={art.description}
                isFocused={focusedId === art.id}
                isInfoShown={infoId === art.id}
                {...layout.getPosition(idx + 6, 12)}
                focusPosition={layout.getFocusTransform().position}
                focusRotation={layout.getFocusTransform().rotation}
                focusScale={layout.focusScale}
              />
            );
            return [original, mirrored];
          } else {
            // 7개 이상이면 그대로 1개만
            return (
              <Painting
                key={art.id}
                texture={texture}
                woodTexture={woodTexture}
                lamp={lamp}
                title={art.title}
                description={art.description}
                isFocused={focusedId === art.id}
                isInfoShown={infoId === art.id}
                {...layout.getPosition(idx, works.length)}
                focusPosition={layout.getFocusTransform().position}
                focusRotation={layout.getFocusTransform().rotation}
                focusScale={layout.focusScale}
                theme={theme}
              />
            );
          }
        })}
      </Physics>
    </>
  );
}
