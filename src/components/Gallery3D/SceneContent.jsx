import React, { useMemo } from "react";
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

          // lampScene을 작품별로 clone (useMemo로 최적화)
          const lamp = useMemo(() => lampScene.clone(true), [lampScene]);

          if (theme === "circle" && works.length <= 6) {
            // 6개 이하라면 -> 12개로 복제
            const first = (
              <Painting
                key={`${art.id}_outer`}
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
                theme={theme}
              />
            );
            const mirror = (
              <Painting
                key={`${art.id}_mirror`}
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
                theme={theme}
              />
            );
            return [first, mirror];
          } else {
            // 7개 이상이면 1개만
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
