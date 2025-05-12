import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import useKeyboardControls from "./useKeyboardControls";

export default function Player({ position = [-13, 0.8, 15] }) {    // 전시관 1:26 2:20
  const ref = useRef();
  const keys = useKeyboardControls();
  const { camera } = useThree();

  // ✅ 속도 상태 추가
  const velocity = useRef(new Vector3());

  useFrame(() => {
    const body = ref.current;
    if (!body || typeof body.setLinvel !== "function") return;

    const targetDirection = new Vector3();
    if (keys.current["w"]) targetDirection.z -= 1;
    if (keys.current["s"]) targetDirection.z += 1;
    if (keys.current["a"]) targetDirection.x -= 1;
    if (keys.current["d"]) targetDirection.x += 1;

    // 방향값 적용 (카메라 기준으로 회전)
    if (targetDirection.length() > 0) {
      targetDirection.normalize().applyQuaternion(camera.quaternion);
    }

    // ✅ 부드러운 가감속 적용
    const acceleration = 0.5; // 가속도
    const damping = 0.9; // 감속도 (0.9~0.98 사이 추천)

    velocity.current.lerp(targetDirection.multiplyScalar(5), acceleration);
    velocity.current.multiplyScalar(damping); // 점점 감속

    body.setLinvel(
      {
        x: velocity.current.x,
        y: body.linvel().y,
        z: velocity.current.z,
      },
      true
    );

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
