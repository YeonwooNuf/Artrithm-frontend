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

        {works.map((art, idx) => {
          const { position, rotation } = layout.getPosition(idx, works.length);
          const { position: focusPosition, rotation: focusRotation } = layout.getFocusTransform();

          const texture = useTexture(art.src);
          texture.encoding = THREE.sRGBEncoding;

          const { scene: lampScene } = useGLTF("/models/led_projector_lamp_vega_c100.glb");
          const lamp = lampScene.clone(true);

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
              position={position}
              rotation={rotation}
              focusPosition={focusPosition}
              focusRotation={focusRotation}
              focusScale={layout.focusScale}
            />
          );
        })}
      </Physics>
    </>
  );
}
