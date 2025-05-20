import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { Vector3 } from "three";
import useKeyboardControls from "./useKeyboardControls";

export default function Player({ position = [-13, 0.8, 15], theme = "modern" }) {
  const ref = useRef();
  const keys = useKeyboardControls();
  const { camera } = useThree();
  const velocity = useRef(new Vector3());
  const [isGrounded, setIsGrounded] = useState(true);

  const cameraYOffset = theme === "masterpiece" ? 3.5 : 1.5;

  useFrame(() => {
    const body = ref.current;
    if (!body || typeof body.setLinvel !== "function") return;

    const targetDirection = new Vector3();
    if (keys.current["w"]) targetDirection.z -= 1;
    if (keys.current["s"]) targetDirection.z += 1;
    if (keys.current["a"]) targetDirection.x -= 1;
    if (keys.current["d"]) targetDirection.x += 1;

    if (targetDirection.length() > 0) {
      targetDirection.normalize().applyQuaternion(camera.quaternion);
    }

    const acceleration = 0.7;
    const damping = 0.9;
    const maxSpeed = theme === "masterpiece" ? 20 : 5; // 명화 전시관은 속도 빠르게

    velocity.current.lerp(targetDirection.multiplyScalar(maxSpeed), acceleration);
    velocity.current.multiplyScalar(damping);

    const currentY = body.linvel().y;
    const grounded = Math.abs(currentY) < 0.05; // 거의 y축 이동 없으면 땅에 있다고 간주
    setIsGrounded(grounded);

    // ✅ 점프 처리
    if (keys.current[" "] && grounded) {
      body.setLinvel({ x: velocity.current.x, y: 7, z: velocity.current.z }, true);
    } else {
      body.setLinvel({ x: velocity.current.x, y: currentY, z: velocity.current.z }, true);
    }

    const pos = body.translation();
    if (pos) camera.position.set(pos.x, pos.y + cameraYOffset, pos.z);
  });

  return (
    <RigidBody
      ref={ref}
      type="dynamic"
      position={position}
      enabledRotations={[false, false, false]}
      canSleep={false}
      friction={1}
      restitution={0.1}
    >
      <CapsuleCollider args={[0.8, 0.4]} />
      <mesh>
        <boxGeometry args={[0.4, 1.6, 0.4]} />
        <meshStandardMaterial transparent opacity={0.0} />
      </mesh>
    </RigidBody>
  );
}
