import React from "react";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Physics, RigidBody } from "@react-three/rapier";
import GalleryModel from "./GalleryModel";
import Player from "./Player";
import Painting from "./Painting";

export default function SceneContent({
  layout,
  works,
  theme,
  focusedId,
  leftFocusedId,
  rightFocusedId,
  infoId,
}) {
  const texturePaths = works.map((art) => art.imageUrl);
  const textures = useLoader(TextureLoader, texturePaths);
  const woodTexture = useLoader(TextureLoader, "/wood.jpg");
  const { scene: lampScene } = useGLTF("/models/led_projector_lamp_vega_c100.glb");

  return (
    <>
      <ambientLight intensity={0.4} />

      <Physics gravity={[0, -9.81, 0]}>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[300, 300]} />
          </mesh>
        </RigidBody>

        <GalleryModel path={layout.galleryModelPath} />
        <Player key={theme} position={layout.playerStart} theme={theme} />

        {works.flatMap((art, idx) => {
          const texture = textures[idx];
          const lamp = lampScene.clone(true);

          const isFocused =
            theme === "masterpiece"
              ? (art.id === leftFocusedId || art.id === rightFocusedId)
              : (art.id === focusedId);

          const { position: focusPos, rotation: focusRot } = layout.getFocusTransform(idx, works.length);

          if (theme === "circle" && works.length <= 6) {
            return [
              <Painting
                key={`${art.id}_outer`}
                texture={texture}
                woodTexture={woodTexture}
                lamp={lamp}
                title={art.title}
                description={art.description}
                isFocused={isFocused}
                isInfoShown={infoId === art.id}
                {...layout.getPosition(idx, 12)}
                focusPosition={focusPos}
                focusRotation={focusRot}
                focusScale={layout.focusScale}
                theme={theme}
              />,
              <Painting
                key={`${art.id}_mirror`}
                texture={texture}
                woodTexture={woodTexture}
                lamp={lamp}
                title={art.title}
                description={art.description}
                isFocused={isFocused}
                isInfoShown={infoId === art.id}
                {...layout.getPosition(idx + 6, 12)}
                focusPosition={focusPos}
                focusRotation={focusRot}
                focusScale={layout.focusScale}
                theme={theme}
              />
            ];
          }

          return (
            <Painting
              key={art.id}
              texture={texture}
              woodTexture={woodTexture}
              lamp={lamp}
              title={art.title}
              description={art.description}
              isFocused={isFocused}
              isInfoShown={infoId === art.id}
              {...layout.getPosition(idx, works.length)}
              focusPosition={focusPos}
              focusRotation={focusRot}
              focusScale={layout.focusScale}
              theme={theme}
            />
          );
        })}
      </Physics>
    </>
  );
}
