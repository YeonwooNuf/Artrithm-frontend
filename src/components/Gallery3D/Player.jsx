import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import useKeyboardControls from "./useKeyboardControls";

export default function Player({ position = [-26, 0.8, 15] }) {
  const ref = useRef();
  const keys = useKeyboardControls();
  const { camera } = useThree();

  useFrame(() => {
    const body = ref.current;
    if (!body || typeof body.setLinvel !== "function") return;

    const speed = 5;
    const direction = new Vector3();

    if (keys.current["w"]) direction.z -= 0.1;
    if (keys.current["s"]) direction.z += 0.1;
    if (keys.current["a"]) direction.x -= 0.1;
    if (keys.current["d"]) direction.x += 0.1;

    if (direction.length() === 0) return;

    direction.normalize().multiplyScalar(speed);
    direction.applyQuaternion(camera.quaternion);

    body.setLinvel({
      x: direction.x,
      y: body.linvel().y,
      z: direction.z,
    }, true);

    const pos = body.translation();
    if (pos) camera.position.set(pos.x, pos.y + 1.5, pos.z);
  });

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      position={position}
      colliders="cuboid"
      enabledRotations={[false, false, false]}
      canSleep={false}
      friction={0}
    >
      <mesh>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}
